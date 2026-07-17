import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

/**
 * Lumina Card — a surface container with `elevated`, `outlined` and `filled`
 * variants and optional media / header / body / footer regions.
 *
 * Set `interactive` to make the whole card a keyboard-activatable target that
 * lifts on hover and emits `cardClick`. Interactive cards should not contain
 * their own focusable controls (use a static card with inner buttons instead).
 *
 * @example
 * ```html
 * <lui-card variant="elevated" interactive (cardClick)="open()">
 *   <img cardMedia src="cover.jpg" alt="" />
 *   <h3 cardHeader>Title</h3>
 *   <p>Body content.</p>
 *   <div cardFooter><button luiButton size="sm">Action</button></div>
 * </lui-card>
 * ```
 */
@Component({
  selector: 'lui-card',
  exportAs: 'luiCard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="[cardMedia]" />
    <div class="lui-card__content">
      <ng-content select="[cardHeader]" />
      <div class="lui-card__text"><ng-content /></div>
      <ng-content select="[cardFooter]" />
    </div>
  `,
  styleUrl: './card.css',
  host: {
    class: 'lui-card',
    '[attr.data-variant]': 'variant()',
    '[class.lui-card--interactive]': 'interactive()',
    '[attr.role]': 'interactive() ? "button" : null',
    '[attr.tabindex]': 'interactive() ? 0 : null',
    '(click)': 'onActivate($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class Card {
  readonly variant = input<CardVariant>('elevated');
  readonly interactive = input(false, { transform: booleanAttribute });

  /** Emitted when an interactive card is activated (click / Enter / Space). */
  readonly cardClick = output<Event>();

  protected onActivate(event: Event): void {
    if (this.interactive()) this.cardClick.emit(event);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.interactive() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.cardClick.emit(event);
    }
  }
}
