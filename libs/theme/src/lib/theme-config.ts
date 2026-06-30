import { InjectionToken } from '@angular/core';
import type { BuiltInTheme } from '@lumina/tokens';

/**
 * A theme identifier — either one of the built-in themes shipped by
 * `@lumina/tokens`, or the id of a {@link CustomTheme} registered at runtime.
 */
export type ThemeName = BuiltInTheme | (string & {});

/**
 * The user-facing theme preference. `'system'` defers to the operating
 * system's `prefers-color-scheme`, resolving to `light` or `dark`.
 */
export type ThemeMode = ThemeName | 'system';

/**
 * A custom theme: a set of token overrides layered on top of a built-in base
 * theme. Only the tokens you override need to be supplied — everything else is
 * inherited from `base`.
 */
export interface CustomTheme {
  /** Unique id used as the `data-theme-variant` value. */
  readonly id: string;
  /** Human-readable label for UIs (theme pickers, docs). */
  readonly label?: string;
  /** Built-in theme this custom theme inherits from. */
  readonly base: BuiltInTheme;
  /**
   * CSS custom-property overrides, keyed by bare property name
   * (`'--lui-color-accent-default'`) or token path (`'color.accent.default'`).
   */
  readonly overrides: Record<string, string>;
}

/** Configuration for {@link provideLuminaTheme}. */
export interface LuminaThemeConfig {
  /** Initial mode when no preference is persisted. Default: `'system'`. */
  readonly defaultMode?: ThemeMode;
  /** `localStorage` key used to persist the user's choice. Default: `'lumina-theme'`. */
  readonly storageKey?: string;
  /** Persist the user's choice to `localStorage`. Default: `true`. */
  readonly persist?: boolean;
  /** Custom themes to register at startup. */
  readonly customThemes?: readonly CustomTheme[];
}

export const LUMINA_THEME_CONFIG = new InjectionToken<LuminaThemeConfig>(
  'LUMINA_THEME_CONFIG',
  { factory: () => ({}) },
);

/** Default configuration values, merged with anything supplied by the app. */
export const DEFAULT_THEME_CONFIG: Required<
  Omit<LuminaThemeConfig, 'customThemes'>
> = {
  defaultMode: 'system',
  storageKey: 'lumina-theme',
  persist: true,
};
