import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant =
  'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';
export type BadgeAppearance = 'solid' | 'subtle' | 'outline';

/**
 * Lumina Badge — a compact status / count indicator.
 *
 * @example
 * ```html
 * <span luiBadge variant="success" appearance="subtle">Active</span>
 * ```
 */
@Component({
  selector: 'span[luiBadge], div[luiBadge]',
  exportAs: 'luiBadge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './badge.css',
  host: {
    class: 'lui-badge',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-appearance]': 'appearance()',
  },
})
export class Badge {
  readonly variant = input<BadgeVariant>('neutral');
  readonly size = input<BadgeSize>('md');
  readonly appearance = input<BadgeAppearance>('subtle');
}
