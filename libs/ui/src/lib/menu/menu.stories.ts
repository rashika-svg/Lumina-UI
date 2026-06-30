import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Button } from '../button/button';
import { Menu } from './menu';
import { MenuItem } from './menu-item';
import { MenuTrigger } from './menu-trigger';

const meta: Meta<Menu> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [MenuTrigger, MenuItem, Button] })],
  argTypes: { align: { control: 'inline-radio', options: ['start', 'end'] } },
  args: { align: 'start' },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 4rem 1rem">
        <lui-menu [align]="align">
          <button luiButton variant="secondary" luiMenuTrigger>Options</button>
          <lui-menu-item>Edit</lui-menu-item>
          <lui-menu-item>Duplicate</lui-menu-item>
          <lui-menu-item [disabled]="true">Archive</lui-menu-item>
          <lui-menu-item>Delete</lui-menu-item>
        </lui-menu>
      </div>`,
  }),
};
export default meta;

type Story = StoryObj<Menu>;

export const Playground: Story = {};
export const AlignEnd: Story = { args: { align: 'end' } };
export const DarkTheme: Story = { globals: { theme: 'dark' } };
