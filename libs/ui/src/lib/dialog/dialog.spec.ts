import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Dialog } from './dialog';

@Component({
  imports: [Dialog],
  template: `
    <lui-dialog [(open)]="open" heading="Confirm" description="Are you sure?">
      <p>Body content</p>
      <div dialogFooter><button>OK</button></div>
    </lui-dialog>
  `,
})
class Host {
  readonly open = signal(false);
}

describe('Dialog', () => {
  let fixture: ComponentFixture<Host>;
  const dialog = () =>
    document.querySelector('[role="dialog"]') as HTMLElement | null;

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('is not rendered while closed', () => {
    expect(dialog()).toBeNull();
  });

  it('renders an accessible modal when opened', () => {
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    const el = dialog()!;
    expect(el.getAttribute('aria-modal')).toBe('true');
    expect(el.getAttribute('aria-labelledby')).toBeTruthy();
    expect(el.getAttribute('aria-describedby')).toBeTruthy();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closes on Escape', () => {
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    const viewport = document.querySelector(
      '.lui-dialog__viewport',
    ) as HTMLElement;
    viewport.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on backdrop click', () => {
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    (document.querySelector('.lui-dialog__backdrop') as HTMLElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
  });
});
