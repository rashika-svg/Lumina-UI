import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Badge } from '../badge/badge';
import { Button } from '../button/button';
import { Card } from './card';

const meta: Meta<Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [Button, Badge] })],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['elevated', 'outlined', 'filled'],
    },
    interactive: { control: 'boolean' },
  },
  args: { variant: 'elevated', interactive: false },
  render: (args) => ({
    props: args,
    template: `
      <lui-card [variant]="variant" [interactive]="interactive" style="max-width: 22rem">
        <h3 cardHeader>Project Lumina</h3>
        <p>A premium, token-driven design system platform built with Angular and OKLCH colour.</p>
        <div cardFooter>
          <button luiButton size="sm">Open</button>
          <span luiBadge variant="success" appearance="subtle">Active</span>
        </div>
      </lui-card>`,
  }),
};
export default meta;

type Story = StoryObj<Card>;

export const Elevated: Story = {};
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Filled: Story = { args: { variant: 'filled' } };
export const Interactive: Story = { args: { interactive: true } };
export const DarkTheme: Story = { globals: { theme: 'dark' } };
