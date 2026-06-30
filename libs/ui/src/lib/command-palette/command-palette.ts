import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

export interface Command {
  readonly id: string;
  readonly label: string;
  /** Secondary text shown on the right (e.g. a shortcut or section). */
  readonly hint?: string;
  /** Optional grouping label. */
  readonly group?: string;
  /** Extra terms to match against when searching. */
  readonly keywords?: readonly string[];
}

/**
 * Lumina Command Palette — a searchable, keyboard-first command launcher
 * (the ⌘K pattern). Filters commands as you type and supports Arrow keys,
 * Enter to run and Escape to dismiss, with an ARIA combobox/listbox structure.
 *
 * @example
 * ```html
 * <lui-command-palette [(open)]="open" [commands]="commands" (run)="execute($event)" />
 * ```
 */
@Component({
  selector: 'lui-command-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="lui-cmdk__backdrop" (click)="close()"></div>
      <div class="lui-cmdk__viewport">
        <div
          class="lui-cmdk__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <input
            #search
            class="lui-cmdk__input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="lui-cmdk-list"
            [attr.aria-activedescendant]="activeId()"
            [placeholder]="placeholder()"
            [value]="query()"
            (input)="onQuery($event)"
            (keydown)="onKeydown($event)"
          />
          <ul id="lui-cmdk-list" class="lui-cmdk__list" role="listbox">
            @for (cmd of filtered(); track cmd.id; let i = $index) {
              <li
                class="lui-cmdk__item"
                role="option"
                [id]="'lui-cmdk-opt-' + i"
                [attr.aria-selected]="i === activeIndex()"
                [class.lui-cmdk__item--active]="i === activeIndex()"
                (mouseenter)="activeIndex.set(i)"
                (click)="runCommand(cmd)"
              >
                <span class="lui-cmdk__label">{{ cmd.label }}</span>
                @if (cmd.hint || cmd.group) {
                  <span class="lui-cmdk__hint">{{
                    cmd.hint || cmd.group
                  }}</span>
                }
              </li>
            } @empty {
              <li class="lui-cmdk__empty" role="presentation">
                No results for “{{ query() }}”
              </li>
            }
          </ul>
        </div>
      </div>
    }
  `,
  styleUrl: './command-palette.css',
  host: { class: 'lui-cmdk' },
})
export class CommandPalette {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly open = model(false);
  readonly commands = input.required<readonly Command[]>();
  readonly placeholder = input('Type a command or search…');
  readonly run = output<Command>();

  protected readonly query = signal('');
  protected readonly activeIndex = signal(0);

  private readonly search = viewChild<ElementRef<HTMLInputElement>>('search');
  private triggerEl: HTMLElement | null = null;
  private previousOverflow = '';

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.commands();
    return this.commands().filter((c) => {
      const haystack = [c.label, c.hint, c.group, ...(c.keywords ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  });

  protected readonly activeId = computed(() =>
    this.filtered().length ? `lui-cmdk-opt-${this.activeIndex()}` : null,
  );

  constructor() {
    effect(() => {
      const isOpen = this.open();
      untracked(() => (isOpen ? this.activate() : this.deactivate()));
    });
    // Keep the active index in range as the filtered list changes.
    effect(() => {
      const count = this.filtered().length;
      if (this.activeIndex() > Math.max(0, count - 1)) this.activeIndex.set(0);
    });
  }

  close(): void {
    this.open.set(false);
  }

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.activeIndex.set(0);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.filtered().length;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (count) this.activeIndex.set((this.activeIndex() + 1) % count);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (count)
          this.activeIndex.set((this.activeIndex() - 1 + count) % count);
        break;
      case 'Enter': {
        event.preventDefault();
        const cmd = this.filtered()[this.activeIndex()];
        if (cmd) this.runCommand(cmd);
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  protected runCommand(cmd: Command): void {
    this.run.emit(cmd);
    this.close();
  }

  private activate(): void {
    if (!this.isBrowser) return;
    this.triggerEl = this.document.activeElement as HTMLElement | null;
    this.query.set('');
    this.activeIndex.set(0);
    this.previousOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
    setTimeout(() => this.search()?.nativeElement.focus());
  }

  private deactivate(): void {
    if (!this.isBrowser) return;
    this.document.body.style.overflow = this.previousOverflow;
    this.triggerEl?.focus?.();
    this.triggerEl = null;
  }
}
