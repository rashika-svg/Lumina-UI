import type { Meta, StoryObj } from '@storybook/angular';
import { Spinner } from './spinner';

const meta: Meta<Spinner> = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    tone: {
      control: 'inline-radio',
      options: ['accent', 'neutral', 'current'],
    },
    label: { control: 'text' },
  },
  args: { size: 'md', tone: 'accent', label: 'Loading' },
  render: (args) => ({
    props: args,
    template: `<lui-spinner [size]="size" [tone]="tone" [label]="label" />`,
  }),
};
export default meta;

type Story = StoryObj<Spinner>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:1.25rem">
        <lui-spinner size="xs" />
        <lui-spinner size="sm" />
        <lui-spinner size="md" />
        <lui-spinner size="lg" />
        <lui-spinner size="xl" />
      </div>`,
  }),
};

export const Tones: Story = {
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:1.25rem">
        <lui-spinner tone="accent" size="lg" />
        <lui-spinner tone="neutral" size="lg" />
        <span style="color: var(--lui-color-fg-link)">
          <lui-spinner tone="current" size="lg" />
        </span>
      </div>`,
  }),
};

export const DarkTheme: Story = {
  globals: { theme: 'dark' },
  ...Sizes,
};
