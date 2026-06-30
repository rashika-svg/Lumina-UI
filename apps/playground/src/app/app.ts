import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Accordion,
  AccordionItem,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Dialog,
  Drawer,
  InputField,
  Menu,
  MenuItem,
  MenuTrigger,
  Pagination,
  Switch,
  Tab,
  Tabs,
  ToastOutlet,
  ToastService,
} from '@lumina/ui';
import { ThemeService, type ThemeMode } from '@lumina/theme';

interface ThemeOption {
  readonly value: ThemeMode;
  readonly label: string;
}

@Component({
  selector: 'lpg-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    Button,
    Badge,
    Avatar,
    InputField,
    Switch,
    Tabs,
    Tab,
    Accordion,
    AccordionItem,
    Dialog,
    Drawer,
    Menu,
    MenuTrigger,
    MenuItem,
    Breadcrumb,
    Pagination,
    ToastOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly theme = inject(ThemeService);
  private readonly toast = inject(ToastService);

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
  protected readonly dialogOpen = signal(false);
  protected readonly drawerOpen = signal(false);
  protected readonly page = signal(3);

  protected readonly crumbs = [
    { label: 'Home', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Playground' },
  ];

  protected setTheme(mode: ThemeMode): void {
    this.theme.setMode(mode);
  }

  protected simulateLoad(): void {
    this.loadingDemo.set(true);
    setTimeout(() => this.loadingDemo.set(false), 1600);
  }

  protected notify(variant: 'info' | 'success' | 'warning' | 'danger'): void {
    switch (variant) {
      case 'success':
        this.toast.success('Your changes are live.', 'Saved');
        break;
      case 'warning':
        this.toast.warning('Storage is almost full.', 'Careful');
        break;
      case 'danger':
        this.toast.error('Could not save changes.', 'Error');
        break;
      default:
        this.toast.info('A new build is available.', 'Heads up');
    }
  }
}
