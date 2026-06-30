import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Button } from './button';

@Component({
  imports: [Button],
  template: `
    <button
      luiButton
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
      [loading]="loading()"
    >
      Save
    </button>
    <a luiButton href="/docs" [disabled]="linkDisabled()">Docs</a>
  `,
})
class Host {
  readonly variant = signal<
    'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
  >('primary');
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly disabled = signal(false);
  readonly loading = signal(false);
  readonly linkDisabled = signal(false);
}

describe('Button', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  const btn = () =>
    fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  const link = () =>
    fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('projects content and applies the base class', () => {
    expect(btn().textContent?.trim()).toContain('Save');
    expect(btn().classList.contains('lui-button')).toBe(true);
  });

  it('reflects variant and size as data attributes', () => {
    host.variant.set('danger');
    host.size.set('lg');
    fixture.detectChanges();
    expect(btn().getAttribute('data-variant')).toBe('danger');
    expect(btn().getAttribute('data-size')).toBe('lg');
  });

  it('sets the native disabled attribute on a <button>', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    expect(btn().hasAttribute('disabled')).toBe(true);
  });

  it('marks loading state with aria-busy and blocks interaction', () => {
    host.loading.set(true);
    fixture.detectChanges();
    expect(btn().getAttribute('aria-busy')).toBe('true');
    expect(btn().hasAttribute('disabled')).toBe(true);
  });

  it('uses aria-disabled and tabindex=-1 for a disabled anchor (no native disabled)', () => {
    host.linkDisabled.set(true);
    fixture.detectChanges();
    expect(link().getAttribute('aria-disabled')).toBe('true');
    expect(link().getAttribute('tabindex')).toBe('-1');
    expect(link().hasAttribute('disabled')).toBe(false);
  });

  it('prevents click activation when disabled', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    const event = new MouseEvent('click', { cancelable: true, bubbles: true });
    btn().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('activates an anchor on Space key for parity with <button>', () => {
    const clickSpy = vi.spyOn(link(), 'click');
    link().dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', cancelable: true }),
    );
    expect(clickSpy).toHaveBeenCalled();
  });
});
