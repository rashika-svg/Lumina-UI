# @lumina/tokens

The single source of truth for every visual decision in Lumina UI.

Tokens are authored in the [DTCG](https://tr.designtokens.org/) format under `tokens/` and compiled
by [Style Dictionary](https://styledictionary.com) into CSS custom properties and a typed TS map.

## Tiers

| Tier      | Location                               | Example                                   |
| --------- | -------------------------------------- | ----------------------------------------- |
| Primitive | `tokens/primitive/`                    | `color.brand.600`, `space.4`, `radius.md` |
| Semantic  | `tokens/semantic/{light,dark,hc}.json` | `color.accent.default`, `color.fg.muted`  |
| Component | `tokens/component/`                    | `button.primary.bg`, `field.border`       |

## Build

```bash
npm run tokens:build        # or: nx run tokens:tokens
```

Outputs (generated, do not edit) into `src/generated/`:

- `css/_primitives.css` — primitive layer (`:root`, raw values)
- `css/theme-{light,dark,hc}.css` — semantic + component layers as `var()` chains, scoped to `[data-theme]`
- `ts/tokens.ts` — typed `tokens` map + `token()` helper

## Usage

```ts
import { token, cssVarName } from '@lumina/tokens';

token('color.bg.canvas'); // 'var(--lui-color-bg-canvas)'
cssVarName('color.fg.default'); // '--lui-color-fg-default'
```

```css
@import '@lumina/tokens/styles'; /* installs all theme layers */
```
