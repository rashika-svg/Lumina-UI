import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge';
import { Avatar } from '../avatar/avatar';

describe('Badge', () => {
  it('reflects variant, size and appearance as data attributes', () => {
    @Component({
      imports: [Badge],
      template: `<span luiBadge variant="success" size="sm" appearance="solid"
        >Active</span
      >`,
    })
    class Host {}
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector(
      '[luiBadge]',
    ) as HTMLElement;
    expect(badge.getAttribute('data-variant')).toBe('success');
    expect(badge.getAttribute('data-size')).toBe('sm');
    expect(badge.getAttribute('data-appearance')).toBe('solid');
    expect(badge.textContent?.trim()).toBe('Active');
  });
});

describe('Avatar', () => {
  it('derives two-letter initials from a full name and exposes an accessible name', () => {
    @Component({
      imports: [Avatar],
      template: `<lui-avatar name="Ada Lovelace" />`,
    })
    class Host {}
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.lui-avatar__fallback')?.textContent).toBe('AL');
    expect(el.querySelector('.lui-avatar__sr')?.textContent).toBe(
      'Ada Lovelace',
    );
  });

  it('renders an image when src is provided and falls back on error', () => {
    @Component({
      imports: [Avatar],
      template: `<lui-avatar name="Ada" src="/a.png" />`,
    })
    class Host {}
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const img = el.querySelector('img')!;
    expect(img.getAttribute('alt')).toBe('Ada');

    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('.lui-avatar__fallback')?.textContent).toBe('A');
  });
});
