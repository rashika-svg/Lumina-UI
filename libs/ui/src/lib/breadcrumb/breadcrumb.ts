import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface BreadcrumbItem {
  readonly label: string;
  /** Optional link target. The last item is rendered as the current page. */
  readonly href?: string;
}

/**
 * Lumina Breadcrumb — an accessible navigation trail. The final item is marked
 * with `aria-current="page"` and rendered as plain text.
 *
 * @example
 * ```html
 * <lui-breadcrumb [items]="[{ label: 'Home', href: '/' }, { label: 'Settings' }]" />
 * ```
 */
@Component({
  selector: 'lui-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [attr.aria-label]="ariaLabel()">
      <ol class="lui-breadcrumb__list">
        @for (item of items(); track $index; let last = $last) {
          <li class="lui-breadcrumb__item">
            @if (!last && item.href) {
              <a class="lui-breadcrumb__link" [href]="item.href">{{
                item.label
              }}</a>
            } @else if (!last) {
              <span class="lui-breadcrumb__link">{{ item.label }}</span>
            } @else {
              <span class="lui-breadcrumb__current" aria-current="page">{{
                item.label
              }}</span>
            }
            @if (!last) {
              <span class="lui-breadcrumb__sep" aria-hidden="true">/</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styleUrl: './breadcrumb.css',
  host: { class: 'lui-breadcrumb' },
})
export class Breadcrumb {
  readonly items = input.required<readonly BreadcrumbItem[]>();
  readonly ariaLabel = input('Breadcrumb');
}
