# Roadmap

Lumina UI is a **design system platform** (see [PLATFORM_STRATEGY.md](./docs/PLATFORM_STRATEGY.md)
and [DESIGN_LANGUAGE.md](./docs/DESIGN_LANGUAGE.md)). Angular is the V1 implementation; the
foundation is framework-neutral so other frameworks can follow.

## ✅ Foundation (done)

- [x] Nx workspace, quality tooling (ESLint, Prettier, Husky, Commitlint, CI)
- [x] DTCG design tokens → Style Dictionary → themed CSS variables + typed TS map
- [x] Theme engine: light / dark / high-contrast, system resolution, reduced motion, custom themes
- [x] 18 components built + tested (5 flagship + 13 extended) with Storybook stories

## 🟡 P1 — Design Language Foundation (current)

Elevating the visual system to premium quality; validating before any structural migration.

- [ ] Colors authored in **OKLCH**
- [ ] **Surface system** (canvas / default / raised / overlay / floating / dialog)
- [ ] **Elevation system 0–5** (shadow + border + surface per level)
- [ ] **State-layer system** (hover / focus / pressed / disabled)
- [ ] **Typography roles** (display / heading / body / caption / code)
- [ ] **Motion tokens** (durations + easings, purposeful)
- [ ] Re-skin **Button · Input · Badge · Avatar** as proof of concept

## ⬜ P2 — Documentation Platform

Docs shell (top nav · sidebar · TOC · search) · per-component doc standard · Getting Started,
Design Principles, Accessibility, Tokens (live reference), Theming, Contributing, Roadmap, Changelog.

## ⬜ P3 — Flagship Components

Button, Input, Badge, Avatar, **Card** to the exceptional bar, each fully documented.

## ⬜ P4 — Playground

Live preview · property controls · theme + responsive + accessibility preview · code output.

## ⬜ P5 — Theme Studio

OKLCH seed → tonal palette → instant live update · typography / radius / spacing / shadow controls ·
theme export / import / presets.

## ⬜ P6 — Dashboard & Search

Design-system metrics (components / tokens / themes / coverage) · ⌘K global search.

## ⬜ P0 — Structural migration (deferred by design)

Collapse Nx → single Angular app with the `src/` structure — executed **only after** the design
language, tokens, component standards, and documentation structure are validated.

## 🔭 Future (V2 / V3)

- **V2:** AI playground (NL → UI) · document the extended component set · theme presets · ⌘K ·
  automated a11y (axe) + visual regression · auto-generated API reference.
- **V3:** headless behavior core · React / Vue / Svelte / Next / Nuxt adapters · Figma two-way sync ·
  hosted theme sharing · versioned docs.

## Component status

**Flagship (P1/P3 focus):** Button · Input · Badge · Avatar · Card _(Card: not yet built)_
**Extended (parked, documented in V2):** Switch · Tag · Tabs · Accordion · Dialog · Drawer · Menu ·
Toast · Breadcrumb · Pagination · Table · Command Palette · Tree · Kanban
