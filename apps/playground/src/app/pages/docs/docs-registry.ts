/**
 * Data model that drives the documentation shell: the sidebar navigation, the
 * per-page header, API tables, usage snippets and accessibility notes all read
 * from one registry so a new page is a single entry.
 */

export type DocGroup = 'Foundations' | 'Components' | 'Feedback';
export type DocStatus = 'stable' | 'beta' | 'planned';

export interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly default: string;
  readonly description: string;
}

export interface DocLink {
  readonly label: string;
  readonly slug: string;
}

export interface DocProse {
  readonly heading: string;
  readonly text: string;
  readonly code?: string;
}

export interface DocEntry {
  readonly slug: string;
  readonly title: string;
  readonly group: DocGroup;
  readonly summary: string;
  readonly status?: DocStatus;
  readonly since?: string;
  /** Present for component pages — enables the live preview + API sections. */
  readonly selector?: string;
  readonly usage?: string;
  /** Exported class name, for the installation snippet. Defaults to the title. */
  readonly className?: string;
  readonly api?: readonly ApiRow[];
  readonly a11y?: readonly string[];
  readonly dos?: readonly string[];
  readonly donts?: readonly string[];
  readonly related?: readonly DocLink[];
  /** Present for foundation/prose pages. */
  readonly body?: readonly DocProse[];
  /** Slug of the matching Component Lab entry, if any. */
  readonly lab?: string;
}

export const DOCS: readonly DocEntry[] = [
  // ── Foundations ──────────────────────────────────────────────────────────
  {
    slug: 'tokens',
    title: 'Design tokens',
    group: 'Foundations',
    summary:
      'A three-tier DTCG token system compiled to themed CSS custom properties and a typed TypeScript map.',
    status: 'stable',
    body: [
      {
        heading: 'Three tiers',
        text: 'Primitives hold raw values (an OKLCH ramp, a spacing scale). Semantic tokens map intent onto primitives (surface, foreground, accent). Component tokens bind a component to semantics. You theme by swapping the semantic layer — primitives and components follow automatically.',
      },
      {
        heading: 'OKLCH colour',
        text: 'Every colour is authored in OKLCH, a perceptual model where equal lightness steps look equally light. That is what makes a single seed hue expand into an accessible, even ramp across light, dark and high-contrast themes.',
      },
      {
        heading: 'Consuming tokens',
        text: 'Import the stylesheet once, then reference the CSS variables — or the typed map for logic.',
        code: `/* styles.css */\n@import '@lumina/tokens/styles';\n\n.card {\n  background: var(--lui-surface-default);\n  color: var(--lui-color-fg-default);\n  border-radius: var(--lui-radius-xl);\n}`,
      },
    ],
    related: [
      { label: 'Theming', slug: 'theming' },
      { label: 'Accessibility', slug: 'accessibility' },
    ],
  },
  {
    slug: 'theming',
    title: 'Theming',
    group: 'Foundations',
    summary:
      'Light, dark and high-contrast themes plus runtime custom themes, applied with a single data-theme swap.',
    status: 'stable',
    body: [
      {
        heading: 'Install the engine',
        text: 'Provide the theme engine at bootstrap. It resolves the mode (including "system"), reflects it onto <html data-theme> and persists the choice.',
        code: `import { provideLuminaTheme } from '@lumina/theme';\n\nbootstrapApplication(App, {\n  providers: [provideLuminaTheme({ defaultMode: 'system' })],\n});`,
      },
      {
        heading: 'Switch at runtime',
        text: 'Inject ThemeService to read or change the mode. Because themes are just CSS variables under a data-theme attribute, switching is a single attribute write — no re-render, no flash.',
        code: `private readonly theme = inject(ThemeService);\n\ntoggle() {\n  this.theme.setMode(this.theme.isDark() ? 'light' : 'dark');\n}`,
      },
      {
        heading: 'No flash of the wrong theme',
        text: 'themeInitScript() returns a tiny inline script you run before Angular boots, so the correct theme is applied on the very first paint.',
      },
    ],
    related: [
      { label: 'Design tokens', slug: 'tokens' },
      { label: 'Accessibility', slug: 'accessibility' },
    ],
  },
  {
    slug: 'accessibility',
    title: 'Accessibility',
    group: 'Foundations',
    summary:
      'WCAG 2.2 AA is the baseline, not a milestone — keyboard, focus, ARIA and reduced motion ship in every component.',
    status: 'stable',
    body: [
      {
        heading: 'Keyboard first',
        text: 'Every interactive component is operable from the keyboard with a visible focus ring driven by the focus-ring token. Composite widgets (menu, tabs, dialog) implement the WAI-ARIA authoring-practice keyboard model.',
      },
      {
        heading: 'Colour and contrast',
        text: 'The OKLCH ramps are tuned so foreground/background pairs meet AA contrast in every theme, and a dedicated high-contrast theme raises it further.',
      },
      {
        heading: 'Respecting motion preferences',
        text: 'All animation is gated behind prefers-reduced-motion. Spinners slow to a calm rotation, skeletons drop their shimmer, and transitions collapse.',
      },
    ],
    related: [
      { label: 'Design tokens', slug: 'tokens' },
      { label: 'Theming', slug: 'theming' },
    ],
  },

  // ── Components ───────────────────────────────────────────────────────────
  {
    slug: 'button',
    title: 'Button',
    group: 'Components',
    summary:
      'Triggers an action or navigates. Native button/anchor semantics with full state coverage.',
    status: 'stable',
    selector: 'button[luiButton]',
    lab: 'button',
    usage: `<button luiButton variant="primary">Save changes</button>\n<a luiButton variant="secondary" href="/docs">Docs</a>`,
    api: [
      {
        name: 'variant',
        type: `'primary' | 'secondary' | 'ghost' | 'danger' | 'link'`,
        default: `'primary'`,
        description: 'Visual emphasis and intent.',
      },
      {
        name: 'size',
        type: `'sm' | 'md' | 'lg'`,
        default: `'md'`,
        description: 'Control height and padding.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Shows a spinner and marks the button busy.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables interaction.',
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        default: 'false',
        description: 'Stretches to the container width.',
      },
      {
        name: 'iconOnly',
        type: 'boolean',
        default: 'false',
        description:
          'Square padding for a single icon; requires an aria-label.',
      },
    ],
    a11y: [
      'Renders a real <button> or <a>, so keyboard activation and roles come for free.',
      'A loading button sets aria-busy and stays focusable while blocking clicks.',
      'Icon-only buttons must be given an accessible name via aria-label.',
    ],
    dos: [
      'Use one primary button per view to signal the main action.',
      'Write labels as verbs — “Save changes”, not “OK”.',
    ],
    donts: [
      'Do not use a link-style button for a primary destructive action.',
      'Avoid disabling a button without making it clear why.',
    ],
    related: [
      { label: 'Badge', slug: 'badge' },
      { label: 'Spinner', slug: 'spinner' },
    ],
  },
  {
    slug: 'input',
    title: 'Input',
    group: 'Components',
    summary:
      'An accessible text field with label, hint, validation message and a character counter.',
    status: 'stable',
    selector: 'lui-input',
    className: 'InputField',
    lab: 'input',
    usage: `<lui-input\n  label="Email address"\n  placeholder="ada@lumina.dev"\n  hint="We'll never share it."\n/>`,
    api: [
      {
        name: 'label',
        type: 'string',
        default: `''`,
        description: 'Field label, wired to the input for you.',
      },
      {
        name: 'hint',
        type: 'string',
        default: `''`,
        description: 'Helper text shown below the field.',
      },
      {
        name: 'error',
        type: 'string',
        default: `''`,
        description: 'Error message; also marks the field invalid.',
      },
      {
        name: 'type',
        type: 'string',
        default: `'text'`,
        description: 'Native input type.',
      },
      {
        name: 'size',
        type: `'sm' | 'md' | 'lg'`,
        default: `'md'`,
        description: 'Control height.',
      },
      {
        name: 'maxLength',
        type: 'number | null',
        default: 'null',
        description: 'Enables a live character counter.',
      },
      {
        name: 'value',
        type: 'model<string>',
        default: `''`,
        description: 'Two-way bound value; also a ControlValueAccessor.',
      },
    ],
    a11y: [
      'The label, hint and error are associated with the input via aria-describedby / aria-invalid.',
      'Implements ControlValueAccessor, so it works with Angular forms and their validation.',
    ],
    dos: [
      'Always pair an input with a visible label.',
      'Use the hint for format guidance and the error for what went wrong.',
    ],
    donts: [
      'Do not use placeholder text as the only label.',
      'Avoid showing validation errors before the field has been touched.',
    ],
    related: [
      { label: 'Switch', slug: 'switch' },
      { label: 'Button', slug: 'button' },
    ],
  },
  {
    slug: 'badge',
    title: 'Badge',
    group: 'Components',
    summary: 'A compact status or count indicator.',
    status: 'stable',
    selector: 'span[luiBadge]',
    lab: 'badge',
    usage: `<span luiBadge variant="success" appearance="subtle">Active</span>`,
    api: [
      {
        name: 'variant',
        type: `'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'`,
        default: `'neutral'`,
        description: 'Semantic colour.',
      },
      {
        name: 'appearance',
        type: `'solid' | 'subtle' | 'outline'`,
        default: `'subtle'`,
        description: 'Fill treatment.',
      },
      {
        name: 'size',
        type: `'sm' | 'md'`,
        default: `'md'`,
        description: 'Badge scale.',
      },
    ],
    a11y: [
      'A badge is decorative text; when it conveys a live status, describe that status in nearby content rather than colour alone.',
    ],
    dos: [
      'Keep badge text to a word or two.',
      'Match the variant to the meaning — success for healthy, danger for errors.',
    ],
    donts: [
      'Do not rely on colour alone to convey status.',
      'Avoid putting interactive controls inside a badge.',
    ],
    related: [
      { label: 'Avatar', slug: 'avatar' },
      { label: 'Button', slug: 'button' },
    ],
  },
  {
    slug: 'avatar',
    title: 'Avatar',
    group: 'Components',
    summary: 'Represents a user or entity, with a graceful initials fallback.',
    status: 'stable',
    selector: 'lui-avatar',
    lab: 'avatar',
    usage: `<lui-avatar name="Ada Lovelace" size="lg" status="online" />`,
    api: [
      {
        name: 'name',
        type: 'string',
        default: `''`,
        description: 'Full name; drives initials and the accessible label.',
      },
      {
        name: 'src',
        type: 'string | null',
        default: 'null',
        description: 'Image URL; falls back to initials on error.',
      },
      {
        name: 'size',
        type: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`,
        default: `'md'`,
        description: 'Avatar diameter.',
      },
      {
        name: 'shape',
        type: `'circle' | 'square'`,
        default: `'circle'`,
        description: 'Corner treatment.',
      },
      {
        name: 'status',
        type: `'online' | 'offline' | 'busy' | 'away' | null`,
        default: 'null',
        description: 'Presence dot.',
      },
    ],
    a11y: [
      'The image carries the name as alt text; the initials fallback exposes the same name to screen readers.',
      'The presence dot is decorative — pair it with text if the status matters.',
    ],
    dos: [
      'Provide the full name so initials and the accessible label are correct.',
      'Use the status dot only where presence is meaningful.',
    ],
    donts: [
      'Do not use an avatar as the only way to identify a user.',
      'Avoid distorting non-square images — they are cropped to fit.',
    ],
    related: [
      { label: 'Badge', slug: 'badge' },
      { label: 'Skeleton', slug: 'skeleton' },
    ],
  },
  {
    slug: 'switch',
    title: 'Switch',
    group: 'Components',
    summary: 'A binary on/off toggle for instantly-applied settings.',
    status: 'stable',
    selector: 'lui-switch',
    usage: `<lui-switch label="Email notifications" [(checked)]="notify" />`,
    api: [
      {
        name: 'label',
        type: 'string',
        default: `''`,
        description: 'Visible label.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: `''`,
        description: 'Accessible name when there is no visible label.',
      },
      {
        name: 'size',
        type: `'sm' | 'md'`,
        default: `'md'`,
        description: 'Switch scale.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables interaction.',
      },
      {
        name: 'checked',
        type: 'model<boolean>',
        default: 'false',
        description: 'Two-way bound state; also a ControlValueAccessor.',
      },
    ],
    a11y: [
      'Exposes role="switch" with aria-checked and is fully keyboard operable (Space / Enter).',
      'Provide a label or ariaLabel — never rely on surrounding layout alone.',
    ],
    dos: [
      'Use a switch for settings that apply immediately.',
      'Give every switch a label or ariaLabel.',
    ],
    donts: [
      'Do not use a switch where a form checkbox is expected.',
      'Avoid requiring a separate “Save” step after a switch is toggled.',
    ],
    related: [
      { label: 'Input', slug: 'input' },
      { label: 'Button', slug: 'button' },
    ],
  },
  {
    slug: 'card',
    title: 'Card',
    group: 'Components',
    summary:
      'A surface container with elevated, outlined and filled variants and composable regions.',
    status: 'stable',
    selector: 'lui-card',
    lab: 'card',
    usage: `<lui-card variant="elevated">\n  <h3 cardHeader>Title</h3>\n  <p>Body content.</p>\n  <div cardFooter><button luiButton size="sm">Action</button></div>\n</lui-card>`,
    api: [
      {
        name: 'variant',
        type: `'elevated' | 'outlined' | 'filled'`,
        default: `'elevated'`,
        description: 'Surface treatment.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        default: 'false',
        description: 'Makes the whole card a keyboard-activatable target.',
      },
      {
        name: 'cardClick',
        type: 'output<Event>',
        default: '—',
        description: 'Emitted when an interactive card is activated.',
      },
    ],
    a11y: [
      'An interactive card gets role="button", a tabindex and Enter/Space activation.',
      'Do not nest focusable controls inside an interactive card — use a static card with inner buttons instead.',
    ],
    dos: [
      'Use an interactive card when the whole surface navigates somewhere.',
      'Keep a consistent variant within a single grid.',
    ],
    donts: [
      'Do not place buttons or links inside an interactive card.',
      'Avoid mixing elevated and outlined cards in the same list.',
    ],
    related: [
      { label: 'Button', slug: 'button' },
      { label: 'Skeleton', slug: 'skeleton' },
    ],
  },

  // ── Feedback ─────────────────────────────────────────────────────────────
  {
    slug: 'spinner',
    title: 'Spinner',
    group: 'Feedback',
    summary:
      'An accessible, indeterminate loading indicator with a live-region label.',
    status: 'stable',
    selector: 'lui-spinner',
    lab: 'spinner',
    usage: `<lui-spinner />\n<lui-spinner size="sm" tone="current" label="Saving changes" />`,
    api: [
      {
        name: 'size',
        type: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`,
        default: `'md'`,
        description: 'Diameter of the spinner.',
      },
      {
        name: 'tone',
        type: `'accent' | 'neutral' | 'current'`,
        default: `'accent'`,
        description: 'Arc colour; "current" inherits the text colour.',
      },
      {
        name: 'label',
        type: 'string',
        default: `'Loading'`,
        description: 'Announced by assistive technology.',
      },
    ],
    a11y: [
      'The host is a live region (role="status", aria-live="polite") so the label is announced.',
      'The rotating artwork is aria-hidden; the label carries the meaning.',
      'Rotation slows under prefers-reduced-motion rather than stopping abruptly.',
    ],
    dos: [
      'Give the spinner a label describing what is loading.',
      'Use tone="current" inside buttons so it matches the text.',
    ],
    donts: [
      'Do not show a spinner for loads under ~300ms — it reads as a flash.',
      'Avoid a spinner where a skeleton better represents the incoming content.',
    ],
    related: [
      { label: 'Skeleton', slug: 'skeleton' },
      { label: 'Button', slug: 'button' },
    ],
  },
  {
    slug: 'skeleton',
    title: 'Skeleton',
    group: 'Feedback',
    summary:
      'A token-driven placeholder that mirrors content shape while it loads.',
    status: 'stable',
    selector: 'lui-skeleton',
    lab: 'skeleton',
    usage: `<lui-skeleton [lines]="3" />\n<lui-skeleton variant="circular" width="2.5rem" height="2.5rem" />`,
    api: [
      {
        name: 'variant',
        type: `'text' | 'circular' | 'rectangular'`,
        default: `'text'`,
        description: 'Placeholder shape.',
      },
      {
        name: 'lines',
        type: 'number',
        default: '1',
        description: 'Number of lines for the text variant.',
      },
      {
        name: 'animation',
        type: `'shimmer' | 'pulse' | 'none'`,
        default: `'shimmer'`,
        description: 'Loading animation.',
      },
      {
        name: 'width / height',
        type: 'string',
        default: '—',
        description: 'CSS sizes for the block shapes.',
      },
    ],
    a11y: [
      'Skeletons are decorative (aria-hidden); pair them with a status message so assistive technology is told content is loading.',
      'The shimmer/pulse animation is removed under prefers-reduced-motion.',
    ],
    dos: [
      'Match the skeleton shape to the content it replaces.',
      'Pair skeletons with a screen-reader status message.',
    ],
    donts: [
      'Do not use skeletons for very fast loads — they add perceived latency.',
      'Avoid a single generic bar where the real layout has distinct regions.',
    ],
    related: [
      { label: 'Spinner', slug: 'spinner' },
      { label: 'Card', slug: 'card' },
    ],
  },
];

export const DOC_GROUPS: readonly DocGroup[] = [
  'Foundations',
  'Components',
  'Feedback',
];

export function findDoc(slug: string): DocEntry | undefined {
  return DOCS.find((d) => d.slug === slug);
}
