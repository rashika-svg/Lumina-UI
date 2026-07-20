import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';
export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none';

/**
 * Lumina Skeleton — a token-driven placeholder that mirrors the shape of
 * content while it loads, reducing layout shift and perceived latency.
 *
 * Skeletons are purely decorative (`aria-hidden`); pair them with a visible or
 * screen-reader status message (for example a {@link Spinner}) so assistive
 * technology is told that content is loading.
 *
 * @example
 * ```html
 * <lui-skeleton variant="circular" width="2.5rem" height="2.5rem" />
 * <lui-skeleton [lines]="3" />
 * <lui-skeleton variant="rectangular" height="8rem" />
 * ```
 */
@Component({
  selector: 'lui-skeleton',
  exportAs: 'luiSkeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (variant() === 'text') {
      @for (line of lineArray(); track $index; let last = $last) {
        <span
          class="lui-skeleton__line"
          [class.lui-skeleton__line--last]="last && lineCount() > 1"
        ></span>
      }
    } @else {
      <span class="lui-skeleton__block"></span>
    }
  `,
  styleUrl: './skeleton.css',
  host: {
    class: 'lui-skeleton',
    'aria-hidden': 'true',
    '[attr.data-variant]': 'variant()',
    '[attr.data-animation]': 'animation()',
    '[style.--_w]': 'width()',
    '[style.--_h]': 'height()',
    '[style.--_radius]': 'radius()',
  },
})
export class Skeleton {
  readonly variant = input<SkeletonVariant>('text');

  /** CSS width, e.g. `100%`, `3rem`. Defaults per variant. */
  readonly width = input<string>();
  /** CSS height, e.g. `1rem`, `8rem`. Defaults per variant. */
  readonly height = input<string>();
  /** Override the corner radius. */
  readonly radius = input<string>();

  /** Number of lines to render for the `text` variant. */
  readonly lines = input(1, { transform: numberAttribute });

  readonly animation = input<SkeletonAnimation>('shimmer');

  protected readonly lineCount = computed(() => Math.max(1, this.lines()));
  protected readonly lineArray = computed(() =>
    Array.from({ length: this.lineCount() }),
  );
}
