import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Kanban, type KanbanColumn } from './kanban';

@Component({
  imports: [Kanban],
  template: `<lui-kanban
    [(columns)]="board"
    (cardMoved)="moved.set($event.toColumnId)"
  />`,
})
class Host {
  readonly moved = signal('');
  readonly board = signal<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'To do',
      cards: [
        { id: 'c1', title: 'Task 1' },
        { id: 'c2', title: 'Task 2' },
      ],
    },
    { id: 'doing', title: 'In progress', cards: [] },
  ]);
}

describe('Kanban', () => {
  let fixture: ComponentFixture<Host>;
  const columns = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('.lui-kanban__column'),
    ) as HTMLElement[];
  const cardsIn = (colIndex: number) =>
    Array.from(columns()[colIndex].querySelectorAll('.lui-kanban__card')).map(
      (c) => c.textContent?.trim(),
    );

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('renders columns with their cards and counts', () => {
    expect(columns().length).toBe(2);
    expect(cardsIn(0)).toEqual(['Task 1', 'Task 2']);
    expect(columns()[0].querySelector('.lui-kanban__count')?.textContent).toBe(
      '2',
    );
    expect(columns()[1].querySelector('.lui-kanban__empty')).toBeTruthy();
  });

  it('moves a focused card to the next column with Ctrl+ArrowRight', () => {
    const firstCard = columns()[0].querySelector(
      '.lui-kanban__card',
    ) as HTMLElement;
    firstCard.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        ctrlKey: true,
        bubbles: true,
      }),
    );
    fixture.detectChanges();

    expect(cardsIn(0)).toEqual(['Task 2']);
    expect(cardsIn(1)).toEqual(['Task 1']);
    expect(fixture.componentInstance.moved()).toBe('doing');
  });

  it('does not move past the last column', () => {
    const card = columns()[0].querySelector('.lui-kanban__card') as HTMLElement;
    // Move once to the last column, then try again (should stay).
    card.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', ctrlKey: true }),
    );
    fixture.detectChanges();
    const movedCard = columns()[1].querySelector(
      '.lui-kanban__card',
    ) as HTMLElement;
    movedCard.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', ctrlKey: true }),
    );
    fixture.detectChanges();
    expect(cardsIn(1)).toEqual(['Task 1']);
  });
});
