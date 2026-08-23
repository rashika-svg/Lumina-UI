/**
 * Data model that drives the Component Lab: each entry declares its interactive
 * controls and a code generator, so the preview, controls panel and code output
 * all stay in sync from one source.
 */

export type ControlValue = string | boolean;
export type LabGroup = 'Flagship' | 'Feedback' | 'Composites';

export interface LabControl {
  readonly name: string;
  readonly label: string;
  readonly type: 'select' | 'boolean' | 'text';
  readonly options?: readonly string[];
  readonly default: ControlValue;
}

export interface LabDef {
  readonly slug: string;
  readonly name: string;
  readonly group: LabGroup;
  readonly tagline: string;
  readonly controls: readonly LabControl[];
  readonly code: (v: Record<string, ControlValue>) => string;
}

const attr = (v: Record<string, ControlValue>, name: string) =>
  String(v[name] ?? '');
const on = (v: Record<string, ControlValue>, name: string) => v[name] === true;

export const LAB: readonly LabDef[] = [
  {
    slug: 'button',
    group: 'Flagship',
    name: 'Button',
    tagline:
      'Trigger an action or navigate. Native semantics, full state coverage.',
    controls: [
      {
        name: 'variant',
        label: 'Variant',
        type: 'select',
        options: ['primary', 'secondary', 'ghost', 'danger', 'link'],
        default: 'primary',
      },
      {
        name: 'size',
        label: 'Size',
        type: 'select',
        options: ['sm', 'md', 'lg'],
        default: 'md',
      },
      { name: 'label', label: 'Label', type: 'text', default: 'Save changes' },
      { name: 'disabled', label: 'Disabled', type: 'boolean', default: false },
      { name: 'loading', label: 'Loading', type: 'boolean', default: false },
    ],
    code: (v) =>
      `<button luiButton variant="${attr(v, 'variant')}" size="${attr(v, 'size')}"` +
      `${on(v, 'disabled') ? ' disabled' : ''}${on(v, 'loading') ? ' [loading]="true"' : ''}>` +
      `${attr(v, 'label')}</button>`,
  },
  {
    slug: 'input',
    group: 'Flagship',
    name: 'Input',
    tagline:
      'Accessible text field with a floating label, validation and counter.',
    controls: [
      { name: 'label', label: 'Label', type: 'text', default: 'Email address' },
      {
        name: 'placeholder',
        label: 'Placeholder',
        type: 'text',
        default: 'ada@lumina.dev',
      },
      {
        name: 'hint',
        label: 'Hint',
        type: 'text',
        default: "We'll never share it.",
      },
      { name: 'error', label: 'Error', type: 'text', default: '' },
      {
        name: 'size',
        label: 'Size',
        type: 'select',
        options: ['sm', 'md', 'lg'],
        default: 'md',
      },
      { name: 'disabled', label: 'Disabled', type: 'boolean', default: false },
    ],
    code: (v) =>
      `<lui-input\n  label="${attr(v, 'label')}"\n  placeholder="${attr(v, 'placeholder')}"` +
      `${attr(v, 'hint') ? `\n  hint="${attr(v, 'hint')}"` : ''}` +
      `${attr(v, 'error') ? `\n  error="${attr(v, 'error')}"` : ''}` +
      `\n  size="${attr(v, 'size')}"${on(v, 'disabled') ? '\n  disabled' : ''}\n/>`,
  },
  {
    slug: 'badge',
    group: 'Flagship',
    name: 'Badge',
    tagline: 'Compact status and count indicators.',
    controls: [
      {
        name: 'variant',
        label: 'Variant',
        type: 'select',
        options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'],
        default: 'success',
      },
      {
        name: 'appearance',
        label: 'Appearance',
        type: 'select',
        options: ['subtle', 'solid', 'outline'],
        default: 'subtle',
      },
      {
        name: 'size',
        label: 'Size',
        type: 'select',
        options: ['sm', 'md'],
        default: 'md',
      },
      { name: 'text', label: 'Text', type: 'text', default: 'Active' },
    ],
    code: (v) =>
      `<span luiBadge variant="${attr(v, 'variant')}" appearance="${attr(v, 'appearance')}" ` +
      `size="${attr(v, 'size')}">${attr(v, 'text')}</span>`,
  },
  {
    slug: 'avatar',
    group: 'Flagship',
    name: 'Avatar',
    tagline: 'Represent a user or entity, with an initials fallback.',
    controls: [
      { name: 'name', label: 'Name', type: 'text', default: 'Ada Lovelace' },
      {
        name: 'size',
        label: 'Size',
        type: 'select',
        options: ['xs', 'sm', 'md', 'lg', 'xl'],
        default: 'lg',
      },
      {
        name: 'shape',
        label: 'Shape',
        type: 'select',
        options: ['circle', 'square'],
        default: 'circle',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: ['none', 'online', 'busy', 'away', 'offline'],
        default: 'online',
      },
    ],
    code: (v) =>
      `<lui-avatar name="${attr(v, 'name')}" size="${attr(v, 'size')}" shape="${attr(v, 'shape')}"` +
      `${attr(v, 'status') !== 'none' ? ` status="${attr(v, 'status')}"` : ''} />`,
  },
  {
    slug: 'card',
    group: 'Flagship',
    name: 'Card',
    tagline: 'A surface container with elevation and composition regions.',
    controls: [
      {
        name: 'variant',
        label: 'Variant',
        type: 'select',
        options: ['elevated', 'outlined', 'filled'],
        default: 'elevated',
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        default: 'Project Lumina',
      },
      {
        name: 'body',
        label: 'Body',
        type: 'text',
        default: 'A premium, token-driven design system platform.',
      },
      {
        name: 'interactive',
        label: 'Interactive',
        type: 'boolean',
        default: false,
      },
    ],
    code: (v) =>
      `<lui-card variant="${attr(v, 'variant')}"${on(v, 'interactive') ? ' interactive' : ''}>\n` +
      `  <h3 cardHeader>${attr(v, 'title')}</h3>\n  <p>${attr(v, 'body')}</p>\n</lui-card>`,
  },
  {
    slug: 'switch',
    group: 'Flagship',
    name: 'Switch',
    tagline: 'A binary on/off toggle for instantly-applied settings.',
    controls: [
      {
        name: 'label',
        label: 'Label',
        type: 'text',
        default: 'Email notifications',
      },
      {
        name: 'size',
        label: 'Size',
        type: 'select',
        options: ['sm', 'md'],
        default: 'md',
      },
      { name: 'checked', label: 'Checked', type: 'boolean', default: true },
      { name: 'disabled', label: 'Disabled', type: 'boolean', default: false },
    ],
    code: (v) =>
      `<lui-switch label="${attr(v, 'label')}" size="${attr(v, 'size')}"` +
      `${on(v, 'checked') ? ' [checked]="true"' : ''}${on(v, 'disabled') ? ' disabled' : ''} />`,
  },
  {
    slug: 'spinner',
    group: 'Feedback',
    name: 'Spinner',
    tagline:
      'An accessible, indeterminate loading indicator with a live-region label.',
    controls: [
      {
        name: 'size',
        label: 'Size',
        type: 'select',
        options: ['xs', 'sm', 'md', 'lg', 'xl'],
        default: 'lg',
      },
      {
        name: 'tone',
        label: 'Tone',
        type: 'select',
        options: ['accent', 'neutral', 'current'],
        default: 'accent',
      },
      { name: 'label', label: 'Label', type: 'text', default: 'Loading' },
    ],
    code: (v) =>
      `<lui-spinner size="${attr(v, 'size')}" tone="${attr(v, 'tone')}" label="${attr(v, 'label')}" />`,
  },
  {
    slug: 'skeleton',
    group: 'Feedback',
    name: 'Skeleton',
    tagline:
      'A token-driven placeholder that mirrors content shape while it loads.',
    controls: [
      {
        name: 'variant',
        label: 'Variant',
        type: 'select',
        options: ['text', 'circular', 'rectangular'],
        default: 'text',
      },
      {
        name: 'animation',
        label: 'Animation',
        type: 'select',
        options: ['shimmer', 'pulse', 'none'],
        default: 'shimmer',
      },
      {
        name: 'lines',
        label: 'Lines',
        type: 'select',
        options: ['1', '2', '3', '4', '5'],
        default: '3',
      },
    ],
    code: (v) =>
      attr(v, 'variant') === 'text'
        ? `<lui-skeleton [lines]="${attr(v, 'lines')}" animation="${attr(v, 'animation')}" />`
        : `<lui-skeleton variant="${attr(v, 'variant')}" animation="${attr(v, 'animation')}" />`,
  },

  // ── Composites ─────────────────────────────────────────────────────────────
  {
    slug: 'tabs',
    group: 'Composites',
    name: 'Tabs',
    tagline: 'Switch between related panels within a shared context.',
    controls: [
      {
        name: 'align',
        label: 'Align',
        type: 'select',
        options: ['start', 'center', 'stretch'],
        default: 'start',
      },
    ],
    code: (v) =>
      `<lui-tabs align="${attr(v, 'align')}">\n  <lui-tab label="Overview">…</lui-tab>\n  <lui-tab label="Specs">…</lui-tab>\n</lui-tabs>`,
  },
  {
    slug: 'accordion',
    group: 'Composites',
    name: 'Accordion',
    tagline:
      'Collapsible sections that expand one panel — or many — at a time.',
    controls: [
      { name: 'multiple', label: 'Multiple', type: 'boolean', default: false },
    ],
    code: (v) =>
      `<lui-accordion [multiple]="${on(v, 'multiple')}">\n  <lui-accordion-item heading="Shipping">…</lui-accordion-item>\n  <lui-accordion-item heading="Returns">…</lui-accordion-item>\n</lui-accordion>`,
  },
  {
    slug: 'dialog',
    group: 'Composites',
    name: 'Dialog',
    tagline: 'A modal surface for focused tasks and confirmations.',
    controls: [
      {
        name: 'size',
        label: 'Size',
        type: 'select',
        options: ['sm', 'md', 'lg'],
        default: 'sm',
      },
      {
        name: 'dismissible',
        label: 'Dismissible',
        type: 'boolean',
        default: true,
      },
    ],
    code: (v) =>
      `<lui-dialog [(open)]="open" heading="Delete project?" size="${attr(v, 'size')}"${on(v, 'dismissible') ? '' : ' [dismissible]="false"'}>\n  <p>This cannot be undone.</p>\n</lui-dialog>`,
  },
  {
    slug: 'drawer',
    group: 'Composites',
    name: 'Drawer',
    tagline: 'A panel that slides in from an edge for navigation or detail.',
    controls: [
      {
        name: 'side',
        label: 'Side',
        type: 'select',
        options: ['start', 'end', 'top', 'bottom'],
        default: 'end',
      },
    ],
    code: (v) =>
      `<lui-drawer [(open)]="open" side="${attr(v, 'side')}" heading="Filters">\n  …\n</lui-drawer>`,
  },
  {
    slug: 'menu',
    group: 'Composites',
    name: 'Menu',
    tagline: 'A popover list of actions anchored to a trigger.',
    controls: [
      {
        name: 'align',
        label: 'Align',
        type: 'select',
        options: ['start', 'end'],
        default: 'start',
      },
    ],
    code: (v) =>
      `<lui-menu align="${attr(v, 'align')}">\n  <button luiMenuTrigger luiButton>Actions</button>\n  <lui-menu-item>Edit</lui-menu-item>\n  <lui-menu-item>Delete</lui-menu-item>\n</lui-menu>`,
  },
  {
    slug: 'breadcrumb',
    group: 'Composites',
    name: 'Breadcrumb',
    tagline: 'Shows the path to the current page and steps back up it.',
    controls: [],
    code: () => `<lui-breadcrumb [items]="items" />`,
  },
  {
    slug: 'pagination',
    group: 'Composites',
    name: 'Pagination',
    tagline: 'Navigate large result sets one page at a time.',
    controls: [
      {
        name: 'siblingCount',
        label: 'Siblings',
        type: 'select',
        options: ['0', '1', '2'],
        default: '1',
      },
    ],
    code: (v) =>
      `<lui-pagination [total]="120" [(page)]="page" [siblingCount]="${attr(v, 'siblingCount')}" />`,
  },
  {
    slug: 'table',
    group: 'Composites',
    name: 'Table',
    tagline: 'A typed data table with sorting, selection and loading states.',
    controls: [
      {
        name: 'selectable',
        label: 'Selectable',
        type: 'boolean',
        default: false,
      },
      {
        name: 'stickyHeader',
        label: 'Sticky header',
        type: 'boolean',
        default: true,
      },
      { name: 'loading', label: 'Loading', type: 'boolean', default: false },
    ],
    code: (v) =>
      `<lui-table\n  [columns]="columns"\n  [data]="rows"${on(v, 'selectable') ? '\n  selectable\n  [(selection)]="selected"' : ''}${on(v, 'loading') ? '\n  [loading]="true"' : ''}\n/>`,
  },
  {
    slug: 'command-palette',
    group: 'Composites',
    name: 'Command palette',
    tagline: 'A searchable overlay for running commands from the keyboard.',
    controls: [],
    code: () =>
      `<lui-command-palette\n  [(open)]="open"\n  [commands]="commands"\n  (run)="execute($event)"\n/>`,
  },
  {
    slug: 'tree',
    group: 'Composites',
    name: 'Tree',
    tagline: 'A collapsible hierarchy for files, categories or nested data.',
    controls: [
      {
        name: 'selectable',
        label: 'Selectable',
        type: 'boolean',
        default: true,
      },
    ],
    code: (v) =>
      `<lui-tree [nodes]="nodes"${on(v, 'selectable') ? ' selectable\n  [(selectedId)]="selectedId"' : ''} />`,
  },
  {
    slug: 'kanban',
    group: 'Composites',
    name: 'Kanban',
    tagline: 'A board of columns with movable cards for status workflows.',
    controls: [],
    code: () =>
      `<lui-kanban [(columns)]="columns" (cardMoved)="onCardMoved($event)" />`,
  },
  {
    slug: 'toast',
    group: 'Composites',
    name: 'Toast',
    tagline: 'Transient, non-blocking notifications triggered imperatively.',
    controls: [
      {
        name: 'variant',
        label: 'Variant',
        type: 'select',
        options: ['success', 'info', 'warning', 'danger'],
        default: 'success',
      },
    ],
    code: (v) =>
      `<!-- mount once in the app shell -->\n<lui-toast-outlet position="bottom-end" />\n\n// then, from anywhere\nprivate toast = inject(ToastService);\nthis.toast.${attr(v, 'variant') === 'danger' ? 'error' : attr(v, 'variant')}('Changes saved');`,
  },
];
