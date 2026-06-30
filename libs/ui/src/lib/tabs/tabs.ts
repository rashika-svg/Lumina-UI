import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { Tab } from './tab';

export type TabsAlign = 'start' | 'center' | 'stretch';

/**
 * Lumina Tabs — an accessible tabbed interface implementing the WAI-ARIA
 * Tabs pattern with roving `tabindex` and full keyboard support
 * (Arrow keys, Home/End). Selection follows focus (automatic activation).
 *
 * @example
 * ```html
 * <lui-tabs [(selectedIndex)]="tab">
 *   <lui-tab label="Account">…</lui-tab>
 *   <lui-tab label="Security">…</lui-tab>
 * </lui-tabs>
 * ```
 */
@Component({
  selector: 'lui-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="lui-tabs__list"
      role="tablist"
      [attr.aria-label]="ariaLabel() || null"
      [attr.data-align]="align()"
      (keydown)="onKeydown($event)"
    >
      @for (tab of tabs(); track tab.uid; let i = $index) {
        <button
          type="button"
          class="lui-tabs__tab"
          role="tab"
          [id]="tab.uid + '-tab'"
          [attr.aria-selected]="i === selectedIndex()"
          [attr.aria-controls]="tab.uid + '-panel'"
          [attr.tabindex]="i === selectedIndex() ? 0 : -1"
          [disabled]="tab.disabled()"
          [class.lui-tabs__tab--active]="i === selectedIndex()"
          (click)="select(i)"
        >
          {{ tab.label() }}
        </button>
      }
    </div>

    @if (activeTab(); as tab) {
      <div
        class="lui-tabs__panel"
        role="tabpanel"
        tabindex="0"
        [id]="tab.uid + '-panel'"
        [attr.aria-labelledby]="tab.uid + '-tab'"
      >
        <ng-container [ngTemplateOutlet]="tab.content()" />
      </div>
    }
  `,
  styleUrl: './tabs.css',
  host: { class: 'lui-tabs' },
})
export class Tabs {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly tabs = contentChildren(Tab);
  readonly selectedIndex = model(0);
  readonly ariaLabel = input('');
  readonly align = input<TabsAlign>('start');

  /** Index currently receiving roving focus (may differ briefly from selection). */
  private readonly focusedIndex = signal(0);

  protected readonly activeTab = computed(
    () => this.tabs()[this.selectedIndex()] ?? this.tabs()[0],
  );

  constructor() {
    // Keep the selected index within bounds as tabs change.
    effect(() => {
      const count = this.tabs().length;
      if (count > 0 && this.selectedIndex() > count - 1)
        this.selectedIndex.set(count - 1);
    });
  }

  protected select(index: number): void {
    if (this.tabs()[index]?.disabled()) return;
    this.selectedIndex.set(index);
    this.focusedIndex.set(index);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.tabs().length;
    if (count === 0) return;
    const current = this.selectedIndex();
    let next: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = this.nextEnabled(current, 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = this.nextEnabled(current, -1);
        break;
      case 'Home':
        next = this.nextEnabled(-1, 1);
        break;
      case 'End':
        next = this.nextEnabled(count, -1);
        break;
      default:
        return;
    }

    if (next !== null) {
      event.preventDefault();
      this.select(next);
      this.focusTab(next);
    }
  }

  /** Find the next non-disabled tab in `direction`, wrapping around. */
  private nextEnabled(from: number, direction: 1 | -1): number {
    const count = this.tabs().length;
    for (let step = 1; step <= count; step++) {
      const index = (from + direction * step + count * step) % count;
      if (!this.tabs()[index]?.disabled()) return index;
    }
    return from;
  }

  private focusTab(index: number): void {
    const buttons =
      this.host.nativeElement.querySelectorAll<HTMLButtonElement>(
        '.lui-tabs__tab',
      );
    buttons.item(index)?.focus();
  }
}
