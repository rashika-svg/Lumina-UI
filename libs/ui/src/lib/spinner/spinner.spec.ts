import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Spinner } from './spinner';

describe('Spinner', () => {
  it('is an accessible live region with a default label', () => {
    @Component({ imports: [Spinner], template: `<lui-spinner />` })
    class Host {}
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      'lui-spinner',
    ) as HTMLElement;
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.querySelector('.lui-spinner__label')?.textContent?.trim()).toBe(
      'Loading',
    );
  });

  it('reflects size and tone as data attributes and announces a custom label', () => {
    @Component({
      imports: [Spinner],
      template: `<lui-spinner size="lg" tone="current" label="Saving" />`,
    })
    class Host {}
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      'lui-spinner',
    ) as HTMLElement;
    expect(el.getAttribute('data-size')).toBe('lg');
    expect(el.getAttribute('data-tone')).toBe('current');
    expect(el.querySelector('.lui-spinner__label')?.textContent?.trim()).toBe(
      'Saving',
    );
  });

  it('hides the decorative artwork from assistive technology', () => {
    @Component({ imports: [Spinner], template: `<lui-spinner />` })
    class Host {}
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('.lui-spinner__svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });
});
