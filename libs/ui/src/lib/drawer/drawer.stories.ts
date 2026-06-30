import { Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Button } from '../button/button';
import { Drawer, type DrawerSide } from './drawer';

@Component({
  selector: 'lui-drawer-demo',
  imports: [Drawer, Button],
  template: `
    <button luiButton (click)="open.set(true)">Open drawer</button>
    <lui-drawer [(open)]="open" [side]="side" heading="Settings">
      <p>Drawer content slides in from the “{{ side }}” edge.</p>
      <p>
        Press Escape, click the backdrop, or use the close button to dismiss.
      </p>
    </lui-drawer>
  `,
})
class DrawerDemo {
  readonly open = signal(false);
  side: DrawerSide = 'end';
}

const meta: Meta<Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [DrawerDemo] })],
  argTypes: {
    side: {
      control: 'inline-radio',
      options: ['start', 'end', 'top', 'bottom'],
    },
  },
  args: { side: 'end' },
  render: (args) => ({
    props: args,
    template: `<lui-drawer-demo [side]="side" />`,
  }),
};
export default meta;

type Story = StoryObj<Drawer>;

export const Playground: Story = {};
export const FromStart: Story = { args: { side: 'start' } };
export const DarkTheme: Story = { globals: { theme: 'dark' } };
