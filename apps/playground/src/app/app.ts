import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Avatar, Badge, Button, InputField, Switch } from '@lumina/ui';
import { ThemeService, type ThemeMode } from '@lumina/theme';

interface ThemeOption {
  readonly value: ThemeMode;
  readonly label: string;
}

@Component({
  selector: 'lpg-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Button, Badge, Avatar, InputField, Switch],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly theme = inject(ThemeService);

  protected readonly themeOptions: readonly ThemeOption[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'hc', label: 'High contrast' },
    { value: 'system', label: 'System' },
  ];

  protected readonly buttonVariants = [
    'primary',
    'secondary',
    'ghost',
    'danger',
    'link',
  ] as const;
  protected readonly badgeVariants = [
    'neutral',
    'accent',
    'success',
    'warning',
    'danger',
    'info',
  ] as const;

  protected readonly email = signal('');
  protected readonly notifications = signal(true);
  protected readonly loadingDemo = signal(false);

  protected setTheme(mode: ThemeMode): void {
    this.theme.setMode(mode);
  }

  protected simulateLoad(): void {
    this.loadingDemo.set(true);
    setTimeout(() => this.loadingDemo.set(false), 1600);
  }
}
