import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Tab } from './tab';
import { Tabs } from './tabs';

@Component({
  imports: [Tabs, Tab],
  template: `
    <lui-tabs ariaLabel="Settings">
      <lui-tab label="Account">Account panel</lui-tab>
      <lui-tab label="Security" [disabled]="true">Security panel</lui-tab>
      <lui-tab label="Billing">Billing panel</lui-tab>
    </lui-tabs>
  `,
})
class Host {}

describe('Tabs', () => {
  let fixture: ComponentFixture<Host>;
  const tabButtons = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('[role="tab"]'),
    ) as HTMLButtonElement[];
  const panel = () =>
    fixture.nativeElement.querySelector('[role="tabpanel"]') as HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('renders a tablist and selects the first tab by default', () => {
    expect(
      fixture.nativeElement.querySelector('[role="tablist"]'),
    ).toBeTruthy();
    expect(tabButtons()[0].getAttribute('aria-selected')).toBe('true');
    expect(panel().textContent).toContain('Account panel');
  });

  it('wires aria-controls/labelledby and roving tabindex', () => {
    const [first, , third] = tabButtons();
    expect(first.getAttribute('tabindex')).toBe('0');
    expect(third.getAttribute('tabindex')).toBe('-1');
    expect(panel().getAttribute('aria-labelledby')).toBe(first.id);
    expect(first.getAttribute('aria-controls')).toBe(panel().id);
  });

  it('selects a tab on click and swaps the panel', () => {
    tabButtons()[2].click();
    fixture.detectChanges();
    expect(tabButtons()[2].getAttribute('aria-selected')).toBe('true');
    expect(panel().textContent).toContain('Billing panel');
  });

  it('skips disabled tabs during arrow-key navigation', () => {
    const list = fixture.nativeElement.querySelector(
      '[role="tablist"]',
    ) as HTMLElement;
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    // index 1 is disabled, so focus/selection wraps to index 2 (Billing)
    expect(tabButtons()[2].getAttribute('aria-selected')).toBe('true');
  });
});
