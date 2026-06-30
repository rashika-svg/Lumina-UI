import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from '@angular/core';

export type TableAlign = 'start' | 'center' | 'end';
export type SortDirection = 'asc' | 'desc';

export interface TableColumn<T> {
  /** Unique column id; also the default property used for value + sorting. */
  readonly key: string;
  /** Header label. */
  readonly header: string;
  /** Enable click-to-sort on this column. */
  readonly sortable?: boolean;
  /** Cell + header text alignment. */
  readonly align?: TableAlign;
  /** Fixed column width (any CSS length). */
  readonly width?: string;
  /** Extract the display/sort value for a row (defaults to `row[key]`). */
  readonly accessor?: (row: T) => string | number | null | undefined;
}

interface SortState {
  readonly key: string | null;
  readonly dir: SortDirection;
}

/**
 * Lumina Data Table — a generic, accessible table with column-driven
 * configuration, click-to-sort (with `aria-sort`), optional row selection
 * (with a select-all header), a sticky header, and loading / empty states.
 *
 * @example
 * ```html
 * <lui-table
 *   [columns]="columns"
 *   [data]="users"
 *   selectable
 *   [(selection)]="selected"
 *   [rowKey]="byId"
 * />
 * ```
 */
@Component({
  selector: 'lui-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lui-table__scroll" [class.lui-table--sticky]="stickyHeader()">
      <table class="lui-table__table">
        <thead class="lui-table__head">
          <tr>
            @if (selectable()) {
              <th class="lui-table__cell lui-table__cell--check" scope="col">
                <input
                  type="checkbox"
                  class="lui-table__checkbox"
                  aria-label="Select all rows"
                  [checked]="allSelected()"
                  [indeterminate]="someSelected()"
                  (change)="toggleAll()"
                />
              </th>
            }
            @for (col of columns(); track col.key) {
              <th
                class="lui-table__cell lui-table__cell--head"
                scope="col"
                [attr.data-align]="col.align || 'start'"
                [style.width]="col.width || null"
                [attr.aria-sort]="ariaSort(col)"
              >
                @if (col.sortable) {
                  <button
                    type="button"
                    class="lui-table__sort"
                    (click)="toggleSort(col)"
                  >
                    <span>{{ col.header }}</span>
                    <span
                      class="lui-table__sort-icon"
                      [attr.data-state]="sortStateFor(col)"
                      aria-hidden="true"
                    ></span>
                  </button>
                } @else {
                  {{ col.header }}
                }
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @if (loading()) {
            <tr>
              <td
                class="lui-table__cell lui-table__status"
                [attr.colspan]="colspan()"
              >
                <span class="lui-table__spinner" aria-hidden="true"></span>
                <span>Loading…</span>
              </td>
            </tr>
          } @else if (sortedData().length === 0) {
            <tr>
              <td
                class="lui-table__cell lui-table__status"
                [attr.colspan]="colspan()"
              >
                {{ emptyMessage() }}
              </td>
            </tr>
          } @else {
            @for (row of sortedData(); track rowKey()(row)) {
              <tr
                class="lui-table__row"
                [class.lui-table__row--selected]="isSelected(row)"
              >
                @if (selectable()) {
                  <td class="lui-table__cell lui-table__cell--check">
                    <input
                      type="checkbox"
                      class="lui-table__checkbox"
                      aria-label="Select row"
                      [checked]="isSelected(row)"
                      (change)="toggleRow(row)"
                    />
                  </td>
                }
                @for (col of columns(); track col.key) {
                  <td
                    class="lui-table__cell"
                    [attr.data-align]="col.align || 'start'"
                  >
                    {{ valueOf(row, col) }}
                  </td>
                }
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrl: './table.css',
  host: { class: 'lui-table' },
})
export class Table<T> {
  readonly columns = input.required<readonly TableColumn<T>[]>();
  readonly data = input.required<readonly T[]>();
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly stickyHeader = input(true, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly emptyMessage = input('No data to display.');
  /** Identity function used to compare rows for selection. */
  readonly rowKey = input<(row: T) => unknown>((row) => row);
  /** Two-way bindable selected rows. */
  readonly selection = model<T[]>([]);

  private readonly sort = signal<SortState>({ key: null, dir: 'asc' });

  protected readonly colspan = computed(
    () => this.columns().length + (this.selectable() ? 1 : 0),
  );

  protected readonly sortedData = computed(() => {
    const { key, dir } = this.sort();
    const rows = [...this.data()];
    if (!key) return rows;
    const col = this.columns().find((c) => c.key === key);
    if (!col) return rows;
    const factor = dir === 'asc' ? 1 : -1;
    return rows.sort((a, b) => {
      const av = this.rawValue(a, col);
      const bv = this.rawValue(b, col);
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number')
        return (av - bv) * factor;
      return String(av).localeCompare(String(bv)) * factor;
    });
  });

  protected readonly allSelected = computed(
    () =>
      this.data().length > 0 && this.selection().length === this.data().length,
  );
  protected readonly someSelected = computed(
    () => this.selection().length > 0 && !this.allSelected(),
  );

  protected toggleSort(col: TableColumn<T>): void {
    this.sort.update((s) =>
      s.key === col.key
        ? { key: col.key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { key: col.key, dir: 'asc' },
    );
  }

  protected sortStateFor(col: TableColumn<T>): SortDirection | 'none' {
    return this.sort().key === col.key ? this.sort().dir : 'none';
  }

  protected ariaSort(
    col: TableColumn<T>,
  ): 'ascending' | 'descending' | 'none' | null {
    if (!col.sortable) return null;
    const state = this.sortStateFor(col);
    return state === 'asc'
      ? 'ascending'
      : state === 'desc'
        ? 'descending'
        : 'none';
  }

  protected isSelected(row: T): boolean {
    const key = this.rowKey()(row);
    return this.selection().some((r) => this.rowKey()(r) === key);
  }

  protected toggleRow(row: T): void {
    const key = this.rowKey()(row);
    this.selection.update((current) =>
      current.some((r) => this.rowKey()(r) === key)
        ? current.filter((r) => this.rowKey()(r) !== key)
        : [...current, row],
    );
  }

  protected toggleAll(): void {
    this.selection.set(this.allSelected() ? [] : [...this.data()]);
  }

  protected valueOf(row: T, col: TableColumn<T>): string {
    const value = this.rawValue(row, col);
    return value == null ? '' : String(value);
  }

  private rawValue(
    row: T,
    col: TableColumn<T>,
  ): string | number | null | undefined {
    return col.accessor
      ? col.accessor(row)
      : ((row as Record<string, unknown>)[col.key] as
          string | number | null | undefined);
  }
}
