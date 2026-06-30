import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  model,
} from '@angular/core';
import { MenuItem } from './menu-item';

export type MenuAlign = 'start' | 'end';

/**
 * Lumina Menu (dropdown) — an accessible menu built on the WAI-ARIA menu
 * pattern. Pair it with a trigger marked `luiMenuTrigger` and one or more
 * `lui-menu-item`s. Supports full keyboard navigation, outside-click dismissal
 * and focus restoration.
 *
 * @example
 * ```html
 * <lui-menu>
 *   <button luiButton luiMenuTrigger>Options</button>
 *   <lui-menu-item (selected)="edit()">Edit</lui-menu-item>
 *   <lui-menu-item (selected)="copy()">Duplicate</lui-menu-item>
 *   <lui-menu-item [disabled]="true">Archive</lui-menu-item>
 * </lui-menu>
 * ```
 */
@Component({
  selector: 'lui-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="[luiMenuTrigger]" />
    @if (open()) {
      <div
        class="lui-menu__panel"
        role="menu"
        [attr.data-align]="align()"
        (keydown)="onKeydown($event)"
      >
        <ng-content />
      </div>
    }
  `,
  styleUrl: './menu.css',
  host: { class: 'lui-menu' },
})
export class Menu {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);

  readonly open = model(false);
  readonly align = input<MenuAlign>('start');

  readonly items = contentChildren(MenuItem);

  private triggerEl: HTMLElement | null = null;

  constructor() {
    const onPointerDown = (event: Event) => {
      if (
        this.open() &&
        !this.host.nativeElement.contains(event.target as Node)
      ) {
        this.close(false);
      }
    };
    this.document.addEventListener('mousedown', onPointerDown, true);
    inject(DestroyRef).onDestroy(() =>
      this.document.removeEventListener('mousedown', onPointerDown, true),
    );
  }

  /** Registered by the {@link MenuTrigger} directive. */
  setTrigger(el: HTMLElement): void {
    this.triggerEl = el;
  }

  toggle(): void {
    if (this.open()) this.close();
    else this.openMenu();
  }

  openMenu(focusFirstItem = false): void {
    this.open.set(true);
    setTimeout(() => this.focusItem(focusFirstItem ? 0 : 0));
  }

  close(restoreFocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    if (restoreFocus) this.triggerEl?.focus();
  }

  protected onKeydown(event: KeyboardEvent): void {
    const items = this.enabledItems();
    if (items.length === 0) return;
    const currentIndex = items.findIndex((i) => i.isFocused());

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        items[(currentIndex + 1 + items.length) % items.length]!.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length]!.focus();
        break;
      case 'Home':
        event.preventDefault();
        items[0]!.focus();
        break;
      case 'End':
        event.preventDefault();
        items[items.length - 1]!.focus();
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'Tab':
        this.close(false);
        break;
    }
  }

  private enabledItems(): MenuItem[] {
    return this.items().filter((i) => !i.disabled());
  }

  private focusItem(index: number): void {
    this.enabledItems()[index]?.focus();
  }
}
