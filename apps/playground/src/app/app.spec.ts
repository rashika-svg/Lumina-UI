import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLuminaTheme } from '@lumina/theme';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';

describe('App (platform shell)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideLuminaTheme({ defaultMode: 'light' }),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('renders the Lumina brand', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const brand = (fixture.nativeElement as HTMLElement).querySelector(
      '.brand__name',
    );
    expect(brand?.textContent).toContain('Lumina UI');
  });

  it('renders the four primary nav links', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('.app-nav__link').length,
    ).toBe(4);
  });

  it('exposes a three-mode theme toggle', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('.theme-toggle__btn').length,
    ).toBe(3);
  });
});
