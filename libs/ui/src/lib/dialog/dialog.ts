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

export type DialogSize = 'sm' | 'md' | 'lg';

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

let nextId = 0;

/**
 * Lumina Dialog — an accessible modal built on the WAI-ARIA dialog pattern.
 *
 * Handles the hard parts: a focus trap, `Escape` to dismiss, scroll-locking the
 * page, restoring focus to the trigger on close, and `role="dialog"` /
 * `aria-modal` wiring. No CDK or portal required — the overlay is fixed-position.
 *
 * @example
 * ```html
 * <lui-dialog [(open)]="confirmOpen" heading="Delete item?">
 *   <p>This action cannot be undone.</p>
 *   <div dialogFooter>
 *     <button luiButton variant="ghost" (click)="confirmOpen.set(false)">Cancel</button>
 *     <button luiButton variant="danger" (click)="remove()">Delete</button>
 *   </div>
 * </lui-dialog>
 * ```
 */
@Component({
  selector: 'lui-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="lui-dialog__backdrop" (click)="onBackdrop()"></div>
      <div class="lui-dialog__viewport" (keydown)="onKeydown($event)">
        <div
          #panel
          class="lui-dialog__panel"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          [attr.data-size]="size()"
          [attr.aria-labelledby]="heading() ? titleId : null"
          [attr.aria-label]="!heading() ? ariaLabel() || null : null"
          [attr.aria-describedby]="description() ? descId : null"
        >
          @if (heading() || dismissible()) {
            <header class="lui-dialog__header">
              @if (heading()) {
                <h2 class="lui-dialog__title" [id]="titleId">
                  {{ heading() }}
                </h2>
              }
              @if (dismissible()) {
                <button
                  type="button"
                  class="lui-dialog__close"
                  aria-label="Close dialog"
                  (click)="close()"
                >
                  &times;
                </button>
              }
            </header>
          }
          @if (description()) {
            <p class="lui-dialog__desc" [id]="descId">{{ description() }}</p>
          }
          <div class="lui-dialog__body"><ng-content /></div>
          <footer class="lui-dialog__footer">
            <ng-content select="[dialogFooter]" />
          </footer>
        </div>
      </div>
    }
  `,
  styleUrl: './dialog.css',
  host: { class: 'lui-dialog' },
})
export class Dialog {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly id = `lui-dialog-${nextId++}`;
  protected readonly titleId = `${this.id}-title`;
  protected readonly descId = `${this.id}-desc`;

  readonly open = model(false);
  readonly heading = input('');
  readonly description = input('');
  readonly ariaLabel = input('');
  readonly size = input<DialogSize>('md');
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

  /** Programmatically close the dialog. */
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
    if (event.key !== 'Tab') return;

    const focusables = this.focusableElements();
    if (focusables.length === 0) {
      event.preventDefault();
      this.panel()?.nativeElement.focus();
      return;
    }
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    const active = this.document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private activate(): void {
    if (!this.isBrowser) return;
    this.triggerEl = this.document.activeElement as HTMLElement | null;
    this.previousOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
    // Defer until the panel has rendered, then move focus inside.
    setTimeout(() => {
      const focusables = this.focusableElements();
      (focusables[0] ?? this.panel()?.nativeElement)?.focus();
    });
  }

  private deactivate(): void {
    if (!this.isBrowser) return;
    this.document.body.style.overflow = this.previousOverflow;
    this.triggerEl?.focus?.();
    this.triggerEl = null;
  }

  private focusableElements(): HTMLElement[] {
    const root = this.panel()?.nativeElement;
    if (!root) return [];
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === this.document.activeElement,
    );
  }
}
