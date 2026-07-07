# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/) and the project adheres to
[Semantic Versioning](https://semver.org/). Releases are generated from
[Conventional Commits](https://www.conventionalcommits.org/) via `nx release`.

## [Unreleased]

### Changed — Design Language Foundation (platform pivot)

- **Product direction:** Lumina UI is now a **design system platform** (docs · tokens · components ·
  playground · theme studio). Source of truth: [PLATFORM_STRATEGY.md](docs/PLATFORM_STRATEGY.md) and
  [DESIGN_LANGUAGE.md](docs/DESIGN_LANGUAGE.md).
- **OKLCH color model** — all primitive colors re-authored in `oklch()` for perceptual uniformity and
  accessible, predictable ramps (foundation for single-seed theme generation).
- **Surface system** — named tonal surfaces (`surface.canvas/default/raised/overlay/floating/dialog`)
  that lighten with elevation in dark mode.
- **Elevation system (0–5)** — composite `elevation.{n}.{shadow,border,surface}` tokens.
- **State-layer system** — `currentColor` hover/pressed overlays that adapt to every variant.
- **Typography roles** — `display / heading / body / caption / code` scale tokens.
- **Flagship re-skin** — Button (elevation lift + press + state layers + outline focus ring), Input
  (floating label + animated focus + character counter), Badge and Avatar upgraded to the new system.

### Added

- **Monorepo foundation** — Nx workspace (Angular 21, TypeScript 5.9) with seven layered libraries
  and a strictly enforced, acyclic dependency graph.
- **Design tokens** (`@lumina/tokens`) — three-tier DTCG token architecture (primitive → semantic →
  component) compiled by Style Dictionary into themed CSS variables and a typed TypeScript token map.
- **Theme engine** (`@lumina/theme`) — signal-based `ThemeService` with light/dark/high-contrast
  themes, `prefers-color-scheme` resolution, reduced-motion awareness, runtime custom themes,
  persistence and export/import; `provideLuminaTheme()` and `themeInitScript()`.
- **Components** (`@lumina/ui`) — Button, Badge, Avatar, Input and Switch, all accessible, OnPush,
  signal-first and token-driven; Input and Switch implement `ControlValueAccessor`.
- **Playground** — interactive showcase with a live theme switcher.
- **Storybook** — component documentation for `@lumina/ui` with a theme toolbar (light/dark/high
  contrast), interactive controls, autodocs and the accessibility addon.
- **Phase 2 components** (`@lumina/ui`) — Tabs (ARIA tablist + roving tabindex), Accordion
  (single/multiple disclosure), Dialog/Modal (focus trap, scrim, Escape, scroll lock, focus
  restoration), Drawer (edge-anchored overlay), Dropdown/Menu (ARIA menu with keyboard navigation
  and outside-click dismissal), Toast (injectable `ToastService` + ARIA live-region `ToastOutlet`),
  Breadcrumb and Pagination (with ellipsis truncation). Dialog and Drawer share an internal
  focus-trap helper. Each component ships unit tests and Storybook stories and is showcased in the
  playground.
- **Phase 3 components** (`@lumina/ui`) — a generic, accessible **Data Table** (column-driven config,
  click-to-sort with `aria-sort`, row selection with select-all, sticky header, loading/empty
  states) and a **Command Palette** (the ⌘K pattern: fuzzy search, keyboard navigation, ARIA
  combobox/listbox). Both ship unit tests and Storybook stories; the playground wires ⌘K / Ctrl+K to
  open the palette.
- **Tree View & Kanban Board** (`@lumina/ui`) — an accessible **Tree** (WAI-ARIA tree with
  expand/collapse, roving tabindex, full keyboard navigation and optional selection) and a **Kanban**
  board (native HTML5 drag-and-drop with a Ctrl/⌘ + Arrow keyboard move fallback). Both ship unit
  tests, Storybook stories and playground demos.
- **Tooling** — ESLint (with module-boundary rules), Prettier, Husky, Commitlint, lint-staged, and a
  Nx-affected GitHub Actions CI pipeline.
