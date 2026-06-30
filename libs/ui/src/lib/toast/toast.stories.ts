import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Button } from '../button/button';
import { ToastOutlet } from './toast-outlet';
import { ToastService } from './toast.service';

@Component({
  selector: 'lui-toast-demo',
  imports: [Button, ToastOutlet],
  template: `
    <div style="display:flex; gap:.5rem; flex-wrap:wrap">
      <button
        luiButton
        variant="secondary"
        (click)="t.info('A new build is available.', 'Heads up')"
      >
        Info
      </button>
      <button
        luiButton
        variant="secondary"
        (click)="t.success('Your changes are live.', 'Saved')"
      >
        Success
      </button>
      <button
        luiButton
        variant="secondary"
        (click)="t.warning('Storage is almost full.', 'Careful')"
      >
        Warning
      </button>
      <button
        luiButton
        variant="secondary"
        (click)="t.error('Could not save changes.', 'Error')"
      >
        Error
      </button>
    </div>
    <lui-toast-outlet position="bottom-end" />
  `,
})
class ToastDemo {
  readonly t = inject(ToastService);
}

const meta: Meta = {
  title: 'Components/Toast',
  decorators: [moduleMetadata({ imports: [ToastDemo] })],
  render: () => ({ template: `<lui-toast-demo />` }),
};
export default meta;

type Story = StoryObj;

export const Playground: Story = {};
export const DarkTheme: Story = { globals: { theme: 'dark' } };
