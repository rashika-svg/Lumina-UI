# Design principles

Every Lumina component is held to the same bar. These are the rules — borrowed from the best of
Angular Material, Microsoft Fluent UI and IBM Carbon — that make the system consistent, accessible
and maintainable.

## 1. Tokens, never hard-codes

No component contains a raw colour, pixel value, shadow or duration. Everything references a design
token (`var(--lui-…)`). This is what lets a single theme swap restyle the whole system, and it is
the first thing reviewed in any PR.

## 2. Accessibility is non-negotiable (WCAG 2.2 AA)

- Build on **native elements** wherever possible (`button[luiButton]`, real `<input>`), so platform
  keyboard and AT semantics come for free.
- Provide correct ARIA: `role`, `aria-checked`, `aria-invalid`, `aria-describedby`, `aria-busy`.
- Visible **focus-visible** rings on keyboard focus only.
- Every interactive control is fully operable by keyboard.
- A dedicated **high-contrast** theme and **reduced-motion** support ship by default.

## 3. Signals first, OnPush always

Components use `ChangeDetectionStrategy.OnPush`, signal `input()` / `model()` APIs, and `computed`
derivations. No `@Input` decorators, no manual change detection, no `NgZone` gymnastics.

## 4. Self-contained, themeable styles

Component CSS is scoped and self-contained so the library works without requiring consumers to run a
particular CSS toolchain. Variants and sizes are expressed through `data-*` attributes mapped to
local custom properties, which makes per-instance overrides trivial.

## 5. Predictable, typed APIs

- Inputs are strongly typed unions (`ButtonVariant`, `BadgeAppearance`), not loose strings.
- Boolean inputs use `booleanAttribute` so `<button luiButton disabled>` works like the platform.
- Form controls implement `ControlValueAccessor` and work with both template-driven and reactive
  forms, including `setDisabledState`.

## 6. Every component ships complete

A component is "done" only when it has: accessibility, keyboard support, dark + high-contrast
theming, responsive behaviour, loading/disabled/error states (where relevant), variants, sizes,
unit tests, and documentation.

## 7. Composability over configuration

Prefer content projection and small composable pieces over giant configuration objects. A button is
a button; icons, spinners and labels are projected in.

## 8. Performance by default

Tree-shakeable standalone components, OnPush change detection, CSS-variable theming (no runtime
style recalculation), and `nx affected` so the toolchain only does work that's needed.
