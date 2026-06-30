import type { Meta, StoryObj } from '@storybook/angular';
import { Badge } from './badge';

const meta: Meta<Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'],
    },
    appearance: {
      control: 'inline-radio',
      options: ['solid', 'subtle', 'outline'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { variant: 'accent', appearance: 'subtle', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<span luiBadge [variant]="variant" [appearance]="appearance" [size]="size">Badge</span>`,
  }),
};
export default meta;

type Story = StoryObj<Badge>;

export const Playground: Story = {};

export const Appearances: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:.75rem">
        <div style="display:flex; gap:.5rem; flex-wrap:wrap">
          <span luiBadge appearance="subtle" variant="accent">Subtle</span>
          <span luiBadge appearance="subtle" variant="success">Success</span>
          <span luiBadge appearance="subtle" variant="warning">Warning</span>
          <span luiBadge appearance="subtle" variant="danger">Danger</span>
          <span luiBadge appearance="subtle" variant="info">Info</span>
        </div>
        <div style="display:flex; gap:.5rem; flex-wrap:wrap">
          <span luiBadge appearance="solid" variant="accent">Solid</span>
          <span luiBadge appearance="solid" variant="success">Success</span>
          <span luiBadge appearance="solid" variant="danger">Danger</span>
        </div>
        <div style="display:flex; gap:.5rem; flex-wrap:wrap">
          <span luiBadge appearance="outline" variant="neutral">Outline</span>
          <span luiBadge appearance="outline" variant="accent">Accent</span>
        </div>
      </div>`,
  }),
};

export const DarkTheme: Story = {
  globals: { theme: 'dark' },
  ...Appearances,
};
