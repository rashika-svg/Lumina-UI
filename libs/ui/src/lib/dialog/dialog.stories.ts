import { Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Button } from '../button/button';
import { Dialog } from './dialog';

@Component({
  selector: 'lui-dialog-demo',
  imports: [Dialog, Button],
  template: `
    <button luiButton (click)="open.set(true)">Open dialog</button>
    <lui-dialog
      [(open)]="open"
      [size]="size"
      heading="Delete project?"
      description="This permanently removes the project and all of its data."
    >
      <p>You can't undo this action. Please confirm you wish to continue.</p>
      <div dialogFooter>
        <button luiButton variant="ghost" (click)="open.set(false)">
          Cancel
        </button>
        <button luiButton variant="danger" (click)="open.set(false)">
          Delete
        </button>
      </div>
    </lui-dialog>
  `,
})
class DialogDemo {
  readonly open = signal(false);
  size: 'sm' | 'md' | 'lg' = 'md';
}

const meta: Meta<Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [DialogDemo] })],
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  args: { size: 'md' },
  render: (args) => ({
    props: args,
    template: `<lui-dialog-demo [size]="size" />`,
  }),
};
export default meta;

type Story = StoryObj<Dialog>;

export const Playground: Story = {};
export const DarkTheme: Story = { globals: { theme: 'dark' } };
