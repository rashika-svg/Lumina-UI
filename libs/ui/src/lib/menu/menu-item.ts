import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { Menu } from './menu';

/** A single actionable item within a {@link Menu}. */
@Component({
  selector: 'lui-menu-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './menu-item.css',
  host: {
    class: 'lui-menu-item',
    role: 'menuitem',
    tabindex: '-1',
    '[attr.aria-disabled]': 'disabled() || null',
    '[class.lui-menu-item--disabled]': 'disabled()',
    '(click)': 'activate($event)',
    '(keydown.enter)': 'activate($event)',
    '(keydown.space)': 'activate($event)',
  },
})
export class MenuItem {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly menu = inject(Menu);

  readonly disabled = input(false, { transform: booleanAttribute });
  /** Emitted when the item is activated (click / Enter / Space). */
  readonly selected = output<void>();

  focus(): void {
    this.el.nativeElement.focus();
  }

  isFocused(): boolean {
    return this.document.activeElement === this.el.nativeElement;
  }

  protected activate(event: Event): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.selected.emit();
    this.menu.close();
  }
}
