import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';

export interface TreeNode {
  readonly id: string;
  readonly label: string;
  readonly children?: readonly TreeNode[];
  readonly disabled?: boolean;
}

interface FlatNode {
  readonly node: TreeNode;
  readonly level: number;
  readonly parentId: string | null;
  readonly expandable: boolean;
  readonly posinset: number;
  readonly setsize: number;
}

/**
 * Lumina Tree View — an accessible hierarchical tree implementing the WAI-ARIA
 * tree pattern: `role="tree"` / `treeitem`, `aria-level`/`aria-expanded`,
 * roving tabindex and full keyboard navigation (Arrow keys, Home/End, Enter).
 *
 * @example
 * ```html
 * <lui-tree [nodes]="nodes" selectable [(selectedId)]="selected" />
 * ```
 */
@Component({
  selector: 'lui-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lui-tree__root" role="tree" (keydown)="onKeydown($event)">
      @for (item of visible(); track item.node.id) {
        <div
          class="lui-tree__node"
          role="treeitem"
          [attr.data-id]="item.node.id"
          [attr.aria-level]="item.level + 1"
          [attr.aria-setsize]="item.setsize"
          [attr.aria-posinset]="item.posinset"
          [attr.aria-expanded]="
            item.expandable ? isExpanded(item.node.id) : null
          "
          [attr.aria-selected]="
            selectable() ? item.node.id === selectedId() : null
          "
          [attr.aria-disabled]="item.node.disabled || null"
          [attr.tabindex]="item.node.id === activeId() ? 0 : -1"
          [class.lui-tree__node--selected]="
            selectable() && item.node.id === selectedId()
          "
          [style.padding-inline-start.rem]="0.5 + item.level * 1.25"
          (click)="onNodeClick(item)"
        >
          @if (item.expandable) {
            <span
              class="lui-tree__chevron"
              [class.lui-tree__chevron--open]="isExpanded(item.node.id)"
              aria-hidden="true"
            ></span>
          } @else {
            <span
              class="lui-tree__chevron lui-tree__chevron--leaf"
              aria-hidden="true"
            ></span>
          }
          <span class="lui-tree__label">{{ item.node.label }}</span>
        </div>
      }
    </div>
  `,
  styleUrl: './tree.css',
  host: { class: 'lui-tree' },
})
export class Tree {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly nodes = input.required<readonly TreeNode[]>();
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly selectedId = model<string | null>(null);

  private readonly expanded = signal<Set<string>>(new Set());
  protected readonly activeId = signal<string | null>(null);

  /** Depth-first list of currently visible nodes with ARIA metadata. */
  protected readonly visible = computed<FlatNode[]>(() => {
    const out: FlatNode[] = [];
    const walk = (
      siblings: readonly TreeNode[],
      level: number,
      parentId: string | null,
    ) => {
      siblings.forEach((node, index) => {
        const expandable = !!node.children?.length;
        out.push({
          node,
          level,
          parentId,
          expandable,
          posinset: index + 1,
          setsize: siblings.length,
        });
        if (expandable && this.expanded().has(node.id)) {
          walk(node.children!, level + 1, node.id);
        }
      });
    };
    walk(this.nodes(), 0, null);
    // Ensure an active node exists.
    if (!this.activeId() && out.length)
      queueMicrotask(() => this.activeId.set(out[0]!.node.id));
    return out;
  });

  isExpanded(id: string): boolean {
    return this.expanded().has(id);
  }

  protected toggle(id: string): void {
    this.expanded.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  protected onNodeClick(item: FlatNode): void {
    if (item.node.disabled) return;
    this.activeId.set(item.node.id);
    if (item.expandable) this.toggle(item.node.id);
    if (this.selectable() && !item.expandable)
      this.selectedId.set(item.node.id);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const list = this.visible().filter((i) => !i.node.disabled);
    if (list.length === 0) return;
    const currentIndex = Math.max(
      0,
      list.findIndex((i) => i.node.id === this.activeId()),
    );
    const current = list[currentIndex]!;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNode(list[Math.min(currentIndex + 1, list.length - 1)]!);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusNode(list[Math.max(currentIndex - 1, 0)]!);
        break;
      case 'Home':
        event.preventDefault();
        this.focusNode(list[0]!);
        break;
      case 'End':
        event.preventDefault();
        this.focusNode(list[list.length - 1]!);
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (current.expandable && !this.isExpanded(current.node.id)) {
          this.toggle(current.node.id);
        } else if (current.expandable) {
          this.focusNode(list[Math.min(currentIndex + 1, list.length - 1)]!);
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (current.expandable && this.isExpanded(current.node.id)) {
          this.toggle(current.node.id);
        } else if (current.parentId) {
          const parent = list.find((i) => i.node.id === current.parentId);
          if (parent) this.focusNode(parent);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.onNodeClick(current);
        break;
    }
  }

  private focusNode(item: FlatNode): void {
    this.activeId.set(item.node.id);
    queueMicrotask(() => {
      this.host.nativeElement
        .querySelector<HTMLElement>(`[data-id="${item.node.id}"]`)
        ?.focus();
    });
  }
}
