# Architecture

Lumina UI is structured as a layered Nx monorepo. Each layer has a single responsibility and may
only depend on the layers beneath it. The boundaries are not a convention — they are **enforced at
lint time** by `@nx/enforce-module-boundaries`, so an accidental upward or cyclic dependency fails CI.

## Layered dependency graph

```
            ┌─────────────────────────────────────────┐
 apps  ───▶ │ playground · playground-e2e              │  type:app
            └─────────────────────────────────────────┘
                         │ may depend on everything
            ┌────────────┴───────────┐
            ▼                        ▼
        type:ai ───▶ type:ui ───▶ type:theme ───▶ type:tokens
                        │              │
                        ▼              ▼
                    type:icons      type:util
        type:testing ─▶ ui / theme / tokens / util
```

Every library is tagged with a `type:*` tag in its `project.json`. The constraints
(see [`eslint.config.mjs`](../eslint.config.mjs)) read roughly:

| Layer          | May depend on                                  |
| -------------- | ---------------------------------------------- |
| `type:tokens`  | _nothing_ — the absolute foundation            |
| `type:util`    | `util`                                         |
| `type:icons`   | `icons`, `util`                                |
| `type:theme`   | `theme`, `tokens`, `util`                      |
| `type:ui`      | `ui`, `theme`, `icons`, `tokens`, `util`       |
| `type:ai`      | `ai`, `ui`, `theme`, `icons`, `tokens`, `util` |
| `type:testing` | `testing`, `ui`, `theme`, `tokens`, `util`     |
| `type:app`     | everything                                     |

This guarantees, for example, that `tokens` can never import from `ui`, keeping the foundation
framework-agnostic and independently publishable.

## The design-token pipeline

Tokens are the single source of truth for every visual decision. They flow through three tiers:

```
primitive            semantic                 component
blue-600       →     color.accent.default  →  button.primary.bg
neutral-900    →     color.fg.default      →  field.fg
```

- **Primitive** tokens (`libs/tokens/tokens/primitive`) are raw, context-free values — colour
  palettes, the spacing grid, the type scale, elevation, motion, z-index, breakpoints.
- **Semantic** tokens (`libs/tokens/tokens/semantic/{light,dark,hc}.json`) assign _meaning_
  (`bg.canvas`, `fg.muted`, `accent.default`). Each theme defines the **same token names** with
  different primitive references — this is what makes runtime theming possible.
- **Component** tokens (`libs/tokens/tokens/component`) bind semantics to a specific component
  (`button.primary.bg → color.accent.default`), giving a single, documented override point.

[`build-tokens.mjs`](../libs/tokens/scripts/build-tokens.mjs) compiles the DTCG source with
**Style Dictionary** into:

1. `_primitives.css` — the primitive layer in `:root` with raw values.
2. `theme-{light,dark,hc}.css` — semantic + component layers emitted with `outputReferences`, so
   they compile to live `var(--lui-…)` chains scoped to `[data-theme="…"]`.
3. `tokens.ts` — a typed, frozen `tokens` map (`token('color.bg.canvas') → 'var(--lui-color-bg-canvas)'`).

Because semantic tokens are `var()` references to primitives, switching `data-theme` re-points the
entire cascade with **no JavaScript re-styling and no component re-render**.

## The theme engine

[`ThemeService`](../libs/theme/src/lib/theme.service.ts) is a signal-based, SSR-safe service that:

- tracks the user's `mode` (`light | dark | hc | system | <custom>`) and resolves `system` against
  `prefers-color-scheme`;
- reflects the resolved theme onto `<html data-theme>` via an `effect`;
- exposes a reactive `prefersReducedMotion` signal and mirrors it to `data-reduced-motion`;
- supports **custom themes** as token overrides on a base theme, injected as a generated
  `[data-theme-variant]` stylesheet;
- persists the choice to `localStorage` and supports `exportThemes()` / `importThemes()`.

`provideLuminaTheme()` wires it into application bootstrap and eagerly initialises it so the correct
theme is applied before first paint. `themeInitScript()` provides an optional inline snippet to
eliminate any flash of the wrong theme.

## Component conventions

See [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md). In short: standalone, `OnPush`, signal inputs,
native-semantics selectors, ARIA-correct, token-driven self-contained CSS, and reduced-motion aware.

## Testing strategy

- **Unit / component** — Vitest via the AnalogJS Angular plugin, using Angular `TestBed`. Form
  controls are tested through real `FormControl` / `ngModel` bindings to exercise the
  `ControlValueAccessor` contract.
- **E2E** — Playwright against the playground, covering theme switching and keyboard accessibility.
- **CI** — `nx affected` runs lint, test, build, typecheck and e2e only for projects touched by a
  change, keeping pipelines fast as the system grows.
