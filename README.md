<div align="center">

# ◇ Lumina UI

**An enterprise-grade Angular design system platform.**

Design tokens · runtime theming · accessible components · AI-assisted UI · built on a scalable Nx monorepo.

[![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)](.github/workflows/ci.yml)
[![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)](https://angular.dev)
[![Nx](https://img.shields.io/badge/Nx-monorepo-143055?logo=nx&logoColor=white)](https://nx.dev)
[![Tokens](https://img.shields.io/badge/Tokens-DTCG_+_Style_Dictionary-7C3AED)](https://styledictionary.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E.svg)](LICENSE)

</div>

---

Lumina UI is **not just a component library** — it is a complete frontend platform of the kind large
organisations build internally: a layered token pipeline, a runtime theme engine, accessible
signal-based Angular components, a living playground, and the developer-experience and quality
tooling that make a design system maintainable at scale.

It is built to demonstrate senior-level engineering across **frontend architecture, design-systems
engineering, accessibility, performance and developer experience** — the way a Staff Engineer at
Google, Microsoft or Atlassian would approach the problem.

## ✨ Highlights

| Area              | What's inside                                                                                                                                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Design tokens** | Three-tier architecture (primitive → semantic → component) authored in the [DTCG](https://tr.designtokens.org/) standard and compiled by **Style Dictionary** to themed CSS variables **and** a fully typed TypeScript token map.                    |
| **Theming**       | A signal-based **theme engine** with light, dark and high-contrast themes, OS `prefers-color-scheme` resolution, reduced-motion awareness, runtime **custom themes**, persistence and export/import — all via CSS variables with zero re-paint cost. |
| **Components**    | Accessible, OnPush, signal-first Angular 21 components. Native-semantics attribute selectors (`button[luiButton]`), full `ControlValueAccessor` form integration, and self-contained token-driven styles.                                            |
| **Accessibility** | WCAG 2.2 AA as the baseline: keyboard support, focus-visible rings, ARIA wiring, reduced-motion handling, and a dedicated high-contrast theme.                                                                                                       |
| **Architecture**  | An Nx monorepo with a strictly enforced, acyclic dependency graph (ESLint module boundaries) across seven libraries.                                                                                                                                 |
| **Quality**       | Vitest + Angular testing patterns, Playwright E2E, ESLint, Prettier, Husky, Commitlint and a Nx-affected GitHub Actions pipeline.                                                                                                                    |

## 🧱 Monorepo structure

```
lumina-ui/
├── apps/
│   ├── playground/        Interactive showcase + theme switcher (live integration)
│   └── playground-e2e/    Playwright end-to-end tests
└── libs/
    ├── tokens/            DTCG token source + Style Dictionary build → CSS vars & typed TS
    ├── theme/             Runtime theme engine (ThemeService, provideLuminaTheme)
    ├── ui/                Angular components (Button, Badge, Avatar, Input, Switch, …)
    ├── icons/             Icon set (scaffolded)
    ├── utilities/         Framework-agnostic helpers (scaffolded)
    ├── ai/                AI-assisted UI generation (scaffolded)
    └── testing/           Shared testing utilities (scaffolded)
```

The dependency graph is layered and enforced at lint time:

```
tokens ─▶ theme ─▶ ui ─▶ ai
   ▲        ▲       ▲
utilities ─┴────────┴──▶ testing        apps ─▶ (everything)
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full rationale.

## 🚀 Quick start

```bash
npm install

# Run the interactive playground
npm run playground            # → http://localhost:4200

# Rebuild design tokens (CSS variables + typed TS map)
npm run tokens:build

# Component documentation
npm run storybook             # Storybook for @lumina/ui (theme toolbar + a11y)

# Quality gates
npm test                      # Vitest unit/component tests
npm run lint                  # ESLint (incl. module-boundary rules)
npm run build                 # Build all projects
npm run e2e                   # Playwright end-to-end
npm run graph                 # Visualise the Nx project graph
```

## 🎨 Using the design system

```ts
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideLuminaTheme } from '@lumina/theme';

bootstrapApplication(App, {
  providers: [provideLuminaTheme({ defaultMode: 'system' })],
});
```

```css
/* styles.css — installs the primitive layer + every theme */
@import '@lumina/tokens/styles';
```

```html
<button luiButton variant="primary" size="md">Save</button>
<lui-input label="Email" type="email" [(ngModel)]="email" [error]="emailError()" />
<lui-switch label="Notifications" [(ngModel)]="enabled" />
```

```ts
// Switch themes at runtime
import { ThemeService } from '@lumina/theme';
const theme = inject(ThemeService);
theme.setMode('dark'); // 'light' | 'dark' | 'hc' | 'system'
theme.registerTheme({
  id: 'sunset',
  base: 'dark',
  overrides: { 'color.accent.default': '#ff5e3a' },
});
```

## 🧪 Tech stack

**Angular 21** · **TypeScript 5.9** · Angular **Signals** · **Nx** monorepo · **Style Dictionary**
(DTCG tokens) · **Vitest** + AnalogJS · **Playwright** · **ESLint** / **Prettier** / **Husky** /
**Commitlint** · **GitHub Actions**.

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) — layers, dependency graph, token pipeline, theming model
- [Design principles](docs/DESIGN_PRINCIPLES.md) — the rules every component follows
- [Contributing](CONTRIBUTING.md) — workflow, conventions, how to add a component
- [Roadmap](ROADMAP.md) — phased component plan and platform features
- [Changelog](CHANGELOG.md)

## 🗺️ Status

Phase 1 foundation is implemented and tested: token pipeline, theme engine, the
Button / Badge / Avatar / Input / Switch components, a live playground, and a Storybook with a
theme toolbar and accessibility addon. See the [roadmap](ROADMAP.md) for what's next.

## 📄 License

[MIT](LICENSE) © Lumina UI contributors
