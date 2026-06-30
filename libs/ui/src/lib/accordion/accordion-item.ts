import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { Accordion } from './accordion';

let nextId = 0;

/** A single collapsible panel within an {@link Accordion}. */
@Component({
  selector: 'lui-accordion-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3 class="lui-accordion__heading">
      <button
        type="button"
        class="lui-accordion__trigger"
        [id]="id + '-trigger'"
        [attr.aria-expanded]="expanded()"
        [attr.aria-controls]="id + '-panel'"
        [disabled]="disabled()"
        (click)="toggle()"
      >
        <span class="lui-accordion__title">{{ heading() }}</span>
        <span class="lui-accordion__icon" aria-hidden="true"></span>
      </button>
    </h3>
    <div
      class="lui-accordion__panel"
      role="region"
      [id]="id + '-panel'"
      [attr.aria-labelledby]="id + '-trigger'"
      [hidden]="!expanded()"
    >
      <div class="lui-accordion__content"><ng-content /></div>
    </div>
  `,
  styleUrl: './accordion.css',
  host: {
    class: 'lui-accordion__item',
    '[class.lui-accordion__item--open]': 'expanded()',
  },
})
export class AccordionItem {
  protected readonly id = `lui-accordion-${nextId++}`;
  private readonly accordion = inject(Accordion, { optional: true });

  readonly heading = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly expanded = model(false);

  toggle(): void {
    if (this.disabled()) return;
    const next = !this.expanded();
    this.expanded.set(next);
    if (next) this.accordion?.notifyOpen(this);
  }

  /** Used by the parent accordion to collapse this item in single-open mode. */
  setExpanded(value: boolean): void {
    this.expanded.set(value);
  }
}
