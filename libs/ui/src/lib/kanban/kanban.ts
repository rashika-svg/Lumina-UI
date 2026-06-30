import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  model,
  output,
  signal,
} from '@angular/core';

export interface KanbanCard {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
}

export interface KanbanColumn {
  readonly id: string;
  readonly title: string;
  readonly cards: readonly KanbanCard[];
}

export interface CardMovedEvent {
  readonly cardId: string;
  readonly fromColumnId: string;
  readonly toColumnId: string;
  readonly toIndex: number;
}

interface DragState {
  readonly cardId: string;
  readonly fromColumnId: string;
}

/**
 * Lumina Kanban Board — drag-and-drop columns of cards using native HTML5 DnD,
 * with a keyboard fallback (Ctrl/Cmd + Arrow Left/Right) to move the focused
 * card between columns. The `columns` model updates in place on every move.
 *
 * @example
 * ```html
 * <lui-kanban [(columns)]="board" (cardMoved)="persist($event)" />
 * ```
 */
@Component({
  selector: 'lui-kanban',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lui-kanban__board">
      @for (col of columns(); track col.id) {
        <section
          class="lui-kanban__column"
          [attr.aria-label]="col.title"
          (dragover)="onDragOver($event)"
          (drop)="onDropColumn($event, col)"
        >
          <header class="lui-kanban__col-header">
            <span>{{ col.title }}</span>
            <span class="lui-kanban__count">{{ col.cards.length }}</span>
          </header>
          <ul class="lui-kanban__cards" role="list">
            @for (card of col.cards; track card.id) {
              <li
                class="lui-kanban__card"
                draggable="true"
                tabindex="0"
                [attr.data-id]="card.id"
                [attr.aria-roledescription]="'Draggable card'"
                (dragstart)="onDragStart(card, col)"
                (dragend)="onDragEnd()"
                (dragover)="onDragOver($event)"
                (drop)="onDropOnCard($event, col, $index)"
                (keydown)="onCardKeydown($event, card, col)"
              >
                <p class="lui-kanban__card-title">{{ card.title }}</p>
                @if (card.description) {
                  <p class="lui-kanban__card-desc">{{ card.description }}</p>
                }
              </li>
            } @empty {
              <li class="lui-kanban__empty">Drop cards here</li>
            }
          </ul>
        </section>
      }
    </div>
  `,
  styleUrl: './kanban.css',
  host: { class: 'lui-kanban' },
})
export class Kanban {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly columns = model<KanbanColumn[]>([]);
  readonly cardMoved = output<CardMovedEvent>();

  private readonly drag = signal<DragState | null>(null);

  protected onDragStart(card: KanbanCard, col: KanbanColumn): void {
    this.drag.set({ cardId: card.id, fromColumnId: col.id });
  }

  protected onDragEnd(): void {
    this.drag.set(null);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  protected onDropColumn(event: DragEvent, col: KanbanColumn): void {
    event.preventDefault();
    const state = this.drag();
    if (state) this.move(state, col.id, col.cards.length);
  }

  protected onDropOnCard(
    event: DragEvent,
    col: KanbanColumn,
    index: number,
  ): void {
    event.preventDefault();
    event.stopPropagation();
    const state = this.drag();
    if (state) this.move(state, col.id, index);
  }

  protected onCardKeydown(
    event: KeyboardEvent,
    card: KanbanCard,
    col: KanbanColumn,
  ): void {
    if (!(event.ctrlKey || event.metaKey)) return;
    const cols = this.columns();
    const colIndex = cols.findIndex((c) => c.id === col.id);
    let target = -1;
    if (event.key === 'ArrowRight') target = colIndex + 1;
    else if (event.key === 'ArrowLeft') target = colIndex - 1;
    else return;

    event.preventDefault();
    if (target < 0 || target >= cols.length) return;
    const toCol = cols[target]!;
    this.move(
      { cardId: card.id, fromColumnId: col.id },
      toCol.id,
      toCol.cards.length,
    );
    queueMicrotask(() =>
      this.host.nativeElement
        .querySelector<HTMLElement>(`[data-id="${card.id}"]`)
        ?.focus(),
    );
  }

  private move(state: DragState, toColumnId: string, toIndex: number): void {
    const cols = this.columns().map((c) => ({ ...c, cards: [...c.cards] }));
    const from = cols.find((c) => c.id === state.fromColumnId);
    const to = cols.find((c) => c.id === toColumnId);
    if (!from || !to) return;

    const fromIndex = from.cards.findIndex((c) => c.id === state.cardId);
    if (fromIndex === -1) return;
    const [card] = from.cards.splice(fromIndex, 1);

    // Adjust target index when moving within the same column past the origin.
    let index = toIndex;
    if (from === to && fromIndex < toIndex) index--;
    index = Math.max(0, Math.min(index, to.cards.length));
    to.cards.splice(index, 0, card!);

    this.columns.set(cols);
    this.drag.set(null);
    this.cardMoved.emit({
      cardId: state.cardId,
      fromColumnId: state.fromColumnId,
      toColumnId,
      toIndex: index,
    });
  }
}
