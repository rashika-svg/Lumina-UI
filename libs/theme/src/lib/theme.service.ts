import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import type { BuiltInTheme } from '@lumina/tokens';
import {
  CustomTheme,
  DEFAULT_THEME_CONFIG,
  LUMINA_THEME_CONFIG,
  ThemeMode,
  ThemeName,
} from './theme-config';

const CUSTOM_STYLE_ID = 'lumina-custom-themes';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Runtime theme engine for Lumina UI.
 *
 * Responsibilities:
 *  - Track the user's `mode` (`'light' | 'dark' | 'hc' | 'system' | <custom>`)
 *    and resolve it against the OS `prefers-color-scheme`.
 *  - Reflect the resolved theme onto `<html data-theme="…">` so the
 *    `@lumina/tokens` CSS layers take effect with zero re-paint cost.
 *  - Register **custom themes** at runtime — token overrides layered on a base
 *    theme via a generated `[data-theme-variant]` stylesheet.
 *  - Expose reactive `prefers-reduced-motion` for motion-aware components.
 *  - Persist the user's choice and support export/import of custom themes.
 *
 * Everything is exposed through Angular signals, and every DOM access is
 * guarded for server-side rendering.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly userConfig = inject(LUMINA_THEME_CONFIG);
  private readonly config = { ...DEFAULT_THEME_CONFIG, ...this.userConfig };

  private readonly _mode = signal<ThemeMode>(this.config.defaultMode);
  private readonly _systemPrefersDark = signal(false);
  private readonly _prefersReducedMotion = signal(false);
  private readonly _customThemes = signal<Map<string, CustomTheme>>(new Map());

  /** The user's selected mode (may be `'system'`). */
  readonly mode = this._mode.asReadonly();
  /** Whether the OS currently prefers a dark color scheme. */
  readonly systemPrefersDark = this._systemPrefersDark.asReadonly();
  /** Whether the user has requested reduced motion at the OS level. */
  readonly prefersReducedMotion = this._prefersReducedMotion.asReadonly();
  /** All registered custom themes. */
  readonly customThemes = computed(() => [...this._customThemes().values()]);

  /** The concrete theme applied to the DOM (`'system'` resolved to light/dark). */
  readonly resolvedTheme = computed<ThemeName>(() => {
    const mode = this._mode();
    if (mode === 'system') return this._systemPrefersDark() ? 'dark' : 'light';
    return mode;
  });

  /** Whether the effective (post-resolution) theme is a dark theme. */
  readonly isDark = computed(
    () => this.effectiveBase(this.resolvedTheme()) === 'dark',
  );

  constructor() {
    for (const theme of this.userConfig.customThemes ?? []) {
      this._customThemes.update((map) => new Map(map).set(theme.id, theme));
    }

    if (this.isBrowser) {
      this.restorePersisted();
      this.bindMediaQueries();
    }

    // Reflect the resolved theme + any custom variant onto <html>.
    effect(() => this.applyTheme(this.resolvedTheme(), this._customThemes()));
    // Keep the generated custom-theme stylesheet in sync.
    effect(() => this.syncCustomStylesheet(this._customThemes()));
    // Expose reduced-motion preference to CSS via an attribute.
    effect(() => this.reflectReducedMotion(this._prefersReducedMotion()));
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /** Set the active mode. Persists the choice when persistence is enabled. */
  setMode(mode: ThemeMode): void {
    this._mode.set(mode);
    this.persistMode(mode);
  }

  /** Toggle between light and dark, resolving `'system'` first. */
  toggle(): void {
    this.setMode(this.isDark() ? 'light' : 'dark');
  }

  /** Register (or replace) a custom theme and persist it. */
  registerTheme(theme: CustomTheme): void {
    this._customThemes.update((map) => new Map(map).set(theme.id, theme));
    this.persistCustomThemes();
  }

  /** Remove a custom theme; falls back to its base if it was active. */
  removeTheme(id: string): void {
    this._customThemes.update((map) => {
      const next = new Map(map);
      next.delete(id);
      return next;
    });
    if (this._mode() === id) this.setMode('system');
    this.persistCustomThemes();
  }

  /** Serialize all custom themes to a JSON string for sharing/backup. */
  exportThemes(): string {
    return JSON.stringify({ version: 1, themes: this.customThemes() }, null, 2);
  }

  /** Import custom themes from a JSON string produced by {@link exportThemes}. */
  importThemes(json: string): void {
    const parsed = JSON.parse(json) as { themes?: CustomTheme[] };
    for (const theme of parsed.themes ?? []) {
      if (theme?.id && theme.base && theme.overrides) this.registerTheme(theme);
    }
  }

  // ── Internals ───────────────────────────────────────────────────────────────

  private effectiveBase(theme: ThemeName): BuiltInTheme {
    return this._customThemes().get(theme)?.base ?? (theme as BuiltInTheme);
  }

  private applyTheme(
    resolved: ThemeName,
    customs: Map<string, CustomTheme>,
  ): void {
    const root = this.document.documentElement;
    if (!root) return;
    const custom = customs.get(resolved);
    root.setAttribute('data-theme', custom ? custom.base : resolved);
    if (custom) root.setAttribute('data-theme-variant', custom.id);
    else root.removeAttribute('data-theme-variant');
  }

  private reflectReducedMotion(reduced: boolean): void {
    const root = this.document.documentElement;
    if (!root) return;
    if (reduced) root.setAttribute('data-reduced-motion', 'true');
    else root.removeAttribute('data-reduced-motion');
  }

  private syncCustomStylesheet(customs: Map<string, CustomTheme>): void {
    if (!this.isBrowser) return;
    const head = this.document.head;
    if (!head) return;

    let style = this.document.getElementById(
      CUSTOM_STYLE_ID,
    ) as HTMLStyleElement | null;
    if (customs.size === 0) {
      style?.remove();
      return;
    }
    if (!style) {
      style = this.document.createElement('style');
      style.id = CUSTOM_STYLE_ID;
      head.appendChild(style);
    }
    style.textContent = [...customs.values()]
      .map((t) => this.themeToCss(t))
      .join('\n');
  }

  private themeToCss(theme: CustomTheme): string {
    const decls = Object.entries(theme.overrides)
      .map(([key, value]) => `  ${this.normalizeVar(key)}: ${value};`)
      .join('\n');
    return `[data-theme-variant="${theme.id}"] {\n${decls}\n}`;
  }

  /** Accept either a bare `--lui-…` property or a `color.bg.canvas` token path. */
  private normalizeVar(key: string): string {
    if (key.startsWith('--')) return key;
    return `--lui-${key.replace(/\./g, '-')}`;
  }

  private bindMediaQueries(): void {
    const win = this.document.defaultView;
    if (!win?.matchMedia) return;

    const dark = win.matchMedia(DARK_QUERY);
    const motion = win.matchMedia(REDUCED_MOTION_QUERY);
    this._systemPrefersDark.set(dark.matches);
    this._prefersReducedMotion.set(motion.matches);

    const onDark = (e: MediaQueryListEvent) =>
      this._systemPrefersDark.set(e.matches);
    const onMotion = (e: MediaQueryListEvent) =>
      this._prefersReducedMotion.set(e.matches);
    dark.addEventListener('change', onDark);
    motion.addEventListener('change', onMotion);
    this.destroyRef.onDestroy(() => {
      dark.removeEventListener('change', onDark);
      motion.removeEventListener('change', onMotion);
    });
  }

  private storage(): Storage | null {
    if (!this.isBrowser || !this.config.persist) return null;
    try {
      return this.document.defaultView?.localStorage ?? null;
    } catch {
      return null; // e.g. blocked by privacy settings
    }
  }

  private restorePersisted(): void {
    const store = this.storage();
    if (!store) return;
    const themes = store.getItem(`${this.config.storageKey}:themes`);
    if (themes) {
      try {
        this.importThemes(themes);
      } catch {
        /* ignore corrupt data */
      }
    }
    const mode = store.getItem(this.config.storageKey);
    if (mode) this._mode.set(mode as ThemeMode);
  }

  private persistMode(mode: ThemeMode): void {
    this.storage()?.setItem(this.config.storageKey, mode);
  }

  private persistCustomThemes(): void {
    this.storage()?.setItem(
      `${this.config.storageKey}:themes`,
      this.exportThemes(),
    );
  }
}
