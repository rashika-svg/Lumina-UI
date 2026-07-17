import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Card } from './card';

@Component({
  imports: [Card],
  template: `
    <lui-card
      [variant]="variant()"
      [interactive]="interactive()"
      (cardClick)="clicks.set(clicks() + 1)"
    >
      <h3 cardHeader>Title</h3>
      <p>Body</p>
      <div cardFooter>Footer</div>
    </lui-card>
  `,
})
class Host {
  readonly variant = signal<'elevated' | 'outlined' | 'filled'>('elevated');
  readonly interactive = signal(false);
  readonly clicks = signal(0);
}

describe('Card', () => {
  let fixture: ComponentFixture<Host>;
  const card = () =>
    fixture.nativeElement.querySelector('lui-card') as HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('projects header, body and footer content', () => {
    expect(card().textContent).toContain('Title');
    expect(card().textContent).toContain('Body');
    expect(card().textContent).toContain('Footer');
  });

  it('reflects the variant', () => {
    fixture.componentInstance.variant.set('outlined');
    fixture.detectChanges();
    expect(card().getAttribute('data-variant')).toBe('outlined');
  });

  it('is not interactive by default (no role/tabindex, click ignored)', () => {
    expect(card().getAttribute('role')).toBeNull();
    expect(card().getAttribute('tabindex')).toBeNull();
    card().click();
    expect(fixture.componentInstance.clicks()).toBe(0);
  });

  describe('interactive', () => {
    beforeEach(() => {
      fixture.componentInstance.interactive.set(true);
      fixture.detectChanges();
    });

    it('exposes button semantics', () => {
      expect(card().getAttribute('role')).toBe('button');
      expect(card().getAttribute('tabindex')).toBe('0');
    });

    it('emits cardClick on click and Enter/Space', () => {
      card().click();
      card().dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
      card().dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
      );
      expect(fixture.componentInstance.clicks()).toBe(3);
    });
  });
});
