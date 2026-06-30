import { TestBed } from '@angular/core/testing';
import { provideLuminaTheme } from '@lumina/theme';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';

describe('App (playground shell)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideLuminaTheme({ defaultMode: 'light' })],
    }).compileComponents();
  });

  it('renders the Lumina brand heading', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Lumina UI');
  });

  it('exposes the four theme switcher controls', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll(
      '.theme-switcher button',
    );
    expect(buttons.length).toBe(4);
  });
});
