import { isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  PLATFORM_ID,
  untracked,
  viewChild,
} from '@angular/core';
import { focusFirst, trapTabKey } from '../_internal/focus-trap';

export type DrawerSide = 'start' | 'end' | 'top' | 'bottom';

let nextId = 0;

/**
 * Lumina Drawer — an accessible panel that slides in from a viewport edge.
 *
 * Shares the Dialog's overlay machinery: focus trap, `Escape` to dismiss,
 * scroll-locking and focus restoration, with `role="dialog"` + `aria-modal`.
 *
 * @example
 * ```html
 * <lui-drawer [(open)]="navOpen" side="start" heading="Menu">…</lui-drawer>
 * ```
 */
@Component({
  selector: 'lui-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="lui-drawer__backdrop" (click)="onBackdrop()"></div>
      <div
        class="lui-drawer__viewport"
        [attr.data-side]="side()"
        (keydown)="onKeydown($event)"
      >
        <div
          #panel
          class="lui-drawer__panel"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          [attr.data-side]="side()"
          [attr.aria-labelledby]="heading() ? titleId : null"
          [attr.aria-label]="!heading() ? ariaLabel() || null : null"
        >
          @if (heading() || dismissible()) {
            <header class="lui-drawer__header">
              @if (heading()) {
                <h2 class="lui-drawer__title" [id]="titleId">
                  {{ heading() }}
                </h2>
              }
              @if (dismissible()) {
                <button
                  type="button"
                  class="lui-drawer__close"
                  aria-label="Close drawer"
                  (click)="close()"
                >
                  &times;
                </button>
              }
            </header>
          }
          <div class="lui-drawer__body"><ng-content /></div>
        </div>
      </div>
    }
  `,
  styleUrl: './drawer.css',
  host: { class: 'lui-drawer' },
})
export class Drawer {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly uid = `lui-drawer-${nextId++}`;
  protected readonly titleId = `${this.uid}-title`;

  readonly open = model(false);
  readonly side = input<DrawerSide>('end');
  readonly heading = input('');
  readonly ariaLabel = input('');
  readonly dismissible = input(true, { transform: booleanAttribute });
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });

  readonly closed = output<void>();

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private triggerEl: HTMLElement | null = null;
  private previousOverflow = '';

  constructor() {
    effect(() => {
      const isOpen = this.open();
      untracked(() => (isOpen ? this.activate() : this.deactivate()));
    });
  }

  close(): void {
    if (this.open()) {
      this.open.set(false);
      this.closed.emit();
    }
  }

  protected onBackdrop(): void {
    if (this.closeOnBackdrop()) this.close();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.closeOnEscape()) {
      event.preventDefault();
      this.close();
      return;
    }
    const root = this.panel()?.nativeElement;
    if (root) trapTabKey(event, root, this.document);
  }

  private activate(): void {
    if (!this.isBrowser) return;
    this.triggerEl = this.document.activeElement as HTMLElement | null;
    this.previousOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const root = this.panel()?.nativeElement;
      if (root) focusFirst(root, this.document);
    });
  }

  private deactivate(): void {
    if (!this.isBrowser) return;
    this.document.body.style.overflow = this.previousOverflow;
    this.triggerEl?.focus?.();
    this.triggerEl = null;
  }
}
