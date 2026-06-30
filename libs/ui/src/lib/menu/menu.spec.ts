import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Menu } from './menu';
import { MenuItem } from './menu-item';
import { MenuTrigger } from './menu-trigger';

@Component({
  imports: [Menu, MenuTrigger, MenuItem],
  template: `
    <lui-menu>
      <button luiMenuTrigger>Options</button>
      <lui-menu-item (selected)="picked.set('edit')">Edit</lui-menu-item>
      <lui-menu-item [disabled]="true">Archive</lui-menu-item>
      <lui-menu-item (selected)="picked.set('delete')">Delete</lui-menu-item>
    </lui-menu>
  `,
})
class Host {
  readonly picked = signal('');
}

describe('Menu', () => {
  let fixture: ComponentFixture<Host>;
  const trigger = () =>
    fixture.nativeElement.querySelector(
      '[luiMenuTrigger]',
    ) as HTMLButtonElement;
  const panel = () =>
    fixture.nativeElement.querySelector('[role="menu"]') as HTMLElement | null;
  const items = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('[role="menuitem"]'),
    ) as HTMLElement[];

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('is collapsed initially with correct ARIA on the trigger', () => {
    expect(panel()).toBeNull();
    expect(trigger().getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('opens on trigger click and exposes a role=menu', () => {
    trigger().click();
    fixture.detectChanges();
    expect(panel()).toBeTruthy();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(items().length).toBe(3);
  });

  it('marks disabled items with aria-disabled', () => {
    trigger().click();
    fixture.detectChanges();
    expect(items()[1].getAttribute('aria-disabled')).toBe('true');
  });

  it('emits select and closes when an item is activated', () => {
    trigger().click();
    fixture.detectChanges();
    items()[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.picked()).toBe('edit');
    expect(panel()).toBeNull();
  });

  it('does not activate a disabled item', () => {
    trigger().click();
    fixture.detectChanges();
    items()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.picked()).toBe('');
    expect(panel()).toBeTruthy();
  });

  it('closes on Escape from the panel', () => {
    trigger().click();
    fixture.detectChanges();
    panel()!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    expect(panel()).toBeNull();
  });
});
