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
  type Command,
  CommandPalette,
  Dialog,
  Drawer,
  InputField,
  Kanban,
  type KanbanColumn,
  Menu,
  MenuItem,
  MenuTrigger,
  Pagination,
  Switch,
  Tab,
  Table,
  type TableColumn,
  Tabs,
  ToastOutlet,
  ToastService,
  Tree,
  type TreeNode,
} from '@lumina/ui';
import { ThemeService, type ThemeMode } from '@lumina/theme';

interface ThemeOption {
  readonly value: ThemeMode;
  readonly label: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  age: number;
  status: string;
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
    Table,
    CommandPalette,
    Tree,
    Kanban,
    ToastOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: {
    '(document:keydown)': 'onGlobalKeydown($event)',
  },
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

  // Data Table
  protected readonly tableColumns: TableColumn<TeamMember>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
    { key: 'age', header: 'Age', sortable: true, align: 'end', width: '6rem' },
    { key: 'status', header: 'Status', align: 'center' },
  ];
  protected readonly team: TeamMember[] = [
    {
      id: 1,
      name: 'Ada Lovelace',
      role: 'Engineer',
      age: 36,
      status: 'Active',
    },
    { id: 2, name: 'Grace Hopper', role: 'Admiral', age: 85, status: 'Active' },
    { id: 3, name: 'Alan Turing', role: 'Researcher', age: 41, status: 'Away' },
    {
      id: 4,
      name: 'Margaret Hamilton',
      role: 'Director',
      age: 88,
      status: 'Active',
    },
  ];
  protected readonly selectedRows = signal<TeamMember[]>([]);
  protected readonly byId = (m: TeamMember) => m.id;

  // Tree
  protected readonly treeNodes: TreeNode[] = [
    {
      id: 'src',
      label: 'src',
      children: [
        {
          id: 'app',
          label: 'app',
          children: [{ id: 'app.ts', label: 'app.ts' }],
        },
        { id: 'styles', label: 'styles.css' },
      ],
    },
    {
      id: 'libs',
      label: 'libs',
      children: [
        { id: 'ui', label: 'ui' },
        { id: 'tokens', label: 'tokens' },
      ],
    },
    { id: 'readme', label: 'README.md' },
  ];

  // Kanban
  protected readonly board = signal<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'To do',
      cards: [
        {
          id: 'k1',
          title: 'Tree View',
          description: 'ARIA tree + keyboard nav',
        },
        { id: 'k2', title: 'Kanban Board' },
      ],
    },
    {
      id: 'doing',
      title: 'In progress',
      cards: [{ id: 'k3', title: 'AI playground' }],
    },
    { id: 'done', title: 'Done', cards: [{ id: 'k4', title: 'Data Table' }] },
  ]);

  // Command palette (⌘K / Ctrl+K)
  protected readonly cmdkOpen = signal(false);
  protected readonly lastCommand = signal('');
  protected readonly commands: Command[] = [
    { id: 'theme-light', label: 'Switch to light theme', group: 'Appearance' },
    { id: 'theme-dark', label: 'Switch to dark theme', group: 'Appearance' },
    {
      id: 'theme-hc',
      label: 'Switch to high contrast',
      group: 'Appearance',
      keywords: ['a11y'],
    },
    { id: 'open-drawer', label: 'Open settings drawer', group: 'Navigation' },
    {
      id: 'toast',
      label: 'Send a test notification',
      group: 'Actions',
      keywords: ['toast'],
    },
  ];

  protected setTheme(mode: ThemeMode): void {
    this.theme.setMode(mode);
  }

  protected simulateLoad(): void {
    this.loadingDemo.set(true);
    setTimeout(() => this.loadingDemo.set(false), 1600);
  }

  protected onGlobalKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.cmdkOpen.set(true);
    }
  }

  protected runCommand(command: Command): void {
    this.lastCommand.set(command.label);
    switch (command.id) {
      case 'theme-light':
        this.theme.setMode('light');
        break;
      case 'theme-dark':
        this.theme.setMode('dark');
        break;
      case 'theme-hc':
        this.theme.setMode('hc');
        break;
      case 'open-drawer':
        this.drawerOpen.set(true);
        break;
      case 'toast':
        this.notify('success');
        break;
    }
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
