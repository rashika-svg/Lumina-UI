import { Directive, ElementRef, inject } from '@angular/core';
import { Menu } from './menu';

/**
 * Marks a button as the trigger for its enclosing {@link Menu}. Handles the
 * `aria-haspopup` / `aria-expanded` wiring and opens the menu on click or
 * ArrowDown.
 */
@Directive({
  selector: '[luiMenuTrigger]',
  host: {
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'menu.open()',
    '(click)': 'menu.toggle()',
    '(keydown.arrowdown)': 'onArrowDown($event)',
  },
})
export class MenuTrigger {
  protected readonly menu = inject(Menu);

  constructor() {
    this.menu.setTrigger(
      inject<ElementRef<HTMLElement>>(ElementRef).nativeElement,
    );
  }

  protected onArrowDown(event: Event): void {
    event.preventDefault();
    this.menu.openMenu(true);
  }
}
