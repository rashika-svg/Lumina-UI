import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';

type PageItem = number | 'ellipsis';

/**
 * Lumina Pagination — accessible page navigation with truncation (ellipsis)
 * for large page counts. Pages are 1-based.
 *
 * @example
 * ```html
 * <lui-pagination [total]="20" [(page)]="page" (pageChange)="load($event)" />
 * ```
 */
@Component({
  selector: 'lui-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [attr.aria-label]="ariaLabel()">
      <ul class="lui-pagination__list">
        <li>
          <button
            type="button"
            class="lui-pagination__btn"
            [disabled]="page() <= 1"
            aria-label="Previous page"
            (click)="go(page() - 1)"
          >
            &lsaquo;
          </button>
        </li>
        @for (item of pages(); track $index) {
          <li>
            @if (item === 'ellipsis') {
              <span class="lui-pagination__ellipsis" aria-hidden="true">…</span>
            } @else {
              <button
                type="button"
                class="lui-pagination__btn"
                [class.lui-pagination__btn--active]="item === page()"
                [attr.aria-current]="item === page() ? 'page' : null"
                [attr.aria-label]="'Page ' + item"
                (click)="go(item)"
              >
                {{ item }}
              </button>
            }
          </li>
        }
        <li>
          <button
            type="button"
            class="lui-pagination__btn"
            [disabled]="page() >= total()"
            aria-label="Next page"
            (click)="go(page() + 1)"
          >
            &rsaquo;
          </button>
        </li>
      </ul>
    </nav>
  `,
  styleUrl: './pagination.css',
  host: { class: 'lui-pagination' },
})
export class Pagination {
  /** Total number of pages. */
  readonly total = input.required<number>();
  /** Current page (1-based), two-way bindable. */
  readonly page = model(1);
  /** Pages to show either side of the current page. */
  readonly siblingCount = input(1);
  readonly ariaLabel = input('Pagination');

  readonly pageChange = output<number>();

  protected readonly pages = computed<PageItem[]>(() => {
    const total = this.total();
    const current = this.page();
    const siblings = this.siblingCount();
    // Show first, last, current ± siblings, plus ellipses.
    const totalShown = siblings * 2 + 5; // first, last, current, 2 ellipses
    if (total <= totalShown) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const left = Math.max(current - siblings, 1);
    const right = Math.min(current + siblings, total);
    const showLeftEllipsis = left > 2;
    const showRightEllipsis = right < total - 1;
    const result: PageItem[] = [];

    result.push(1);
    if (showLeftEllipsis) result.push('ellipsis');
    else for (let i = 2; i < left; i++) result.push(i);

    for (let i = left; i <= right; i++) {
      if (i !== 1 && i !== total) result.push(i);
    }

    if (showRightEllipsis) result.push('ellipsis');
    else for (let i = right + 1; i < total; i++) result.push(i);
    result.push(total);

    return result;
  });

  protected go(target: number): void {
    const clamped = Math.min(Math.max(target, 1), this.total());
    if (clamped !== this.page()) {
      this.page.set(clamped);
      this.pageChange.emit(clamped);
    }
  }
}
