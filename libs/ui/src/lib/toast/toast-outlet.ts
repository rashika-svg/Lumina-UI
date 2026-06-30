import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ToastService, type ToastVariant } from './toast.service';

export type ToastPosition =
  'top-end' | 'top-center' | 'bottom-end' | 'bottom-center';

/**
 * Renders the {@link ToastService} queue inside an ARIA live region.
 * Place once near your application root: `<lui-toast-outlet />`.
 */
@Component({
  selector: 'lui-toast-outlet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="lui-toast__region"
      role="region"
      aria-label="Notifications"
      [attr.data-position]="position()"
    >
      @for (toast of toasts(); track toast.id) {
        <div
          class="lui-toast"
          [attr.data-variant]="toast.variant"
          [attr.role]="roleFor(toast.variant)"
          [attr.aria-live]="toast.variant === 'danger' ? 'assertive' : 'polite'"
        >
          <div class="lui-toast__content">
            @if (toast.title) {
              <p class="lui-toast__title">{{ toast.title }}</p>
            }
            <p class="lui-toast__message">{{ toast.message }}</p>
          </div>
          <button
            type="button"
            class="lui-toast__close"
            aria-label="Dismiss notification"
            (click)="dismiss(toast.id)"
          >
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './toast-outlet.css',
})
export class ToastOutlet {
  private readonly service = inject(ToastService);

  readonly position = input<ToastPosition>('bottom-end');
  protected readonly toasts = this.service.toasts;

  protected roleFor(variant: ToastVariant): 'alert' | 'status' {
    return variant === 'danger' ? 'alert' : 'status';
  }

  protected dismiss(id: number): void {
    this.service.dismiss(id);
  }
}
