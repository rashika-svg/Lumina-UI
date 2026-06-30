import { Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Kanban, type KanbanColumn } from './kanban';

@Component({
  selector: 'lui-kanban-demo',
  imports: [Kanban],
  template: `
    <p
      style="margin:0 0 .75rem;color:var(--lui-color-fg-muted);font-size:.875rem"
    >
      Drag cards between columns, or focus a card and press Ctrl/⌘ + ← / →.
    </p>
    <lui-kanban [(columns)]="board" />
  `,
})
class KanbanDemo {
  readonly board = signal<KanbanColumn[]>([
    {
      id: 'backlog',
      title: 'Backlog',
      cards: [
        {
          id: '1',
          title: 'Define design tokens',
          description: 'Primitive → semantic → component',
        },
        { id: '2', title: 'Audit colour contrast' },
      ],
    },
    {
      id: 'progress',
      title: 'In progress',
      cards: [
        { id: '3', title: 'Build Data Table', description: 'Sort + selection' },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      cards: [
        { id: '4', title: 'Theme engine' },
        { id: '5', title: 'Button component' },
      ],
    },
  ]);
}

const meta: Meta<Kanban> = {
  title: 'Components/Kanban',
  component: Kanban,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [KanbanDemo] })],
  render: () => ({ template: `<lui-kanban-demo />` }),
};
export default meta;

type Story = StoryObj<Kanban>;

export const Playground: Story = {};
export const DarkTheme: Story = { globals: { theme: 'dark' } };
