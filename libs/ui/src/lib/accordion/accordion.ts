import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
} from '@angular/core';
import { AccordionItem } from './accordion-item';

/**
 * Lumina Accordion — a vertically stacked set of disclosure panels.
 *
 * By default only one panel is open at a time; set `multiple` to allow several.
 *
 * @example
 * ```html
 * <lui-accordion>
 *   <lui-accordion-item heading="Shipping">…</lui-accordion-item>
 *   <lui-accordion-item heading="Returns">…</lui-accordion-item>
 * </lui-accordion>
 * ```
 */
@Component({
  selector: 'lui-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content select="lui-accordion-item" />`,
  styleUrl: './accordion.css',
  host: { class: 'lui-accordion' },
})
export class Accordion {
  /** Allow more than one panel to be open simultaneously. */
  readonly multiple = input(false);

  private readonly items = contentChildren(AccordionItem);

  /** Called by a child when it opens; collapses siblings in single mode. */
  notifyOpen(opened: AccordionItem): void {
    if (this.multiple()) return;
    for (const item of this.items()) {
      if (item !== opened) item.setExpanded(false);
    }
  }
}
