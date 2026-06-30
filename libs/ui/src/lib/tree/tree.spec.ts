import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Tree, type TreeNode } from './tree';

@Component({
  imports: [Tree],
  template: `<lui-tree [nodes]="nodes" selectable [(selectedId)]="selected" />`,
})
class Host {
  readonly selected = signal<string | null>(null);
  readonly nodes: TreeNode[] = [
    {
      id: 'src',
      label: 'src',
      children: [
        {
          id: 'app',
          label: 'app',
          children: [{ id: 'main', label: 'main.ts' }],
        },
        { id: 'styles', label: 'styles.css' },
      ],
    },
    { id: 'readme', label: 'README.md' },
  ];
}

describe('Tree', () => {
  let fixture: ComponentFixture<Host>;
  const items = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('[role="treeitem"]'),
    ) as HTMLElement[];
  const labels = () => items().map((i) => i.textContent?.trim());

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('renders top-level nodes collapsed with ARIA metadata', () => {
    expect(labels()).toEqual(['src', 'README.md']);
    const src = items()[0];
    expect(src.getAttribute('role')).toBe('treeitem');
    expect(src.getAttribute('aria-level')).toBe('1');
    expect(src.getAttribute('aria-expanded')).toBe('false');
  });

  it('expands a node on click to reveal children', () => {
    items()[0].click();
    fixture.detectChanges();
    expect(labels()).toEqual(['src', 'app', 'styles.css', 'README.md']);
    expect(items()[0].getAttribute('aria-expanded')).toBe('true');
    expect(items()[1].getAttribute('aria-level')).toBe('2');
  });

  it('selects a leaf node and reflects aria-selected', () => {
    items()[0].click(); // expand src
    fixture.detectChanges();
    const styles = items().find((i) => i.textContent?.trim() === 'styles.css')!;
    styles.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected()).toBe('styles');
    expect(styles.getAttribute('aria-selected')).toBe('true');
  });

  it('expands with ArrowRight via the keyboard', () => {
    const root = fixture.nativeElement.querySelector(
      '[role="tree"]',
    ) as HTMLElement;
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(items()[0].getAttribute('aria-expanded')).toBe('true');
  });
});
