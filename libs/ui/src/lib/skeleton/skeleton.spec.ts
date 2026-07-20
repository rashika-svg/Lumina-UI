import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('is hidden from assistive technology and renders a single text line by default', () => {
    @Component({ imports: [Skeleton], template: `<lui-skeleton />` })
    class Host {}
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      'lui-skeleton',
    ) as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.getAttribute('data-variant')).toBe('text');
    expect(el.querySelectorAll('.lui-skeleton__line')).toHaveLength(1);
  });

  it('renders the requested number of text lines and shortens the last one', () => {
    @Component({
      imports: [Skeleton],
      template: `<lui-skeleton [lines]="3" />`,
    })
    class Host {}
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const lines = el.querySelectorAll('.lui-skeleton__line');
    expect(lines).toHaveLength(3);
    expect(lines[2].classList.contains('lui-skeleton__line--last')).toBe(true);
    expect(lines[0].classList.contains('lui-skeleton__line--last')).toBe(false);
  });

  it('renders a single block for non-text variants and reflects the animation', () => {
    @Component({
      imports: [Skeleton],
      template: `<lui-skeleton
        variant="circular"
        width="2.5rem"
        animation="pulse"
      />`,
    })
    class Host {}
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      'lui-skeleton',
    ) as HTMLElement;
    expect(el.getAttribute('data-variant')).toBe('circular');
    expect(el.getAttribute('data-animation')).toBe('pulse');
    expect(el.querySelectorAll('.lui-skeleton__line')).toHaveLength(0);
    expect(el.querySelectorAll('.lui-skeleton__block')).toHaveLength(1);
    expect(el.style.getPropertyValue('--_w')).toBe('2.5rem');
  });
});
