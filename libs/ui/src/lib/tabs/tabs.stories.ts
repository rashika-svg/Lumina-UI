import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Tab } from './tab';
import { Tabs } from './tabs';

const meta: Meta<Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [Tab] })],
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'center', 'stretch'] },
  },
  args: { align: 'start' },
  render: (args) => ({
    props: args,
    template: `
      <lui-tabs [align]="align" ariaLabel="Demo">
        <lui-tab label="Account">Manage your account details here.</lui-tab>
        <lui-tab label="Security">Update your password and 2FA.</lui-tab>
        <lui-tab label="Billing" [disabled]="true">Billing is unavailable.</lui-tab>
        <lui-tab label="Notifications">Choose what you hear about.</lui-tab>
      </lui-tabs>`,
  }),
};
export default meta;

type Story = StoryObj<Tabs>;

export const Playground: Story = {};
export const Stretch: Story = { args: { align: 'stretch' } };
export const DarkTheme: Story = { globals: { theme: 'dark' } };
