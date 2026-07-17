# Lumina UI Product Plan

> **Product direction:** Lumina UI is a modern, accessible design-system platform. Its public
> website is the product's front door, documentation hub, and live proof that the components work.

## 1. Product promise

Lumina helps product teams build consistent interfaces without giving up their framework, theme, or
Tailwind workflow. It provides one visual and accessibility contract, then exposes that contract
through native framework packages and first-class documentation.

### Who it is for

| Audience             | Need                                     | Lumina outcome                                                       |
| -------------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| Product engineers    | Ship familiar, accessible UI quickly     | Clear installation, composable components, copyable examples         |
| Design-system teams  | Keep visual decisions consistent         | DTCG tokens, themes, documented component standards                  |
| Designers            | See implementation behaviour and states  | Live examples, state coverage, do/don't guidance                     |
| Technical evaluators | Understand quality and architecture fast | A polished landing page, transparent roadmap, verified quality gates |

### Non-negotiable principles

- **Framework-neutral contract; native implementations.** Tokens, component specifications, icons,
  accessibility rules, and examples are shared. Angular, React, and Vue components are implemented
  idiomatically for their runtimes; no Web Component wrapper is presented as a false universal API.
- **Tailwind-friendly, never Tailwind-required.** Every package works through generated CSS variables.
  A Tailwind preset/plugin maps Lumina tokens to utilities for teams that choose Tailwind.
- **Accessible by default.** WCAG 2.2 AA, keyboard behaviour, reduced motion, and high-contrast
  support are product requirements, not documentation afterthoughts.
- **Documentation is part of the release.** A component is not release-ready until its docs,
  examples, a11y notes, API data, Storybook story, and tests are complete.

## 2. Product shape

```text
lumina-ui.com
|- /                         Landing: value, proof, quick start, ecosystem
|- /docs                     Learn: guides, design foundations, component reference
|- /components               Browse: searchable component catalogue
|- /playground               Try: live props, themes, responsive view, code
|- /theme-studio             Create: visual theme editor and export
|- /changelog                Trust: versions and migration notes
`- /roadmap                  Direction: public delivery plan

Shared product contract
|- @lumina/tokens            DTCG source -> CSS variables, JSON, typed maps
|- @lumina/icons             Framework-neutral SVG/icon data
|- @lumina/tailwind          Preset/plugin built from generated token output
|- @lumina/angular           Angular adapter (current flagship)
|- @lumina/react             React adapter
|- @lumina/vue               Vue adapter
`- @lumina/next              Optional React SSR, RSC, and style helpers for Next.js
```

**Important:** Next.js support is delivered through `@lumina/react` plus a small `@lumina/next`
integration package. It is not a fourth independent component set.

## 3. Website experience

### Landing page

The landing page should feel editorial and product-led: a dark/light adaptive hero, a working
component composition, clear framework badges, and a one-minute path to installation. It answers
four questions in the first viewport: what Lumina is, why it is reliable, which frameworks it
supports, and how to try it.

Sections: hero and install command; live theme preview; design-token proof; component-quality proof;
framework and Tailwind integrations; accessibility promise; component catalogue; links to docs,
playground, and roadmap.

### Documentation shell

Use the existing Angular application as the initial documentation host so the first release proves
the Angular package in production. The shell has a persistent top bar, contextual left navigation,
on-page table of contents, theme switcher, and searchable content index. On mobile, the sidebars
become drawers and code blocks remain horizontally scrollable.

Every implementation example has an **Angular / React / Vue / Next / Tailwind** tab. Tabs are
enabled only when that adapter is released; unreleased tabs are visibly labelled rather than showing
invented code.

### Component documentation page

Every component page uses the same predictable order:

1. Purpose and status
2. Live preview with controls and copyable source
3. Usage guidance and variants
4. Accessibility and keyboard behaviour
5. API reference generated from structured metadata
6. Framework examples and Tailwind composition guidance
7. Do / don't guidance, related components, and changelog notes

The complete authoring and acceptance template is in
[COMPONENT_DOCUMENTATION_STANDARD.md](./COMPONENT_DOCUMENTATION_STANDARD.md).

## 4. Technical architecture and package sequence

The current Nx monorepo is retained while the product is validated. The initial public site lives in
`apps/playground`, which evolves into the documentation platform; a separate `apps/docs` app is
created only if deployment, bundle ownership, or release cadence makes that separation valuable.

| Layer   | Current role                           | Product evolution                                                                                   |
| ------- | -------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Tokens  | DTCG + Style Dictionary outputs        | Add JSON and Tailwind-compatible generated outputs; preserve CSS variables as the portable contract |
| Theme   | Angular runtime theme service          | Specify theme semantics independently; add React/Vue bindings per adapter                           |
| UI      | Angular components                     | Rename/package as `@lumina/angular`; maintain source-level parity specifications                    |
| Docs    | Markdown design documents + playground | Add structured content manifests, generic renderer, live examples, and search index                 |
| Testing | Vitest, Playwright, Storybook          | Add cross-adapter contract tests, axe checks, visual regression, and documentation coverage checks  |

### Adapter policy

1. A new framework adapter starts only after the five flagship components meet the shared
   specification in Angular.
2. Each adapter owns its own interaction implementation and framework-specific tests.
3. Every release is measured against the same component contract: variants, DOM semantics,
   keyboard interactions, theming, and documentation examples.
4. Tailwind support validates generated classes against tokens; it does not leak Tailwind as a
   runtime dependency into framework packages.

## 5. Delivery plan

| Phase                 | Outcome                                                   | Exit criteria                                                                         |
| --------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 0. Product foundation | Product naming, package policy, doc model, release policy | This plan and documentation standard approved; scope is visible                       |
| 1. Public foundation  | Premium landing page and documentation shell              | Responsive routes, search index, theme switcher, a11y baseline, analytics decision    |
| 2. Flagship docs      | Button, Input, Badge, Avatar, Card reference pages        | Each page meets the documentation checklist and has runnable examples                 |
| 3. Component lab      | Playground integrated with source copying and controls    | Props, themes, viewport, a11y state, and code output work for flagship components     |
| 4. Token portability  | Publishable token JSON/CSS plus Tailwind package          | Angular and a small Tailwind sample consume identical generated values                |
| 5. React and Next     | React flagship adapter plus Next SSR integration          | Contract suite passes for five flagship components; Next starter renders without FOUC |
| 6. Vue                | Vue flagship adapter                                      | Same contract suite and docs tabs pass for five flagship components                   |
| 7. Platform depth     | Theme Studio, dashboard, extended components              | Visual regression, release notes, and contributor workflow are automated              |

### First implementation slice

Build the public documentation shell and landing route first, then fully document **Card** alongside
the current Claude work. Card is a good vertical slice because it exposes surface, elevation,
composition, responsive behaviour, theming, and interactive accessibility in one place.

## 6. Release definition

A component can be labelled **stable** only when all items below are true:

- It implements the shared component specification and uses only Lumina tokens for visual values.
- Its API, variants, states, forms behaviour (when applicable), and keyboard behaviour are tested.
- It passes automated accessibility checks and manual keyboard/screen-reader smoke checks.
- It has a Storybook story and a complete documentation page with working, copyable examples.
- Angular, React, Vue, and Next documentation indicate the real support status.
- The changelog documents breaking changes and migration instructions.

## 7. Measures of success

| Measure                              | V1 target                                                                |
| ------------------------------------ | ------------------------------------------------------------------------ |
| Flagship documentation coverage      | 5 / 5 complete                                                           |
| Keyboard and automated a11y coverage | 100% of interactive flagship examples                                    |
| Documentation example verification   | 100% rendered in CI                                                      |
| Initial landing performance          | LCP under 2.5s on a representative mobile test                           |
| Adapter parity                       | 100% of flagship component contract cases pass per released adapter      |
| Developer path                       | A new Angular user reaches a themed Button example in under five minutes |

## 8. Explicit non-goals for V1

- Rebuilding every existing extended component in three frameworks before proving the flagship set.
- Requiring Tailwind, React, Vue, or Next in the Angular package.
- Marketing support for adapters before a real package, test suite, and docs exist.
- A monorepo structural migration while the public product shape is still being validated.
