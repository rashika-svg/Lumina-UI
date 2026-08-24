import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Menu, MenuItem, MenuTrigger } from '@lumina/ui';
import { ThemeService, type ThemeMode } from '@lumina/theme';

interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly exact?: boolean;
}

interface ThemeMode3 {
  readonly value: ThemeMode;
  readonly icon: string;
  readonly label: string;
}

type Accent = 'violet' | 'indigo' | 'cyan' | 'emerald';

interface AccentDef {
  readonly value: Accent;
  readonly label: string;
  readonly swatch: string;
}

const ACCENT_KEY = 'lumina-accent';

/**
 * Lumina platform shell — the persistent top bar (brand, primary nav, theme
 * switcher, GitHub) and the routed content region + footer.
 */
@Component({
  selector: 'lpg-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Menu,
    MenuTrigger,
    MenuItem,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly theme = inject(ThemeService);
  private readonly doc = inject(DOCUMENT);
  protected readonly navOpen = signal(false);

  protected readonly nav: readonly NavItem[] = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Docs', path: '/docs' },
    { label: 'Components', path: '/components' },
  ];

  protected readonly themeModes: readonly ThemeMode3[] = [
    { value: 'light', icon: '☀', label: 'Light theme' },
    { value: 'dark', icon: '☾', label: 'Dark theme' },
    { value: 'system', icon: '◐', label: 'System theme' },
  ];

  protected readonly accents: readonly AccentDef[] = [
    { value: 'violet', label: 'Violet', swatch: 'oklch(0.62 0.24 300)' },
    { value: 'indigo', label: 'Indigo', swatch: 'oklch(0.62 0.21 264)' },
    { value: 'cyan', label: 'Cyan', swatch: 'oklch(0.72 0.14 210)' },
    { value: 'emerald', label: 'Emerald', swatch: 'oklch(0.72 0.16 158)' },
  ];
  protected readonly accent = signal<Accent>('violet');

  /** The swatch colour of the currently active accent — shown on the trigger. */
  protected readonly currentAccent = computed(
    () =>
      this.accents.find((a) => a.value === this.accent()) ?? this.accents[0],
  );

  constructor() {
    const saved = this.readAccent();
    if (saved) this.accent.set(saved);
    // Reflect the accent onto <html data-accent> so the token overrides apply.
    effect(() =>
      this.doc.documentElement.setAttribute('data-accent', this.accent()),
    );
  }

  protected setTheme(mode: ThemeMode): void {
    this.theme.setMode(mode);
  }

  protected setAccent(accent: Accent): void {
    this.accent.set(accent);
    try {
      this.doc.defaultView?.localStorage.setItem(ACCENT_KEY, accent);
    } catch {
      /* storage may be unavailable */
    }
  }

  private readAccent(): Accent | null {
    try {
      const v = this.doc.defaultView?.localStorage.getItem(ACCENT_KEY);
      return v && this.accents.some((a) => a.value === v)
        ? (v as Accent)
        : null;
    } catch {
      return null;
    }
  }

  protected toggleNav(): void {
    this.navOpen.update((v) => !v);
  }

  protected closeNav(): void {
    this.navOpen.set(false);
  }
}
