# Lumina UI — Platform Strategy

> **Source of truth** for what Lumina UI is, how it is structured, and where it is going.
> Companion documents: [DESIGN_LANGUAGE.md](./DESIGN_LANGUAGE.md) (visual system) and [ROADMAP.md](../ROADMAP.md).

## What Lumina UI is

Lumina UI is a **design system _platform_**, not a component library. It is the combination of a
documentation site, a token system, a component library, an interactive playground, and a visual
theme studio — the kind of internal platform a world-class design-systems team ships.

Angular is the **V1 implementation**. The architecture keeps the _source of truth_
(design tokens, themes, design + a11y specifications) framework-neutral so React / Vue / Svelte
implementations can be added later without re-architecting.

The component library is **one consumer** of the design system — not the product itself.

## The five products

| Product                       | Purpose                                              | Inspiration                         |
| ----------------------------- | ---------------------------------------------------- | ----------------------------------- |
| **1. Documentation Platform** | Teach developers to use Lumina; establish standards  | Angular.dev, Tailwind, Material 3   |
| **2. Design Token System**    | The foundation every visual decision derives from    | Style Dictionary, Material 3, Radix |
| **3. Component Library**      | A polished Angular implementation (a token consumer) | Material 3, Fluent, Radix, Linear   |
| **4. Playground**             | A professional component laboratory                  | Storybook, Shadcn                   |
| **5. Theme Studio**           | Visual, OKLCH-based theme generation                 | Premium SaaS (Linear, Stripe)       |

## 1. Product roadmap

| Phase                                           | Delivers                                                                                                                        | Theme                  |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **P0 — Restructure** _(deferred)_               | Collapse Nx → single app + `src/`; done only after the foundation is validated                                                  | Infrastructure         |
| **P1 — Design Language Foundation** _(current)_ | OKLCH tokens, surfaces, elevation 0–5, state layers, typography roles, motion; re-skin Button / Input / Badge / Avatar as proof | Premium foundation     |
| **P2 — Documentation Platform**                 | Docs shell + per-component doc standard + Getting Started, Principles, A11y, Tokens, Theming                                    | Documentation-first    |
| **P3 — Flagship Components**                    | Button, Input, Badge, Avatar, **Card** to the exceptional bar, fully documented                                                 | Quality over quantity  |
| **P4 — Playground**                             | Live preview, prop controls, theme/responsive/a11y preview, code output                                                         | Component lab          |
| **P5 — Theme Studio**                           | OKLCH seed → tonal palette → instant live update → export                                                                       | Visual theming         |
| **P6 — Dashboard & Search**                     | Design-system metrics dashboard; ⌘K global search                                                                               | Internal platform feel |

## 2. Information architecture

```
Lumina UI (shell: top nav · global search · theme switcher)
├─ /                    Landing
├─ /docs
│   ├─ /getting-started   Introduction · Installation · Quick start
│   ├─ /design            Design Principles · Design Language · Motion
│   ├─ /accessibility     Philosophy · standards · testing
│   ├─ /tokens            Architecture + live token reference
│   ├─ /theming           Themes · custom themes · dark / high-contrast
│   ├─ /components         Overview grid → per-component pages
│   ├─ /contributing · /roadmap · /changelog
├─ /playground          Component laboratory
├─ /theme-studio        Visual theme generator
└─ /dashboard           Design-system health metrics
```

Navigation: persistent **top bar** + contextual **left sidebar** (Docs) + on-page **right TOC**.

## 3. Documentation architecture

Docs are **structured content, not one-off pages**. Each component has a doc manifest + MDX/markdown
content rendered by a generic doc renderer, which makes coverage measurable.

Per-component page standard (enforced): **Overview → Usage guidelines → Accessibility → API reference
→ Examples → Best practices (Do / Don't)**. Live examples are real components rendered via an
`<lui-example>` component (preview + source + copy).

**Storybook is a separate concern** — the component _development_ environment, not the docs site.

## 4. Design token architecture

Three DTCG tiers, compiled by Style Dictionary; **colors authored in OKLCH**. See
[DESIGN_LANGUAGE.md](./DESIGN_LANGUAGE.md) for the full specification.

```
Primitive            Semantic                     Component
oklch ramp step  →   color.accent.default     →   button.primary.bg
                     surface.raised               card.surface
                     type.heading-lg             elevation.3.shadow
```

Outputs: (a) themed CSS custom properties, (b) a typed TS token map, (c) raw JSON — the
**framework-neutral contract** future implementations and the Theme Studio consume.

## 5. Component roadmap

**MVP flagship set (V1):** Button, Input, Badge, Avatar, **Card** — each to the "exceptional" bar
(design spec · a11y spec · API docs · examples · states · variants · tests · story · doc page).

**Extended set (preserved, documented in V2):** Switch, Tag, Tabs, Accordion, Dialog, Drawer, Menu,
Toast, Breadcrumb, Pagination, Table, Command Palette, Tree, Kanban — already built and tested.

## 6. Folder structure (target, applied at P0)

```
src/
├─ app/            Platform shell + routing (core: header, sidebar, search, theme switcher)
├─ components/     Angular component implementations (+ _extended/ for the parked set)
├─ tokens/         DTCG source + Style Dictionary + generated (css / ts / json)
├─ themes/         Theme engine + presets
├─ docs/           Documentation platform (content/ + renderer/)
├─ playground/     Component laboratory
├─ theme-studio/   Visual theme generator
├─ dashboard/      Metrics
├─ shared/         Framework-neutral-ish utilities, a11y, directives
└─ styles/
.storybook/        Component dev environment (separate from docs)
```

> **Current status:** we remain on the Nx monorepo (`libs/*`, `apps/*`) during P1. The structure
> above is applied at **P0**, only after the design language, tokens, component standards, and doc
> structure are validated.

## 7. MVP scope (V1)

**In:** design-language token foundation · theme engine (light / dark / high-contrast) · platform
shell + global search · Documentation Platform with the standard template written for the 5 flagship
components + Getting Started / Principles / A11y / Tokens / Theming · 5 flagship components to the
exceptional bar · Playground · Theme Studio (OKLCH) · Dashboard · Storybook retained.

**Out (V2+):** AI generation · React / Vue / Svelte · theme hosting · Figma sync · versioned docs ·
documenting the extended set · ⌘K upgrade (basic search ships in V1).

## 8. Future roadmap

**V2 — Depth & intelligence:** AI playground (NL → UI, pluggable provider) · document the extended
set · theme export/import + presets · ⌘K command palette · automated a11y (axe) + visual regression ·
auto-generated API reference.

**V3 — Framework-agnostic platform:** extract a headless behavior core · `packages/react`,
`packages/vue`, Svelte/Next/Nuxt adapters consuming the same tokens/themes · Figma two-way sync ·
hosted theme sharing · versioned / multi-release docs · design-system lint for consumers.

## Recruiter goal

Opening Lumina UI should read as _"a real product built by someone who understands both engineering
and design systems"_ — architecture, documentation, scalability, accessibility, and developer
experience, not a typical frontend project.
