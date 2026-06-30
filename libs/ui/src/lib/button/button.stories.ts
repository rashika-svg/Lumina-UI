import type { Meta, StoryObj } from '@storybook/angular';
import { Button } from './button';

const meta: Meta<Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger', 'link'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: { variant: 'primary', size: 'md', disabled: false, loading: false },
  render: (args) => ({
    props: args,
    template: `
      <button luiButton
        [variant]="variant" [size]="size"
        [disabled]="disabled" [loading]="loading" [fullWidth]="fullWidth">
        Button
      </button>`,
  }),
};
export default meta;

type Story = StoryObj<Button>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:.75rem; flex-wrap:wrap; align-items:center">
        <button luiButton variant="primary">Primary</button>
        <button luiButton variant="secondary">Secondary</button>
        <button luiButton variant="ghost">Ghost</button>
        <button luiButton variant="danger">Danger</button>
        <button luiButton variant="link">Link</button>
      </div>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:.75rem; align-items:center">
        <button luiButton size="sm">Small</button>
        <button luiButton size="md">Medium</button>
        <button luiButton size="lg">Large</button>
      </div>`,
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:.75rem; align-items:center; flex-wrap:wrap">
        <button luiButton>Default</button>
        <button luiButton disabled>Disabled</button>
        <button luiButton [loading]="true">Loading</button>
        <a luiButton variant="secondary" href="#">Anchor</a>
      </div>`,
  }),
};

/** Renders against the dark theme to verify token-driven theming. */
export const DarkTheme: Story = {
  globals: { theme: 'dark' },
  ...Variants,
};

/** High-contrast theme story — useful for accessibility review. */
export const HighContrast: Story = {
  globals: { theme: 'hc' },
  ...Variants,
};
