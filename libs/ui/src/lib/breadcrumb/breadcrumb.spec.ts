import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Breadcrumb } from './breadcrumb';

@Component({
  imports: [Breadcrumb],
  template: `<lui-breadcrumb [items]="items" />`,
})
class Host {
  items = [
    { label: 'Home', href: '/' },
    { label: 'Settings', href: '/settings' },
    { label: 'Profile' },
  ];
}

describe('Breadcrumb', () => {
  it('renders links for all but the last item, which is the current page', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const links = el.querySelectorAll('a.lui-breadcrumb__link');
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('/');

    const current = el.querySelector('[aria-current="page"]');
    expect(current?.textContent?.trim()).toBe('Profile');
  });

  it('labels the nav landmark', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('nav')?.getAttribute('aria-label'),
    ).toBe('Breadcrumb');
  });
});
