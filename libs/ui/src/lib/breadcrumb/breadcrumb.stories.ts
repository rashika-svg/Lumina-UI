import type { Meta, StoryObj } from '@storybook/angular';
import { Breadcrumb } from './breadcrumb';

const meta: Meta<Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Components', href: '#' },
      { label: 'Breadcrumb' },
    ],
  },
};
export default meta;

type Story = StoryObj<Breadcrumb>;

export const Playground: Story = {};
export const DarkTheme: Story = { globals: { theme: 'dark' } };
