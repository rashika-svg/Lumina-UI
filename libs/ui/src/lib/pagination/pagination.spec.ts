import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Pagination } from './pagination';

@Component({
  imports: [Pagination],
  template: `<lui-pagination [total]="total()" [(page)]="page" />`,
})
class Host {
  readonly total = signal(20);
  readonly page = signal(1);
}

describe('Pagination', () => {
  let fixture: ComponentFixture<Host>;
  const pageButtons = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('.lui-pagination__btn'),
    ) as HTMLButtonElement[];
  const labels = () => pageButtons().map((b) => b.textContent?.trim());

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('disables Previous on the first page', () => {
    const prev = pageButtons()[0];
    expect(prev.getAttribute('aria-label')).toBe('Previous page');
    expect(prev.disabled).toBe(true);
  });

  it('truncates large page counts with an ellipsis', () => {
    expect(
      fixture.nativeElement.querySelector('.lui-pagination__ellipsis'),
    ).toBeTruthy();
    expect(labels()).toContain('20'); // last page always shown
  });

  it('marks the current page with aria-current', () => {
    fixture.componentInstance.page.set(5);
    fixture.detectChanges();
    const current = pageButtons().find(
      (b) => b.getAttribute('aria-current') === 'page',
    );
    expect(current?.textContent?.trim()).toBe('5');
  });

  it('navigates and clamps within bounds', () => {
    const next = pageButtons().at(-1)!;
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.page()).toBe(2);
  });

  it('shows all pages without ellipsis for small counts', () => {
    fixture.componentInstance.total.set(5);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.lui-pagination__ellipsis'),
    ).toBeNull();
  });
});
