import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import {
  Accordion,
  AccordionItem,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CommandPalette,
  Dialog,
  Drawer,
  InputField,
  Kanban,
  Menu,
  MenuItem,
  MenuTrigger,
  Pagination,
  Skeleton,
  Spinner,
  Switch,
  Tab,
  Table,
  Tabs,
  ToastOutlet,
  ToastService,
  Tree,
  type BreadcrumbItem,
  type Command,
  type KanbanColumn,
  type TableColumn,
  type TreeNode,
} from '@lumina/ui';
import { LAB, type ControlValue, type LabGroup } from './lab-registry';

type Viewport = 'full' | 'tablet' | 'mobile';

interface LabRow {
  readonly name: string;
  readonly role: string;
  readonly status: string;
}

/**
 * Component Lab — a Storybook/shadcn-style laboratory: pick a component, tweak
 * its props live, preview it at any viewport, and copy the generated code.
 */
@Component({
  selector: 'lpg-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    Button,
    InputField,
    Badge,
    Avatar,
    Card,
    Switch,
    Spinner,
    Skeleton,
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
  templateUrl: './lab.html',
  styleUrl: './lab.css',
})
export class LabPage {
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  protected readonly slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('slug') ?? 'button')),
    { initialValue: 'button' },
  );
  protected readonly def = computed(
    () => LAB.find((d) => d.slug === this.slug()) ?? LAB[0]!,
  );

  /** Sidebar groups, in registry order. */
  protected readonly groups: readonly { label: LabGroup; items: typeof LAB }[] =
    (['Flagship', 'Feedback', 'Composites'] as const).map((label) => ({
      label,
      items: LAB.filter((d) => d.group === label),
    }));

  protected readonly values = signal<Record<string, ControlValue>>({});
  protected readonly code = computed(() => this.def().code(this.values()));

  /** Shared open-state for the overlay demos (dialog / drawer / palette). */
  protected readonly overlayOpen = signal(false);

  protected readonly viewport = signal<Viewport>('full');
  protected readonly viewports = [
    { id: 'full', label: 'Desktop', width: '100%' },
    { id: 'tablet', label: 'Tablet', width: '48rem' },
    { id: 'mobile', label: 'Mobile', width: '23.5rem' },
  ] as const;
  protected readonly copied = signal(false);

  // ── Sample data for the composite previews ─────────────────────────────────
  protected readonly tableColumns: readonly TableColumn<LabRow>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
    { key: 'status', header: 'Status' },
  ];
  protected readonly tableRows: readonly LabRow[] = [
    { name: 'Ada Lovelace', role: 'Engineer', status: 'Active' },
    { name: 'Grace Hopper', role: 'Admiral', status: 'Active' },
    { name: 'Alan Turing', role: 'Researcher', status: 'Away' },
  ];
  protected readonly breadcrumbItems: readonly BreadcrumbItem[] = [
    { label: 'Docs', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Breadcrumb' },
  ];
  protected readonly treeNodes: readonly TreeNode[] = [
    {
      id: 'src',
      label: 'src',
      children: [
        {
          id: 'app',
          label: 'app',
          children: [{ id: 'main', label: 'main.ts' }],
        },
        { id: 'styles', label: 'styles.css' },
      ],
    },
    { id: 'readme', label: 'README.md' },
  ];
  protected readonly paletteCommands: readonly Command[] = [
    { id: 'new', label: 'New file', hint: 'Ctrl N' },
    { id: 'open', label: 'Open…', hint: 'Ctrl O' },
    { id: 'save', label: 'Save', hint: 'Ctrl S' },
    { id: 'theme', label: 'Toggle theme', group: 'Preferences' },
  ];
  protected readonly kanbanColumns: KanbanColumn[] = [
    {
      id: 'todo',
      title: 'To do',
      cards: [{ id: 'c1', title: 'Design tokens' }],
    },
    {
      id: 'doing',
      title: 'In progress',
      cards: [{ id: 'c2', title: 'Docs shell' }],
    },
    { id: 'done', title: 'Done', cards: [{ id: 'c3', title: 'Dark theme' }] },
  ];

  constructor() {
    // Reset controls (and any open overlay) whenever the component changes.
    effect(() => {
      const def = this.def();
      const next: Record<string, ControlValue> = {};
      for (const control of def.controls) next[control.name] = control.default;
      untracked(() => {
        this.values.set(next);
        this.overlayOpen.set(false);
      });
    });
  }

  protected val(name: string): string {
    const value = this.values()[name];
    return value === undefined ? '' : String(value);
  }

  protected bool(name: string): boolean {
    return this.values()[name] === true;
  }

  protected num(name: string): number {
    return Number(this.values()[name] ?? 0);
  }

  protected setValue(name: string, value: ControlValue): void {
    this.values.update((v) => ({ ...v, [name]: value }));
  }

  protected frameWidth(): string {
    return (
      this.viewports.find((v) => v.id === this.viewport())?.width ?? '100%'
    );
  }

  protected showToast(): void {
    const msg = 'Changes saved';
    const title = 'Your changes are live.';
    switch (String(this.values()['variant'] ?? 'success')) {
      case 'danger':
        this.toast.error(msg, title);
        break;
      case 'warning':
        this.toast.warning(msg, title);
        break;
      case 'info':
        this.toast.info(msg, title);
        break;
      default:
        this.toast.success(msg, title);
    }
  }

  protected copy(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    }
  }
}
