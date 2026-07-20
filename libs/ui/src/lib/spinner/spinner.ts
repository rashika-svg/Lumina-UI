import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerTone = 'accent' | 'neutral' | 'current';

/**
 * Lumina Spinner — an accessible, indeterminate loading indicator.
 *
 * The host is a live region (`role="status"`), so the `label` is announced to
 * assistive technology while the visual arc rotates. Use `tone="current"` to
 * inherit the surrounding text colour (for example inside a button).
 *
 * @example
 * ```html
 * <lui-spinner />
 * <lui-spinner size="sm" tone="current" label="Saving changes" />
 * ```
 */
@Component({
  selector: 'lui-spinner',
  exportAs: 'luiSpinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="lui-spinner__svg" viewBox="0 0 24 24" aria-hidden="true">
      <circle class="lui-spinner__track" cx="12" cy="12" r="9" fill="none" />
      <circle class="lui-spinner__arc" cx="12" cy="12" r="9" fill="none" />
    </svg>
    <span class="lui-spinner__label">{{ label() }}</span>
  `,
  styleUrl: './spinner.css',
  host: {
    class: 'lui-spinner',
    role: 'status',
    'aria-live': 'polite',
    '[attr.data-size]': 'size()',
    '[attr.data-tone]': 'tone()',
  },
})
export class Spinner {
  readonly size = input<SpinnerSize>('md');
  readonly tone = input<SpinnerTone>('accent');

  /** Accessible label announced while loading. */
  readonly label = input('Loading');
}
