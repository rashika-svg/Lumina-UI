import type { Meta, StoryObj } from '@storybook/angular';
import { Skeleton } from './skeleton';

const meta: Meta<Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['text', 'circular', 'rectangular'],
    },
    animation: {
      control: 'inline-radio',
      options: ['shimmer', 'pulse', 'none'],
    },
    lines: { control: { type: 'number', min: 1, max: 6 } },
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: { variant: 'text', animation: 'shimmer', lines: 3 },
  render: (args) => ({
    props: args,
    template: `<div style="inline-size:18rem"><lui-skeleton [variant]="variant" [animation]="animation" [lines]="lines" [width]="width" [height]="height" /></div>`,
  }),
};
export default meta;

type Story = StoryObj<Skeleton>;

export const Playground: Story = {};

export const Shapes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:1.5rem">
        <lui-skeleton variant="circular" width="3rem" height="3rem" />
        <div style="inline-size:12rem"><lui-skeleton [lines]="3" /></div>
        <lui-skeleton variant="rectangular" width="10rem" height="6rem" />
      </div>`,
  }),
};

/** A realistic "media card" composition assembled from primitives. */
export const CardPlaceholder: Story = {
  render: () => ({
    template: `
      <div style="inline-size:18rem; padding:1rem; border:1px solid var(--lui-color-border-default); border-radius:var(--lui-radius-xl)">
        <lui-skeleton variant="rectangular" height="9rem" />
        <div style="display:flex; align-items:center; gap:.75rem; margin-block-start:1rem">
          <lui-skeleton variant="circular" width="2.5rem" height="2.5rem" />
          <div style="flex:1"><lui-skeleton [lines]="2" /></div>
        </div>
      </div>`,
  }),
};

export const DarkTheme: Story = {
  globals: { theme: 'dark' },
  ...Shapes,
};
