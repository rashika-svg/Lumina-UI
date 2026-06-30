/**
 * Lumina UI — design tokens public API.
 *
 * The token *values* live in DTCG JSON under `libs/tokens/tokens/**` and are
 * compiled by Style Dictionary into:
 *   • CSS custom properties (one layer per theme) — see `./styles`
 *   • A typed token map — `../generated/ts/tokens`
 *
 * Consumers should reference tokens through the typed `token()` helper or the
 * generated CSS variables, never by hard-coding raw values.
 */
export {
  tokens,
  token,
  BUILT_IN_THEMES,
  type TokenName,
  type BuiltInTheme,
} from '../generated/ts/tokens';

import { tokens, type TokenName } from '../generated/ts/tokens';

/** The CSS custom-property prefix used across all Lumina tokens. */
export const TOKEN_PREFIX = 'lui' as const;

/**
 * Resolve a token name to its bare CSS custom-property name
 * (e.g. `'color.bg.canvas'` → `'--lui-color-bg-canvas'`).
 *
 * Useful when you need the property name itself — for `setProperty`,
 * `getComputedStyle`, or composing `var()` with a fallback.
 */
export function cssVarName(name: TokenName): string {
  // Derive from the generated `var(--…)` string so it always stays in sync.
  return tokens[name].slice('var('.length, -1);
}

/**
 * Read the *computed* value of a token from a given element (defaults to
 * `:root`). Returns an empty string when called outside the browser.
 */
export function resolveToken(
  name: TokenName,
  element: Element | undefined = typeof document !== 'undefined'
    ? document.documentElement
    : undefined,
): string {
  if (!element || typeof getComputedStyle === 'undefined') return '';
  return getComputedStyle(element).getPropertyValue(cssVarName(name)).trim();
}
