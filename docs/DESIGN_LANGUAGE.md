# Lumina UI — Design Language

> The visual system. Every value below is a **design token**; components consume tokens, never raw
> values. This document is the contract that makes the platform feel like a premium product
> (Material 3 · Fluent · Linear · Stripe) rather than a documentation website.

## Principles

- **Depth, not flatness.** Layered surfaces + a real elevation scale. No large flat white areas.
- **Everything token-driven.** No hard-coded color, size, shadow, or duration in any component.
- **Perceptual color.** Colors are authored in **OKLCH** for uniform lightness and accessible contrast.
- **Purposeful motion.** Motion communicates state and hierarchy; never decoration.
- **Premium by default.** Full interaction-state coverage, refined focus, tactile feedback.

## 1. Color — OKLCH

Colors are authored in the **OKLCH** color model (`oklch(L C H)`): perceptually-uniform lightness,
predictable chroma, and hue stability across a ramp. Semantic tokens are generated from the primitive
OKLCH ramps.

- **Primitive ramps** (`50 … 950`) for `neutral`, `brand`, `success`, `warning`, `danger`, `info`.
  Lightness decreases monotonically down the ramp; chroma peaks mid-ramp — the OKLCH property that
  keeps mid-tones vivid and end-tones calm.
- **Semantic tokens** map intent → primitive (`color.accent.default`, `color.fg.muted`, …).
- **Theme Studio** (P5) generates a full tonal ramp from a single OKLCH **seed** and writes it live to
  CSS variables — the perceptual model is what makes single-seed theming produce accessible results.

Why OKLCH over HSL/hex: equal lightness steps _look_ equal, hue does not shift when adjusting
lightness, and contrast is far more predictable — the foundation of accessible dynamic theming.

## 2. Surface system

Named, intentional surfaces — **never** `bg1 / bg2 / bg3`. In **dark mode surfaces get tonally
lighter with elevation** (Material 3 tonal elevation), not merely a heavier shadow.

| Token              | Role                    | Light      | Dark (tonal) |
| ------------------ | ----------------------- | ---------- | ------------ |
| `surface.canvas`   | app background          | neutral-50 | neutral-950  |
| `surface.default`  | base content surface    | white      | neutral-900  |
| `surface.raised`   | cards, raised panels    | white      | neutral-800  |
| `surface.overlay`  | dropdowns, popovers     | white      | neutral-800  |
| `surface.floating` | drawers, nav, toasts    | white      | neutral-800  |
| `surface.dialog`   | modals, command palette | white      | neutral-800  |

In light mode, layering reads through **elevation shadow**; in dark mode through **tonal lift +
hairline border**. Every screen composes at least two surfaces so nothing reads as flat.

## 3. Elevation system (0–5)

Each level is a **composite** of shadow + border + surface treatment, exposed as component tokens
(`elevation.{n}.shadow`, `elevation.{n}.border`, `elevation.{n}.surface`):

| Level | Use                  | Shadow       | Border   | Surface  |
| ----- | -------------------- | ------------ | -------- | -------- |
| **0** | flush / canvas       | none         | none     | canvas   |
| **1** | inputs, flat cards   | `shadow.xs`  | hairline | default  |
| **2** | cards, sticky header | `shadow.sm`  | hairline | raised   |
| **3** | dropdowns, popovers  | `shadow.md`  | hairline | overlay  |
| **4** | drawers, nav rail    | `shadow.lg`  | subtle   | floating |
| **5** | dialogs, palette     | `shadow.2xl` | subtle   | dialog   |

Interactive elements transition **up one level on hover** (see motion). Dark-mode borders are a
translucent-white outline; light-mode borders are neutral hairlines.

## 4. State-layer system

Every interactive surface carries a translucent **state layer** rendered as an overlay in
`currentColor` (so it auto-adapts to any variant):

| State             | Overlay opacity            | Notes                             |
| ----------------- | -------------------------- | --------------------------------- |
| rest              | 0                          | —                                 |
| **hover**         | `state.hover` = 0.08       | + elevation lift where applicable |
| **focus-visible** | hover layer + `focus.ring` | keyboard only                     |
| **pressed**       | `state.pressed` = 0.12     | subtle depression                 |
| **disabled**      | `opacity.disabled` = 0.4   | no layer, no pointer events       |

`background: currentColor; opacity: var(--lui-state-hover)` yields the Material state layer that is
correct on primary (white text → light overlay) and on ghost/secondary (dark text → dark overlay)
automatically.

## 5. Typography roles

Role-based scale (Material 3 / Linear editorial feel — not stock Angular Material). Each role is a
token group of `size · line-height · weight · tracking`:

| Role         | Size      | Line | Weight | Tracking | Use                        |
| ------------ | --------- | ---- | ------ | -------- | -------------------------- |
| `display-lg` | 3.5rem    | 1.05 | 700    | -0.02em  | hero                       |
| `display-md` | 2.75rem   | 1.1  | 700    | -0.02em  | landing sections           |
| `heading-xl` | 2rem      | 1.15 | 650    | -0.015em | page titles                |
| `heading-lg` | 1.5rem    | 1.2  | 650    | -0.01em  | section headings           |
| `heading-md` | 1.25rem   | 1.3  | 600    | -0.005em | subsections, card titles   |
| `body-lg`    | 1.0625rem | 1.6  | 400    | 0        | lead paragraphs            |
| `body-md`    | 0.9375rem | 1.6  | 400    | 0        | default prose / UI         |
| `body-sm`    | 0.8125rem | 1.5  | 400    | 0        | secondary text             |
| `caption`    | 0.75rem   | 1.4  | 500    | 0.01em   | metadata, hints            |
| `code`       | 0.8125rem | 1.6  | 400    | 0        | inline + block code (mono) |

Delivered as tokens (`--lui-type-heading-lg-size`, …) and a `<lui-text variant="…">` primitive / utility classes.

## 6. Motion system

Meaningful motion only; always `prefers-reduced-motion`-safe.

**Durations:** `duration-fast` 120ms · `duration-normal` 200ms · `duration-slow` 320ms
(plus `instant` 0ms, `slower` 480ms for large transforms).

**Easings:** `easing-standard` `cubic-bezier(0.2,0,0,1)` · `easing-emphasized` `cubic-bezier(0.05,0.7,0.1,1)`
· `easing-decelerate` `cubic-bezier(0,0,0,1)` · `easing-accelerate` `cubic-bezier(0.3,0,1,1)`.

| Named motion        | Duration · Easing   | Applied to                     |
| ------------------- | ------------------- | ------------------------------ |
| micro (state layer) | fast · standard     | hover / press feedback         |
| elevation change    | normal · emphasized | cards / buttons lifting        |
| fade-through        | normal · standard   | content swaps                  |
| container transform | slow · emphasized   | dialog / drawer / palette open |

## 7. Component quality bar

Every interactive component ships **rest · hover · focus-visible · pressed · disabled · loading**,
each honoring the state-layer + elevation + motion systems. Flagship specifics:

- **Button** — elevation lift on hover, press depression, state layers, leading/trailing icon slots,
  spinner/progress, refined focus ring.
- **Input** — floating label, animated focus ring, helper / error / counter, icon slots, validation.
- **Card** — elevation-on-hover, header / media / body / footer, interactive & link variants.
- **Table** (extended) — sticky header, sort, selection + bulk-action bar, column visibility,
  skeleton + empty states.

## 8. Premium details (built once, used everywhere — `shared/`)

Skeleton loaders · thoughtful empty states · polished tooltips · refined focus rings · smooth scroll
with anchor scroll-margin · professional iconography · syntax-highlighted code blocks with copy ·
contextual help.

## 9. The quality gate

Before any screen ships, it must pass _"would this look at home inside Linear / Stripe / Arc /
Fluent?"_ — layered surfaces (no flat white) · role-based type hierarchy · all color from tokens ·
full interaction-state set · purposeful, reduced-motion-safe motion · spacing on the 4px grid ·
verified AA contrast.
