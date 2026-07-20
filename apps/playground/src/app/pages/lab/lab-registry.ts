/**
 * Data model that drives the Component Lab: each entry declares its interactive
 * controls and a code generator, so the preview, controls panel and code output
 * all stay in sync from one source.
 */

export type ControlValue = string | boolean;

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
    slug: 'spinner',
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
];
