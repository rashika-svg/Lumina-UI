import { Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Button } from '../button/button';
import { CommandPalette, type Command } from './command-palette';

@Component({
  selector: 'lui-cmdk-demo',
  imports: [CommandPalette, Button],
  template: `
    <button luiButton (click)="open.set(true)">Open command palette</button>
    <p
      style="margin-top:.75rem;color:var(--lui-color-fg-muted);font-size:.875rem"
    >
      Last run: {{ last() || '—' }}
    </p>
    <lui-command-palette
      [(open)]="open"
      [commands]="commands"
      (run)="last.set($event.label)"
    />
  `,
})
class CmdkDemo {
  readonly open = signal(false);
  readonly last = signal('');
  readonly commands: Command[] = [
    { id: 'new', label: 'New file', hint: '⌘N', keywords: ['create', 'add'] },
    { id: 'open', label: 'Open file', hint: '⌘O' },
    { id: 'save', label: 'Save', hint: '⌘S' },
    { id: 'theme', label: 'Toggle theme', group: 'Appearance' },
    {
      id: 'settings',
      label: 'Open settings',
      group: 'App',
      keywords: ['preferences'],
    },
    { id: 'logout', label: 'Sign out', group: 'Account' },
  ];
}

const meta: Meta<CommandPalette> = {
  title: 'Components/Command Palette',
  component: CommandPalette,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CmdkDemo] })],
  render: () => ({ template: `<lui-cmdk-demo />` }),
};
export default meta;

type Story = StoryObj<CommandPalette>;

export const Playground: Story = {};
export const DarkTheme: Story = { globals: { theme: 'dark' } };
