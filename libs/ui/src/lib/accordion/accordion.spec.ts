import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Accordion } from './accordion';
import { AccordionItem } from './accordion-item';

@Component({
  imports: [Accordion, AccordionItem],
  template: `
    <lui-accordion [multiple]="multiple()">
      <lui-accordion-item heading="One">First</lui-accordion-item>
      <lui-accordion-item heading="Two">Second</lui-accordion-item>
    </lui-accordion>
  `,
})
class Host {
  readonly multiple = signal(false);
}

describe('Accordion', () => {
  let fixture: ComponentFixture<Host>;
  const triggers = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('.lui-accordion__trigger'),
    ) as HTMLButtonElement[];

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('starts collapsed with aria-expanded=false', () => {
    expect(triggers()[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('expands an item on click', () => {
    triggers()[0].click();
    fixture.detectChanges();
    expect(triggers()[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('collapses siblings in single-open mode', () => {
    triggers()[0].click();
    fixture.detectChanges();
    triggers()[1].click();
    fixture.detectChanges();
    expect(triggers()[0].getAttribute('aria-expanded')).toBe('false');
    expect(triggers()[1].getAttribute('aria-expanded')).toBe('true');
  });

  it('keeps multiple panels open when multiple=true', () => {
    fixture.componentInstance.multiple.set(true);
    fixture.detectChanges();
    triggers()[0].click();
    triggers()[1].click();
    fixture.detectChanges();
    expect(triggers()[0].getAttribute('aria-expanded')).toBe('true');
    expect(triggers()[1].getAttribute('aria-expanded')).toBe('true');
  });
});
