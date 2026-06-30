import type { Meta, StoryObj } from '@storybook/angular';
import { Switch } from './switch';

const meta: Meta<Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
  args: {
    label: 'Email notifications',
    size: 'md',
    disabled: false,
    checked: true,
  },
  render: (args) => ({
    props: args,
    template: `<lui-switch [label]="label" [size]="size" [disabled]="disabled" [checked]="checked" />`,
  }),
};
export default meta;

type Story = StoryObj<Switch>;

export const Playground: Story = {};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:.75rem; align-items:flex-start">
        <lui-switch label="Off" [checked]="false" />
        <lui-switch label="On" [checked]="true" />
        <lui-switch label="Disabled" disabled />
        <lui-switch label="Small" size="sm" [checked]="true" />
      </div>`,
  }),
};

export const DarkTheme: Story = {
  args: {
    checked: false,
  },

  globals: { theme: 'dark' },
  ...States,
};
