import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideLuminaTheme } from './theme.provider';
import { ThemeService } from './theme.service';

function setup(config = {}) {
  TestBed.configureTestingModule({ providers: [provideLuminaTheme(config)] });
  const service = TestBed.inject(ThemeService);
  TestBed.tick(); // flush startup effects
  return service;
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    const root = document.documentElement;
    root.removeAttribute('data-theme');
    root.removeAttribute('data-theme-variant');
    document.getElementById('lumina-custom-themes')?.remove();
  });

  it('applies the default theme to <html>', () => {
    setup({ defaultMode: 'light' });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('switches theme and tracks darkness reactively', () => {
    const service = setup({ defaultMode: 'light' });
    expect(service.isDark()).toBe(false);

    service.setMode('dark');
    TestBed.tick();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(service.isDark()).toBe(true);
  });

  it('toggles between light and dark', () => {
    const service = setup({ defaultMode: 'light' });
    service.toggle();
    TestBed.tick();
    expect(service.resolvedTheme()).toBe('dark');
  });

  it('persists the chosen mode to localStorage', () => {
    const service = setup({ defaultMode: 'light', storageKey: 'lumina-theme' });
    service.setMode('hc');
    expect(localStorage.getItem('lumina-theme')).toBe('hc');
  });

  it('registers a custom theme as a data-theme-variant override layer', () => {
    const service = setup({ defaultMode: 'light' });
    service.registerTheme({
      id: 'sunset',
      base: 'dark',
      overrides: { 'color.accent.default': '#ff5e3a' },
    });
    service.setMode('sunset');
    TestBed.tick();

    const root = document.documentElement;
    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(root.getAttribute('data-theme-variant')).toBe('sunset');

    const style = document.getElementById('lumina-custom-themes');
    expect(style?.textContent).toContain('[data-theme-variant="sunset"]');
    expect(style?.textContent).toContain(
      '--lui-color-accent-default: #ff5e3a;',
    );
  });

  it('round-trips custom themes through export/import', () => {
    const service = setup();
    service.registerTheme({
      id: 'mono',
      base: 'light',
      overrides: { '--lui-color-accent-default': '#111827' },
    });
    const json = service.exportThemes();

    service.removeTheme('mono');
    expect(service.customThemes().some((t) => t.id === 'mono')).toBe(false);

    service.importThemes(json);
    expect(service.customThemes().some((t) => t.id === 'mono')).toBe(true);
  });
});
