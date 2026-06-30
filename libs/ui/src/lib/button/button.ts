import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
} from '@angular/core';

export type ButtonVariant =
  'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Lumina Button.
 *
 * An attribute-selector component that decorates a native `<button>` or `<a>`,
 * so it inherits the platform's built-in keyboard, focus and accessibility
 * semantics for free. Fully token-driven and theme-aware.
 *
 * @example
 * ```html
 * <button luiButton variant="primary" size="md">Save</button>
 * <a luiButton variant="link" href="/docs">Docs</a>
 * <button luiButton [loading]="saving()">Submitting…</button>
 * ```
 */
@Component({
  selector: 'button[luiButton], a[luiButton]',
  exportAs: 'luiButton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <span class="lui-button__spinner" aria-hidden="true"></span>
    }
    <span class="lui-button__content"><ng-content /></span>
  `,
  styleUrl: './button.css',
  host: {
    class: 'lui-button',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[class.lui-button--block]': 'fullWidth()',
    '[class.lui-button--icon-only]': 'iconOnly()',
    '[class.lui-button--loading]': 'loading()',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.disabled]': 'nativeDisabledAttr()',
    '[attr.aria-disabled]': 'ariaDisabledAttr()',
    '[attr.tabindex]': 'tabIndexAttr()',
    '(click)': 'onClick($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class Button {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  /** Whether the host element is an anchor — anchors can't use `disabled`. */
  private readonly isAnchor =
    this.host.nativeElement.tagName.toLowerCase() === 'a';

  /** Visual emphasis of the button. */
  readonly variant = input<ButtonVariant>('primary');
  /** Control height / padding scale. */
  readonly size = input<ButtonSize>('md');
  /** Show a spinner and block interaction without removing the element from layout. */
  readonly loading = input(false, { transform: booleanAttribute });
  /** Disable the button. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Stretch to fill the available inline space. */
  readonly fullWidth = input(false, { transform: booleanAttribute });
  /** Render as a square icon-only button (ensure an `aria-label` is provided). */
  readonly iconOnly = input(false, { transform: booleanAttribute });

  /** Effective disabled state (loading also blocks interaction). */
  readonly isDisabled = computed(() => this.disabled() || this.loading());

  protected readonly nativeDisabledAttr = computed(() =>
    !this.isAnchor && this.isDisabled() ? '' : null,
  );
  protected readonly ariaDisabledAttr = computed(() =>
    this.isAnchor && this.isDisabled() ? 'true' : null,
  );
  protected readonly tabIndexAttr = computed(() =>
    this.isAnchor && this.isDisabled() ? -1 : null,
  );

  protected onClick(event: Event): void {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  protected onKeydown(event: Event): void {
    // Host listener `$event` is typed as the base Event; narrow to keyboard.
    const key = (event as KeyboardEvent).key;
    // Anchors styled as buttons should also activate on Space, matching <button>.
    if (this.isAnchor && key === ' ' && !this.isDisabled()) {
      event.preventDefault();
      this.host.nativeElement.click();
    }
  }
}
