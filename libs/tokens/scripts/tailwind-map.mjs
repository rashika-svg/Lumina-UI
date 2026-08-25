/**
 * Lumina UI — Tailwind mapping.
 *
 * Turns the resolved Style Dictionary token set into Tailwind theme entries.
 * Crucially, every value is emitted as a `var(--lui-…)` reference — the *same*
 * custom property the Angular components consume — not a frozen colour. That is
 * what lets a Tailwind class (`bg-accent`, `text-fg-muted`) respect the runtime
 * `data-theme` swap and the accent picker exactly like the rest of the system.
 *
 * Two shapes are produced from one map:
 *   • a Tailwind v3 preset (`theme.extend`)
 *   • a Tailwind v4 `@theme` block (CSS custom properties in TW's namespaces)
 */

const PREFIX = 'lui';

/** The bare token name (no `lui-` prefix), whatever SD hands us. */
const bareName = (token) =>
  token.name.startsWith(`${PREFIX}-`)
    ? token.name.slice(PREFIX.length + 1)
    : token.name;

/** The exact CSS custom property the CSS build emits for this token. */
const cssVar = (bare) => `var(--${PREFIX}-${bare})`;

/** Tailwind-friendly colour group names (avoid `bg-bg-*`). */
const renameColorGroup = (group) => (group === 'bg' ? 'surface' : group);

/** Colour groups that are not usable as Tailwind colour utilities. */
const SKIP_COLOR_GROUPS = new Set(['gradient']);

/**
 * Build the Tailwind **v3** `theme.extend` object from the token list.
 * `default` becomes Tailwind's `DEFAULT` so `bg-accent` resolves.
 */
export function buildPresetExtend(tokens) {
  const buckets = {
    colors: {},
    spacing: {},
    borderRadius: {},
    boxShadow: {},
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    letterSpacing: {},
    zIndex: {},
    transitionDuration: {},
    transitionTimingFunction: {},
    borderWidth: {},
    opacity: {},
  };

  const setNested = (root, keys, value) => {
    let node = root;
    keys.forEach((raw, i) => {
      const key = raw === 'default' ? 'DEFAULT' : raw;
      if (i === keys.length - 1) node[key] = value;
      else node = node[key] ??= {};
    });
  };

  const flat = (bucket, prefix) => (bare) =>
    (buckets[bucket][bare.slice(prefix.length)] = cssVar(bare));

  // Longest prefixes first so `font-line-height-` wins over `font-`.
  const RULES = [
    ['font-family-', flat('fontFamily', 'font-family-')],
    ['font-size-', flat('fontSize', 'font-size-')],
    ['font-weight-', flat('fontWeight', 'font-weight-')],
    ['font-line-height-', flat('lineHeight', 'font-line-height-')],
    ['font-letter-spacing-', flat('letterSpacing', 'font-letter-spacing-')],
    ['space-', flat('spacing', 'space-')],
    ['shadow-', flat('boxShadow', 'shadow-')],
    ['z-index-', flat('zIndex', 'z-index-')],
    ['duration-', flat('transitionDuration', 'duration-')],
    ['easing-', flat('transitionTimingFunction', 'easing-')],
    ['border-width-', flat('borderWidth', 'border-width-')],
    ['opacity-', flat('opacity', 'opacity-')],
    [
      'radius-',
      (bare) => setNested(buckets.borderRadius, [bare.slice(7)], cssVar(bare)),
    ],
  ];

  for (const token of tokens) {
    const bare = bareName(token);

    if (bare.startsWith('color-')) {
      const parts = bare.slice('color-'.length).split('-');
      if (SKIP_COLOR_GROUPS.has(parts[0])) continue;
      const [group, ...rest] = parts;
      setNested(
        buckets.colors,
        [renameColorGroup(group), ...rest],
        cssVar(bare),
      );
      continue;
    }

    for (const [prefix, apply] of RULES) {
      if (bare.startsWith(prefix)) {
        apply(bare);
        break;
      }
    }
    // `breakpoint-` is intentionally skipped: media queries cannot read CSS
    // custom properties, so screens must stay literal (and are not themed).
    // `size-`, `state-`, `type-` are composite/non-utility scales — skipped.
  }

  const extend = {};
  for (const [key, value] of Object.entries(buckets)) {
    if (Object.keys(value).length) extend[key] = value;
  }
  return extend;
}

/** Token-name prefix → Tailwind v4 `@theme` namespace. */
const V4_NAMESPACES = [
  ['font-family-', 'font'],
  ['font-size-', 'text'],
  ['font-weight-', 'font-weight'],
  ['font-line-height-', 'leading'],
  ['font-letter-spacing-', 'tracking'],
  ['space-', 'spacing'],
  ['radius-', 'radius'],
  ['shadow-', 'shadow'],
  ['easing-', 'ease'],
];

/**
 * Build the Tailwind **v4** `@theme { … }` body. Colours drop a trailing
 * `-default` so `bg-accent` works; `bg` group is renamed to `surface`.
 */
export function buildThemeCss(tokens) {
  const lines = [];

  for (const token of tokens) {
    const bare = bareName(token);

    if (bare.startsWith('color-')) {
      const rest = bare.slice('color-'.length);
      const group = rest.split('-')[0];
      if (SKIP_COLOR_GROUPS.has(group)) continue;
      const name = rest
        .replace(/^bg(-|$)/, (_, tail) => `surface${tail}`)
        .replace(/-default$/, '');
      lines.push(`  --color-${name}: ${cssVar(bare)};`);
      continue;
    }

    for (const [prefix, ns] of V4_NAMESPACES) {
      if (bare.startsWith(prefix)) {
        lines.push(`  --${ns}-${bare.slice(prefix.length)}: ${cssVar(bare)};`);
        break;
      }
    }
  }

  return lines.sort().join('\n');
}

/** Deep-nested plain object of resolved values, for the JSON artifact. */
export function buildNestedJson(tokens) {
  const root = {};
  for (const token of tokens) {
    // SD v4 stores the transformed value on `$value` for DTCG sources.
    const value = token.$value ?? token.value;
    let node = root;
    token.path.forEach((seg, i) => {
      if (i === token.path.length - 1) node[seg] = value;
      else node = node[seg] ??= {};
    });
  }
  return root;
}
