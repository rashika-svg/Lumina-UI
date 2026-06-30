# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/) and the project adheres to
[Semantic Versioning](https://semver.org/). Releases are generated from
[Conventional Commits](https://www.conventionalcommits.org/) via `nx release`.

## [Unreleased]

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
- **Tooling** — ESLint (with module-boundary rules), Prettier, Husky, Commitlint, lint-staged, and a
  Nx-affected GitHub Actions CI pipeline.
