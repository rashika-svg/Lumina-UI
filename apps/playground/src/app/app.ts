import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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

/**
 * Lumina platform shell — the persistent top bar (brand, primary nav, theme
 * switcher, GitHub) and the routed content region + footer.
 */
@Component({
  selector: 'lpg-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly theme = inject(ThemeService);
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

  protected setTheme(mode: ThemeMode): void {
    this.theme.setMode(mode);
  }

  protected toggleNav(): void {
    this.navOpen.update((v) => !v);
  }

  protected closeNav(): void {
    this.navOpen.set(false);
  }
}
