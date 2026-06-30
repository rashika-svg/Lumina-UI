import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { LUMINA_THEME_CONFIG, LuminaThemeConfig } from './theme-config';
import { ThemeService } from './theme.service';

/**
 * Install the Lumina theme engine.
 *
 * Add to your application's bootstrap providers and import the token stylesheet
 * once (`@lumina/tokens/styles`). The engine eagerly initialises so the correct
 * theme is applied before the first paint.
 *
 * @example
 * ```ts
 * bootstrapApplication(App, {
 *   providers: [provideLuminaTheme({ defaultMode: 'system' })],
 * });
 * ```
 */
export function provideLuminaTheme(
  config: LuminaThemeConfig = {},
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: LUMINA_THEME_CONFIG, useValue: config },
    // Eagerly instantiate so the resolved theme is applied at startup.
    provideEnvironmentInitializer(() => {
      inject(ThemeService);
    }),
  ]);
}

/**
 * A tiny, framework-agnostic script you can inline in `index.html` *before*
 * Angular boots to eliminate the flash of the wrong theme (FOUC). It reads the
 * persisted preference and OS setting and sets `data-theme` synchronously.
 */
export function themeInitScript(storageKey = 'lumina-theme'): string {
  return `(function(){try{var k=${JSON.stringify(storageKey)};var m=localStorage.getItem(k)||'system';var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=m==='system'?(d?'dark':'light'):m;document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;
}
