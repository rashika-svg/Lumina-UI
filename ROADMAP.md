# Roadmap

Lumina UI is built in phases. Each component is only considered complete when it meets every bar in
the [design principles](docs/DESIGN_PRINCIPLES.md) (a11y, theming, states, variants, tests, docs).

## ✅ Foundation (done)

- [x] Nx monorepo with enforced layered architecture (7 libraries)
- [x] DTCG design tokens → Style Dictionary → themed CSS variables + typed TS map
- [x] Theme engine: light / dark / high-contrast, system resolution, reduced motion, custom themes, persistence, export/import
- [x] Quality tooling: ESLint, Prettier, Husky, Commitlint, lint-staged, GitHub Actions CI
- [x] Interactive playground with live theme switching

## 🟡 Phase 1 — Core components (in progress)

- [x] Button
- [x] Badge
- [x] Avatar
- [x] Input
- [x] Switch
- [ ] Textarea
- [ ] Checkbox
- [ ] Radio
- [ ] Select
- [ ] Tag
- [ ] Tooltip

## ✅ Phase 2 — Composite & overlay (complete)

- [x] Tabs (ARIA tablist, roving tabindex)
- [x] Accordion (single / multiple disclosure)
- [x] Dialog / Modal (focus trap, scrim, Escape, scroll lock)
- [x] Drawer (edge-anchored overlay, shared focus-trap)
- [x] Dropdown / Menu (ARIA menu, keyboard nav, outside-click dismissal)
- [x] Toast (injectable service + ARIA live region)
- [x] Breadcrumb
- [x] Pagination (with ellipsis truncation)

## 🟡 Phase 3 — Data & power-user (in progress)

- [x] Data Table (generic, sortable, selectable, sticky header, loading/empty states)
- [x] Command Palette (⌘K, fuzzy search, keyboard navigation)
- [x] Tree View (ARIA tree, keyboard navigation, selection)
- [x] Kanban Board (drag-and-drop + keyboard move)
- [ ] Data Grid (virtualised, editable cells)
- [ ] File Explorer

## ⬜ Phase 4 — Visualisation

Charts · Dashboard Widgets · Analytics Cards · Timeline · Activity Feed

## ⬜ Platform features

- [x] Storybook documentation site with interactive controls, a theme toolbar and the a11y addon
- [ ] Expand Storybook with MDX docs pages and visual regression snapshots
- [ ] Tailwind v4 token-mapped preset for application authors
- [ ] Icon library (`@lumina/icons`)
- [ ] AI playground — natural-language → UI generation (`@lumina/ai`)
- [ ] CLI generators for scaffolding components and custom themes
- [ ] Visual regression tests (Playwright snapshots)
- [ ] Publishable packages via `nx release` with automated changelogs
- [ ] Figma Tokens sync
