# @lumina/theme

The runtime theme engine for Lumina UI — a signal-based, SSR-safe Angular service that drives
theming entirely through CSS variables.

## Features

- **Built-in themes** — `light`, `dark`, `hc` (high contrast).
- **System resolution** — `mode: 'system'` follows the OS `prefers-color-scheme`.
- **Reduced motion** — reactive `prefersReducedMotion` signal, mirrored to `data-reduced-motion`.
- **Custom themes** — register token overrides on a base theme at runtime; injected as a generated
  `[data-theme-variant]` stylesheet.
- **Persistence** — remembers the user's choice in `localStorage`.
- **Export / import** — serialise and restore custom themes.

## Setup

```ts
import { provideLuminaTheme } from '@lumina/theme';

bootstrapApplication(App, {
  providers: [provideLuminaTheme({ defaultMode: 'system' })],
});
```

```css
@import '@lumina/tokens/styles';
```

## Use

```ts
import { ThemeService } from '@lumina/theme';

const theme = inject(ThemeService);

theme.setMode('dark'); // 'light' | 'dark' | 'hc' | 'system'
theme.toggle(); // flip light/dark
theme.resolvedTheme(); // signal → concrete theme applied to <html>
theme.isDark(); // signal
theme.prefersReducedMotion(); // signal

theme.registerTheme({
  id: 'sunset',
  base: 'dark',
  overrides: { 'color.accent.default': '#ff5e3a' },
});
theme.setMode('sunset');

const json = theme.exportThemes();
theme.importThemes(json);
```

To avoid a flash of the wrong theme on first paint, inline `themeInitScript()` in `index.html`
before the app bundle.
