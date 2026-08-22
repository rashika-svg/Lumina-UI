import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Drawer } from './drawer';

@Component({
  imports: [Drawer],
  template: `
    <lui-drawer [(open)]="open" [side]="side()" heading="Menu"
      >Drawer body</lui-drawer
    >
  `,
})
class Host {
  readonly open = signal(false);
  readonly side = signal<'start' | 'end' | 'top' | 'bottom'>('end');
}

describe('Drawer', () => {
  let fixture: ComponentFixture<Host>;
  const dialog = () =>
    document.querySelector('.lui-drawer [role="dialog"]') as HTMLElement | null;

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('is closed by default', () => {
    expect(dialog()).toBeNull();
  });

  it('opens as an accessible modal and locks scroll', () => {
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    const el = dialog()!;
    expect(el.getAttribute('aria-modal')).toBe('true');
    expect(el.getAttribute('data-side')).toBe('end');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('reflects the side input', () => {
    fixture.componentInstance.side.set('start');
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    expect(dialog()!.getAttribute('data-side')).toBe('start');
  });

  it('closes on Escape and restores scroll', () => {
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    const viewport = document.querySelector(
      '.lui-drawer__viewport',
    ) as HTMLElement;
    viewport.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('moves focus into the drawer and restores it to the trigger on close', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));
    expect(dialog()!.contains(document.activeElement)).toBe(true);

    fixture.componentInstance.open.set(false);
    fixture.detectChanges();
    expect(document.activeElement).toBe(trigger);

    trigger.remove();
  });
});
