/**
 * Data model that drives the documentation shell: the sidebar navigation, the
 * per-page header, API tables, usage snippets and accessibility notes all read
 * from one registry so a new page is a single entry.
 */

export type DocGroup = 'Foundations' | 'Components' | 'Feedback' | 'Composites';
export type DocStatus = 'stable' | 'beta' | 'planned';

export interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly default: string;
  readonly description: string;
}

export interface DocLink {
  readonly label: string;
  readonly slug: string;
}

export interface DocProse {
  readonly heading: string;
  readonly text: string;
  readonly code?: string;
}

export interface DocExample {
  readonly title: string;
  readonly code: string;
}

export interface DocEntry {
  readonly slug: string;
  readonly title: string;
  readonly group: DocGroup;
  readonly summary: string;
  readonly status?: DocStatus;
  readonly since?: string;
  /** Present for component pages — enables the live preview + API sections. */
  readonly selector?: string;
  readonly usage?: string;
  /** Exported class name, for the installation snippet. Defaults to the title. */
  readonly className?: string;
  readonly api?: readonly ApiRow[];
  readonly a11y?: readonly string[];
  readonly examples?: readonly DocExample[];
  readonly dos?: readonly string[];
  readonly donts?: readonly string[];
  readonly related?: readonly DocLink[];
  /** Present for foundation/prose pages. */
  readonly body?: readonly DocProse[];
  /** Slug of the matching Component Lab entry, if any. */
  readonly lab?: string;
}

export const DOCS: readonly DocEntry[] = [
  // ── Foundations ──────────────────────────────────────────────────────────
  {
    slug: 'tokens',
    title: 'Design tokens',
    group: 'Foundations',
    summary:
      'A three-tier DTCG token system compiled to themed CSS custom properties and a typed TypeScript map.',
    status: 'stable',
    body: [
      {
        heading: 'Three tiers',
        text: 'Primitives hold raw values (an OKLCH ramp, a spacing scale). Semantic tokens map intent onto primitives (surface, foreground, accent). Component tokens bind a component to semantics. You theme by swapping the semantic layer — primitives and components follow automatically.',
      },
      {
        heading: 'OKLCH colour',
        text: 'Every colour is authored in OKLCH, a perceptual model where equal lightness steps look equally light. That is what makes a single seed hue expand into an accessible, even ramp across light, dark and high-contrast themes.',
      },
      {
        heading: 'Consuming tokens',
        text: 'Import the stylesheet once, then reference the CSS variables — or the typed map for logic.',
        code: `/* styles.css */\n@import '@lumina/tokens/styles';\n\n.card {\n  background: var(--lui-surface-default);\n  color: var(--lui-color-fg-default);\n  border-radius: var(--lui-radius-xl);\n}`,
      },
    ],
    related: [
      { label: 'Theming', slug: 'theming' },
      { label: 'Accessibility', slug: 'accessibility' },
    ],
  },
  {
    slug: 'theming',
    title: 'Theming',
    group: 'Foundations',
    summary:
      'Light, dark and high-contrast themes plus runtime custom themes, applied with a single data-theme swap.',
    status: 'stable',
    body: [
      {
        heading: 'Install the engine',
        text: 'Provide the theme engine at bootstrap. It resolves the mode (including "system"), reflects it onto <html data-theme> and persists the choice.',
        code: `import { provideLuminaTheme } from '@lumina/theme';\n\nbootstrapApplication(App, {\n  providers: [provideLuminaTheme({ defaultMode: 'system' })],\n});`,
      },
      {
        heading: 'Switch at runtime',
        text: 'Inject ThemeService to read or change the mode. Because themes are just CSS variables under a data-theme attribute, switching is a single attribute write — no re-render, no flash.',
        code: `private readonly theme = inject(ThemeService);\n\ntoggle() {\n  this.theme.setMode(this.theme.isDark() ? 'light' : 'dark');\n}`,
      },
      {
        heading: 'No flash of the wrong theme',
        text: 'themeInitScript() returns a tiny inline script you run before Angular boots, so the correct theme is applied on the very first paint.',
      },
    ],
    related: [
      { label: 'Design tokens', slug: 'tokens' },
      { label: 'Accessibility', slug: 'accessibility' },
    ],
  },
  {
    slug: 'accessibility',
    title: 'Accessibility',
    group: 'Foundations',
    summary:
      'WCAG 2.2 AA is the baseline, not a milestone — keyboard, focus, ARIA and reduced motion ship in every component.',
    status: 'stable',
    body: [
      {
        heading: 'Keyboard first',
        text: 'Every interactive component is operable from the keyboard with a visible focus ring driven by the focus-ring token. Composite widgets (menu, tabs, dialog) implement the WAI-ARIA authoring-practice keyboard model.',
      },
      {
        heading: 'Colour and contrast',
        text: 'The OKLCH ramps are tuned so foreground/background pairs meet AA contrast in every theme, and a dedicated high-contrast theme raises it further.',
      },
      {
        heading: 'Respecting motion preferences',
        text: 'All animation is gated behind prefers-reduced-motion. Spinners slow to a calm rotation, skeletons drop their shimmer, and transitions collapse.',
      },
    ],
    related: [
      { label: 'Design tokens', slug: 'tokens' },
      { label: 'Theming', slug: 'theming' },
    ],
  },

  // ── Components ───────────────────────────────────────────────────────────
  {
    slug: 'button',
    title: 'Button',
    group: 'Components',
    summary:
      'Triggers an action or navigates. Native button/anchor semantics with full state coverage.',
    status: 'stable',
    selector: 'button[luiButton]',
    lab: 'button',
    usage: `<button luiButton variant="primary">Save changes</button>\n<a luiButton variant="secondary" href="/docs">Docs</a>`,
    api: [
      {
        name: 'variant',
        type: `'primary' | 'secondary' | 'ghost' | 'danger' | 'link'`,
        default: `'primary'`,
        description: 'Visual emphasis and intent.',
      },
      {
        name: 'size',
        type: `'sm' | 'md' | 'lg'`,
        default: `'md'`,
        description: 'Control height and padding.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Shows a spinner and marks the button busy.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables interaction.',
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        default: 'false',
        description: 'Stretches to the container width.',
      },
      {
        name: 'iconOnly',
        type: 'boolean',
        default: 'false',
        description:
          'Square padding for a single icon; requires an aria-label.',
      },
    ],
    a11y: [
      'Renders a real <button> or <a>, so keyboard activation and roles come for free.',
      'A loading button sets aria-busy and stays focusable while blocking clicks.',
      'Icon-only buttons must be given an accessible name via aria-label.',
    ],
    examples: [
      {
        title: 'Submit with a loading state',
        code: `<button luiButton variant="primary" [loading]="saving()" (click)="save()">\n  Save changes\n</button>`,
      },
    ],
    dos: [
      'Use one primary button per view to signal the main action.',
      'Write labels as verbs — “Save changes”, not “OK”.',
    ],
    donts: [
      'Do not use a link-style button for a primary destructive action.',
      'Avoid disabling a button without making it clear why.',
    ],
    related: [
      { label: 'Badge', slug: 'badge' },
      { label: 'Spinner', slug: 'spinner' },
    ],
  },
  {
    slug: 'input',
    title: 'Input',
    group: 'Components',
    summary:
      'An accessible text field with label, hint, validation message and a character counter.',
    status: 'stable',
    selector: 'lui-input',
    className: 'InputField',
    lab: 'input',
    usage: `<lui-input\n  label="Email address"\n  placeholder="ada@lumina.dev"\n  hint="We'll never share it."\n/>`,
    api: [
      {
        name: 'label',
        type: 'string',
        default: `''`,
        description: 'Field label, wired to the input for you.',
      },
      {
        name: 'hint',
        type: 'string',
        default: `''`,
        description: 'Helper text shown below the field.',
      },
      {
        name: 'error',
        type: 'string',
        default: `''`,
        description: 'Error message; also marks the field invalid.',
      },
      {
        name: 'type',
        type: 'string',
        default: `'text'`,
        description: 'Native input type.',
      },
      {
        name: 'size',
        type: `'sm' | 'md' | 'lg'`,
        default: `'md'`,
        description: 'Control height.',
      },
      {
        name: 'maxLength',
        type: 'number | null',
        default: 'null',
        description: 'Enables a live character counter.',
      },
      {
        name: 'value',
        type: 'model<string>',
        default: `''`,
        description: 'Two-way bound value; also a ControlValueAccessor.',
      },
    ],
    a11y: [
      'The label, hint and error are associated with the input via aria-describedby / aria-invalid.',
      'Implements ControlValueAccessor, so it works with Angular forms and their validation.',
    ],
    examples: [
      {
        title: 'Reactive form field',
        code: `<lui-input\n  label="Email"\n  [formControl]="email"\n  [error]="email.touched && email.invalid ? 'Enter a valid email.' : ''"\n/>`,
      },
    ],
    dos: [
      'Always pair an input with a visible label.',
      'Use the hint for format guidance and the error for what went wrong.',
    ],
    donts: [
      'Do not use placeholder text as the only label.',
      'Avoid showing validation errors before the field has been touched.',
    ],
    related: [
      { label: 'Switch', slug: 'switch' },
      { label: 'Button', slug: 'button' },
    ],
  },
  {
    slug: 'badge',
    title: 'Badge',
    group: 'Components',
    summary: 'A compact status or count indicator.',
    status: 'stable',
    selector: 'span[luiBadge]',
    lab: 'badge',
    usage: `<span luiBadge variant="success" appearance="subtle">Active</span>`,
    api: [
      {
        name: 'variant',
        type: `'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'`,
        default: `'neutral'`,
        description: 'Semantic colour.',
      },
      {
        name: 'appearance',
        type: `'solid' | 'subtle' | 'outline'`,
        default: `'subtle'`,
        description: 'Fill treatment.',
      },
      {
        name: 'size',
        type: `'sm' | 'md'`,
        default: `'md'`,
        description: 'Badge scale.',
      },
    ],
    a11y: [
      'A badge is decorative text; when it conveys a live status, describe that status in nearby content rather than colour alone.',
    ],
    examples: [
      {
        title: 'Status beside a title',
        code: `<div class="row">\n  <h3>Production</h3>\n  <span luiBadge variant="success">Live</span>\n</div>`,
      },
    ],
    dos: [
      'Keep badge text to a word or two.',
      'Match the variant to the meaning — success for healthy, danger for errors.',
    ],
    donts: [
      'Do not rely on colour alone to convey status.',
      'Avoid putting interactive controls inside a badge.',
    ],
    related: [
      { label: 'Avatar', slug: 'avatar' },
      { label: 'Button', slug: 'button' },
    ],
  },
  {
    slug: 'avatar',
    title: 'Avatar',
    group: 'Components',
    summary: 'Represents a user or entity, with a graceful initials fallback.',
    status: 'stable',
    selector: 'lui-avatar',
    lab: 'avatar',
    usage: `<lui-avatar name="Ada Lovelace" size="lg" status="online" />`,
    api: [
      {
        name: 'name',
        type: 'string',
        default: `''`,
        description: 'Full name; drives initials and the accessible label.',
      },
      {
        name: 'src',
        type: 'string | null',
        default: 'null',
        description: 'Image URL; falls back to initials on error.',
      },
      {
        name: 'size',
        type: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`,
        default: `'md'`,
        description: 'Avatar diameter.',
      },
      {
        name: 'shape',
        type: `'circle' | 'square'`,
        default: `'circle'`,
        description: 'Corner treatment.',
      },
      {
        name: 'status',
        type: `'online' | 'offline' | 'busy' | 'away' | null`,
        default: 'null',
        description: 'Presence dot.',
      },
    ],
    a11y: [
      'The image carries the name as alt text; the initials fallback exposes the same name to screen readers.',
      'The presence dot is decorative — pair it with text if the status matters.',
    ],
    examples: [
      {
        title: 'Identity row',
        code: `<div class="row">\n  <lui-avatar name="Ada Lovelace" status="online" />\n  <div>\n    <strong>Ada Lovelace</strong>\n    <div class="muted">Engineering</div>\n  </div>\n</div>`,
      },
    ],
    dos: [
      'Provide the full name so initials and the accessible label are correct.',
      'Use the status dot only where presence is meaningful.',
    ],
    donts: [
      'Do not use an avatar as the only way to identify a user.',
      'Avoid distorting non-square images — they are cropped to fit.',
    ],
    related: [
      { label: 'Badge', slug: 'badge' },
      { label: 'Skeleton', slug: 'skeleton' },
    ],
  },
  {
    slug: 'switch',
    title: 'Switch',
    group: 'Components',
    summary: 'A binary on/off toggle for instantly-applied settings.',
    status: 'stable',
    selector: 'lui-switch',
    usage: `<lui-switch label="Email notifications" [(checked)]="notify" />`,
    api: [
      {
        name: 'label',
        type: 'string',
        default: `''`,
        description: 'Visible label.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: `''`,
        description: 'Accessible name when there is no visible label.',
      },
      {
        name: 'size',
        type: `'sm' | 'md'`,
        default: `'md'`,
        description: 'Switch scale.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables interaction.',
      },
      {
        name: 'checked',
        type: 'model<boolean>',
        default: 'false',
        description: 'Two-way bound state; also a ControlValueAccessor.',
      },
    ],
    a11y: [
      'Exposes role="switch" with aria-checked and is fully keyboard operable (Space / Enter).',
      'Provide a label or ariaLabel — never rely on surrounding layout alone.',
    ],
    examples: [
      {
        title: 'Bound to a setting',
        code: `<lui-switch\n  label="Email notifications"\n  [(checked)]="settings.notify"\n/>`,
      },
    ],
    dos: [
      'Use a switch for settings that apply immediately.',
      'Give every switch a label or ariaLabel.',
    ],
    donts: [
      'Do not use a switch where a form checkbox is expected.',
      'Avoid requiring a separate “Save” step after a switch is toggled.',
    ],
    related: [
      { label: 'Input', slug: 'input' },
      { label: 'Button', slug: 'button' },
    ],
  },
  {
    slug: 'card',
    title: 'Card',
    group: 'Components',
    summary:
      'A surface container with elevated, outlined and filled variants and composable regions.',
    status: 'stable',
    selector: 'lui-card',
    lab: 'card',
    usage: `<lui-card variant="elevated">\n  <h3 cardHeader>Title</h3>\n  <p>Body content.</p>\n  <div cardFooter><button luiButton size="sm">Action</button></div>\n</lui-card>`,
    api: [
      {
        name: 'variant',
        type: `'elevated' | 'outlined' | 'filled'`,
        default: `'elevated'`,
        description: 'Surface treatment.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        default: 'false',
        description: 'Makes the whole card a keyboard-activatable target.',
      },
      {
        name: 'cardClick',
        type: 'output<Event>',
        default: '—',
        description: 'Emitted when an interactive card is activated.',
      },
    ],
    a11y: [
      'An interactive card gets role="button", a tabindex and Enter/Space activation.',
      'Do not nest focusable controls inside an interactive card — use a static card with inner buttons instead.',
    ],
    examples: [
      {
        title: 'Media card with actions',
        code: `<lui-card variant="elevated">\n  <img cardMedia src="cover.jpg" alt="" />\n  <h3 cardHeader>Mountain retreat</h3>\n  <p>Three nights, breakfast included.</p>\n  <div cardFooter>\n    <button luiButton size="sm">Book</button>\n    <button luiButton size="sm" variant="ghost">Details</button>\n  </div>\n</lui-card>`,
      },
    ],
    dos: [
      'Use an interactive card when the whole surface navigates somewhere.',
      'Keep a consistent variant within a single grid.',
    ],
    donts: [
      'Do not place buttons or links inside an interactive card.',
      'Avoid mixing elevated and outlined cards in the same list.',
    ],
    related: [
      { label: 'Button', slug: 'button' },
      { label: 'Skeleton', slug: 'skeleton' },
    ],
  },

  // ── Feedback ─────────────────────────────────────────────────────────────
  {
    slug: 'spinner',
    title: 'Spinner',
    group: 'Feedback',
    summary:
      'An accessible, indeterminate loading indicator with a live-region label.',
    status: 'stable',
    selector: 'lui-spinner',
    lab: 'spinner',
    usage: `<lui-spinner />\n<lui-spinner size="sm" tone="current" label="Saving changes" />`,
    api: [
      {
        name: 'size',
        type: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`,
        default: `'md'`,
        description: 'Diameter of the spinner.',
      },
      {
        name: 'tone',
        type: `'accent' | 'neutral' | 'current'`,
        default: `'accent'`,
        description: 'Arc colour; "current" inherits the text colour.',
      },
      {
        name: 'label',
        type: 'string',
        default: `'Loading'`,
        description: 'Announced by assistive technology.',
      },
    ],
    a11y: [
      'The host is a live region (role="status", aria-live="polite") so the label is announced.',
      'The rotating artwork is aria-hidden; the label carries the meaning.',
      'Rotation slows under prefers-reduced-motion rather than stopping abruptly.',
    ],
    examples: [
      {
        title: 'Centered panel loading',
        code: `@if (loading()) {\n  <div class="panel-center">\n    <lui-spinner size="lg" label="Loading results" />\n  </div>\n}`,
      },
    ],
    dos: [
      'Give the spinner a label describing what is loading.',
      'Use tone="current" inside buttons so it matches the text.',
    ],
    donts: [
      'Do not show a spinner for loads under ~300ms — it reads as a flash.',
      'Avoid a spinner where a skeleton better represents the incoming content.',
    ],
    related: [
      { label: 'Skeleton', slug: 'skeleton' },
      { label: 'Button', slug: 'button' },
    ],
  },
  {
    slug: 'skeleton',
    title: 'Skeleton',
    group: 'Feedback',
    summary:
      'A token-driven placeholder that mirrors content shape while it loads.',
    status: 'stable',
    selector: 'lui-skeleton',
    lab: 'skeleton',
    usage: `<lui-skeleton [lines]="3" />\n<lui-skeleton variant="circular" width="2.5rem" height="2.5rem" />`,
    api: [
      {
        name: 'variant',
        type: `'text' | 'circular' | 'rectangular'`,
        default: `'text'`,
        description: 'Placeholder shape.',
      },
      {
        name: 'lines',
        type: 'number',
        default: '1',
        description: 'Number of lines for the text variant.',
      },
      {
        name: 'animation',
        type: `'shimmer' | 'pulse' | 'none'`,
        default: `'shimmer'`,
        description: 'Loading animation.',
      },
      {
        name: 'width / height',
        type: 'string',
        default: '—',
        description: 'CSS sizes for the block shapes.',
      },
    ],
    a11y: [
      'Skeletons are decorative (aria-hidden); pair them with a status message so assistive technology is told content is loading.',
      'The shimmer/pulse animation is removed under prefers-reduced-motion.',
    ],
    examples: [
      {
        title: 'Card placeholder while loading',
        code: `@if (loading()) {\n  <lui-card>\n    <lui-skeleton variant="rectangular" height="9rem" />\n    <div class="row">\n      <lui-skeleton variant="circular" width="2.5rem" height="2.5rem" />\n      <lui-skeleton [lines]="2" />\n    </div>\n  </lui-card>\n}`,
      },
    ],
    dos: [
      'Match the skeleton shape to the content it replaces.',
      'Pair skeletons with a screen-reader status message.',
    ],
    donts: [
      'Do not use skeletons for very fast loads — they add perceived latency.',
      'Avoid a single generic bar where the real layout has distinct regions.',
    ],
    related: [
      { label: 'Spinner', slug: 'spinner' },
      { label: 'Card', slug: 'card' },
    ],
  },

  // ── Composites ───────────────────────────────────────────────────────────
  {
    slug: 'tabs',
    title: 'Tabs',
    group: 'Composites',
    summary: 'Switch between related panels within a shared context.',
    status: 'stable',
    selector: 'lui-tabs',
    className: 'Tabs',
    usage: `<lui-tabs [(selectedIndex)]="index">\n  <lui-tab label="Overview">…</lui-tab>\n  <lui-tab label="Specifications">…</lui-tab>\n</lui-tabs>`,
    api: [
      {
        name: 'selectedIndex',
        type: 'model<number>',
        default: '0',
        description: 'Active tab, two-way bound.',
      },
      {
        name: 'align',
        type: `'start' | 'center' | 'stretch'`,
        default: `'start'`,
        description: 'Tab-strip alignment.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: `''`,
        description: 'Accessible name for the tab list.',
      },
      {
        name: 'lui-tab › label',
        type: 'string (required)',
        default: '—',
        description: 'Label for each tab; `disabled` is also supported.',
      },
    ],
    a11y: [
      'Implements the ARIA tabs pattern — role tablist / tab / tabpanel with a roving tabindex.',
      'Arrow keys move between tabs; each panel is linked with aria-controls / aria-labelledby.',
    ],
    related: [
      { label: 'Accordion', slug: 'accordion' },
      { label: 'Card', slug: 'card' },
    ],
  },
  {
    slug: 'accordion',
    title: 'Accordion',
    group: 'Composites',
    summary:
      'Collapsible sections that expand one panel — or many — at a time.',
    status: 'stable',
    selector: 'lui-accordion',
    className: 'Accordion',
    usage: `<lui-accordion [multiple]="false">\n  <lui-accordion-item heading="Shipping">…</lui-accordion-item>\n  <lui-accordion-item heading="Returns">…</lui-accordion-item>\n</lui-accordion>`,
    api: [
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        description: 'Allow more than one item open at once.',
      },
      {
        name: 'lui-accordion-item › heading',
        type: 'string (required)',
        default: '—',
        description:
          'Header text; `expanded` is a two-way model, `disabled` supported.',
      },
    ],
    a11y: [
      'Each header is a button with aria-expanded controlling its region.',
      'Fully keyboard operable; collapsed panels are removed from the tab order.',
    ],
    related: [
      { label: 'Tabs', slug: 'tabs' },
      { label: 'Card', slug: 'card' },
    ],
  },
  {
    slug: 'dialog',
    title: 'Dialog',
    group: 'Composites',
    summary: 'A modal surface for focused tasks and confirmations.',
    status: 'stable',
    selector: 'lui-dialog',
    className: 'Dialog',
    usage: `<button luiButton (click)="open.set(true)">Delete</button>\n<lui-dialog [(open)]="open" heading="Delete project?" size="sm">\n  <p>This cannot be undone.</p>\n</lui-dialog>`,
    api: [
      {
        name: 'open',
        type: 'model<boolean>',
        default: 'false',
        description: 'Visibility, two-way bound.',
      },
      {
        name: 'heading / description',
        type: 'string',
        default: `''`,
        description: 'Title and supporting text, wired as the accessible name.',
      },
      {
        name: 'size',
        type: `'sm' | 'md' | 'lg'`,
        default: `'md'`,
        description: 'Dialog width.',
      },
      {
        name: 'dismissible',
        type: 'boolean',
        default: 'true',
        description: 'Show the close affordance.',
      },
      {
        name: 'closeOnBackdrop / closeOnEscape',
        type: 'boolean',
        default: 'true',
        description: 'Light-dismiss behaviours.',
      },
      {
        name: 'closed',
        type: 'output<void>',
        default: '—',
        description: 'Emitted after the dialog closes.',
      },
    ],
    a11y: [
      'role="dialog" with aria-modal; focus is trapped inside and restored to the trigger on close.',
      'Escape closes it (unless disabled); the backdrop scrim blocks the page behind.',
    ],
    related: [
      { label: 'Drawer', slug: 'drawer' },
      { label: 'Button', slug: 'button' },
    ],
  },
  {
    slug: 'drawer',
    title: 'Drawer',
    group: 'Composites',
    summary: 'A panel that slides in from an edge for navigation or detail.',
    status: 'stable',
    selector: 'lui-drawer',
    className: 'Drawer',
    usage: `<lui-drawer [(open)]="open" side="end" heading="Filters">\n  …\n</lui-drawer>`,
    api: [
      {
        name: 'open',
        type: 'model<boolean>',
        default: 'false',
        description: 'Visibility, two-way bound.',
      },
      {
        name: 'side',
        type: `'start' | 'end' | 'top' | 'bottom'`,
        default: `'end'`,
        description: 'Edge the drawer enters from.',
      },
      {
        name: 'heading',
        type: 'string',
        default: `''`,
        description: 'Title / accessible name.',
      },
      {
        name: 'dismissible / closeOnBackdrop / closeOnEscape',
        type: 'boolean',
        default: 'true',
        description: 'Close affordance and light-dismiss behaviours.',
      },
      {
        name: 'closed',
        type: 'output<void>',
        default: '—',
        description: 'Emitted after the drawer closes.',
      },
    ],
    a11y: [
      'role="dialog" with aria-modal, a focus trap and focus restoration, like Dialog.',
      'Escape and backdrop dismiss are configurable.',
    ],
    related: [
      { label: 'Dialog', slug: 'dialog' },
      { label: 'Menu', slug: 'menu' },
    ],
  },
  {
    slug: 'menu',
    title: 'Menu',
    group: 'Composites',
    summary: 'A popover list of actions anchored to a trigger.',
    status: 'stable',
    selector: 'lui-menu',
    className: 'Menu',
    usage: `<button luiButton [luiMenuTrigger]="menu">Actions</button>\n<lui-menu #menu align="end">\n  <button luiMenuItem>Edit</button>\n  <button luiMenuItem>Delete</button>\n</lui-menu>`,
    api: [
      {
        name: 'open',
        type: 'model<boolean>',
        default: 'false',
        description: 'Open state (usually driven by the trigger).',
      },
      {
        name: 'align',
        type: `'start' | 'end'`,
        default: `'start'`,
        description: 'Alignment to the trigger.',
      },
      {
        name: '[luiMenuTrigger]',
        type: 'directive',
        default: '—',
        description: 'Attach to the button that opens a menu.',
      },
    ],
    a11y: [
      'role="menu" / "menuitem"; opens on click or Enter/Space and is arrow-key navigable.',
      'Escape closes and returns focus to the trigger; focus is managed within the menu.',
    ],
    related: [
      { label: 'Command Palette', slug: 'command-palette' },
      { label: 'Button', slug: 'button' },
    ],
  },
  {
    slug: 'toast',
    title: 'Toast',
    group: 'Composites',
    summary: 'Transient, non-blocking notifications triggered imperatively.',
    status: 'stable',
    selector: 'lui-toast-outlet',
    className: 'ToastService',
    usage: `<!-- mount the outlet once, in the app shell -->\n<lui-toast-outlet position="bottom-end" />\n\n// then show toasts from anywhere\nprivate toast = inject(ToastService);\nthis.toast.success('Saved', 'Your changes are live.');`,
    api: [
      {
        name: 'position',
        type: `'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' (+ centre variants)`,
        default: `'bottom-end'`,
        description: 'Where toasts stack (on lui-toast-outlet).',
      },
      {
        name: 'ToastService.show',
        type: '(options) => number',
        default: '—',
        description: 'Full control; returns the toast id.',
      },
      {
        name: '.success / .error / .warning / .info',
        type: '(message, title?, duration?) => number',
        default: '—',
        description: 'Convenience helpers per variant.',
      },
    ],
    a11y: [
      'The outlet is a polite live region, so new toasts are announced without stealing focus.',
      'Toasts auto-dismiss on a timer and can be dismissed manually.',
    ],
    related: [
      { label: 'Spinner', slug: 'spinner' },
      { label: 'Dialog', slug: 'dialog' },
    ],
  },
  {
    slug: 'breadcrumb',
    title: 'Breadcrumb',
    group: 'Composites',
    summary:
      'Shows the path to the current page and lets users step back up it.',
    status: 'stable',
    selector: 'lui-breadcrumb',
    className: 'Breadcrumb',
    usage: `<lui-breadcrumb [items]="[\n  { label: 'Docs', href: '/docs' },\n  { label: 'Components', href: '/components' },\n  { label: 'Breadcrumb' },\n]" />`,
    api: [
      {
        name: 'items',
        type: 'BreadcrumbItem[] (required)',
        default: '—',
        description: 'Each item has a label and optional href / routerLink.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: `'Breadcrumb'`,
        description: 'Accessible name for the nav landmark.',
      },
    ],
    a11y: [
      'Rendered as a nav landmark; the final item is marked aria-current="page".',
    ],
    related: [
      { label: 'Pagination', slug: 'pagination' },
      { label: 'Tabs', slug: 'tabs' },
    ],
  },
  {
    slug: 'pagination',
    title: 'Pagination',
    group: 'Composites',
    summary: 'Navigate large result sets one page at a time.',
    status: 'stable',
    selector: 'lui-pagination',
    className: 'Pagination',
    usage: `<lui-pagination [total]="120" [pageSize]="10" [(page)]="page" />`,
    api: [
      {
        name: 'total',
        type: 'number (required)',
        default: '—',
        description: 'Total number of items.',
      },
      {
        name: 'page',
        type: 'model<number>',
        default: '1',
        description: 'Current page, two-way bound.',
      },
      {
        name: 'siblingCount',
        type: 'number',
        default: '1',
        description: 'Page links shown either side of the current page.',
      },
      {
        name: 'pageChange',
        type: 'output<number>',
        default: '—',
        description: 'Emitted when the page changes.',
      },
    ],
    a11y: [
      'A nav landmark; the active page is aria-current and the ends disable at the bounds.',
    ],
    related: [
      { label: 'Table', slug: 'table' },
      { label: 'Breadcrumb', slug: 'breadcrumb' },
    ],
  },
  {
    slug: 'table',
    title: 'Table',
    group: 'Composites',
    summary: 'A typed data table with sorting, selection and loading states.',
    status: 'stable',
    selector: 'lui-table',
    className: 'Table',
    usage: `<lui-table\n  [columns]="columns"\n  [data]="rows"\n  selectable\n  [(selection)]="selected"\n/>`,
    api: [
      {
        name: 'columns',
        type: 'TableColumn<T>[] (required)',
        default: '—',
        description: 'Column defs — header, accessor, alignment, sort.',
      },
      {
        name: 'data',
        type: 'T[] (required)',
        default: '—',
        description: 'Row data.',
      },
      {
        name: 'selectable',
        type: 'boolean',
        default: 'false',
        description: 'Enable row-selection checkboxes.',
      },
      {
        name: 'stickyHeader',
        type: 'boolean',
        default: 'true',
        description: 'Keep the header visible while scrolling.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description:
          'Show a loading state; emptyMessage covers the empty case.',
      },
      {
        name: 'selection',
        type: 'model<T[]>',
        default: '[]',
        description: 'Selected rows, two-way bound.',
      },
    ],
    a11y: [
      'Semantic table markup; sortable headers expose aria-sort and are keyboard operable.',
      'Selection checkboxes are individually labelled.',
    ],
    related: [
      { label: 'Pagination', slug: 'pagination' },
      { label: 'Skeleton', slug: 'skeleton' },
    ],
  },
  {
    slug: 'command-palette',
    title: 'Command palette',
    group: 'Composites',
    summary: 'A searchable overlay for running commands from the keyboard.',
    status: 'stable',
    selector: 'lui-command-palette',
    className: 'CommandPalette',
    usage: `<lui-command-palette\n  [(open)]="open"\n  [commands]="commands"\n  (run)="execute($event)"\n/>`,
    api: [
      {
        name: 'open',
        type: 'model<boolean>',
        default: 'false',
        description: 'Visibility, two-way bound (open it on Ctrl/Cmd-K).',
      },
      {
        name: 'commands',
        type: 'Command[] (required)',
        default: '—',
        description: 'Available commands — id, label, group, keywords.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: `'Type a command or search…'`,
        description: 'Search-input placeholder.',
      },
      {
        name: 'run',
        type: 'output<Command>',
        default: '—',
        description: 'Emitted when a command is chosen.',
      },
    ],
    a11y: [
      'Implements the combobox/listbox pattern; results are arrow-key navigable.',
      'Escape closes it and focus returns to where it was opened from.',
    ],
    related: [
      { label: 'Menu', slug: 'menu' },
      { label: 'Input', slug: 'input' },
    ],
  },
  {
    slug: 'tree',
    title: 'Tree',
    group: 'Composites',
    summary: 'A collapsible hierarchy for files, categories or nested data.',
    status: 'stable',
    selector: 'lui-tree',
    className: 'Tree',
    usage: `<lui-tree [nodes]="nodes" selectable [(selectedId)]="selectedId" />`,
    api: [
      {
        name: 'nodes',
        type: 'TreeNode[] (required)',
        default: '—',
        description: 'Hierarchical nodes — id, label, children.',
      },
      {
        name: 'selectable',
        type: 'boolean',
        default: 'false',
        description: 'Allow a node to be selected.',
      },
      {
        name: 'selectedId',
        type: 'model<string | null>',
        default: 'null',
        description: 'Selected node id, two-way bound.',
      },
    ],
    a11y: [
      'Implements the ARIA tree pattern — role tree / treeitem with aria-expanded.',
      'Arrow keys expand, collapse and move through the hierarchy.',
    ],
    related: [
      { label: 'Table', slug: 'table' },
      { label: 'Accordion', slug: 'accordion' },
    ],
  },
  {
    slug: 'kanban',
    title: 'Kanban',
    group: 'Composites',
    summary: 'A board of columns with movable cards for status workflows.',
    status: 'stable',
    selector: 'lui-kanban',
    className: 'Kanban',
    usage: `<lui-kanban [(columns)]="columns" (cardMoved)="onCardMoved($event)" />`,
    api: [
      {
        name: 'columns',
        type: 'model<KanbanColumn[]>',
        default: '[]',
        description: 'Board columns and their cards, two-way bound.',
      },
      {
        name: 'cardMoved',
        type: 'output<CardMovedEvent>',
        default: '—',
        description: 'Emitted with the from/to column and index on a move.',
      },
    ],
    a11y: [
      'Cards can be moved with the keyboard, not only by pointer drag.',
      'Column regions are labelled so assistive tech can announce moves.',
    ],
    related: [
      { label: 'Card', slug: 'card' },
      { label: 'Table', slug: 'table' },
    ],
  },
];

export const DOC_GROUPS: readonly DocGroup[] = [
  'Foundations',
  'Components',
  'Feedback',
  'Composites',
];

export function findDoc(slug: string): DocEntry | undefined {
  return DOCS.find((d) => d.slug === slug);
}
