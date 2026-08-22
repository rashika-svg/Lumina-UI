# Accessibility

Accessibility is a **product requirement** in Lumina, not a later pass. The
target is **WCAG 2.2 AA** as the baseline for every component, and the primitives
are built so that meeting it is the default rather than extra work.

This document records the conformance review of the component library. It is a
**code-level audit** — each component was reviewed against the relevant WCAG 2.2
success criteria and the WAI-ARIA Authoring Practices — and it lists the exact
mechanism each component relies on so the claims can be verified, not just
asserted.

Last reviewed: 2026-08-22.

## Built in at the foundation

- **Native semantics first.** Where a platform element already carries the right
  behaviour it is used directly — the Button decorates a real `<button>`/`<a>`,
  the Switch is a `<button role="switch">` — so keyboard, focus and role
  handling come from the browser.
- **Visible focus.** Every interactive element exposes a `:focus-visible` ring
  driven by the `--lui-color-focus-ring` token, consistent across themes.
- **Colour & contrast.** Colours are authored in OKLCH and the ramps are tuned so
  foreground/background pairs meet AA; a dedicated **high-contrast theme** raises
  it further. Status is never conveyed by colour alone.
- **Reduced motion.** All animation is gated behind `prefers-reduced-motion` —
  the spinner slows to a calm rotation, skeletons drop their shimmer, and
  transitions collapse.
- **Skip link.** The app shell provides a "skip to content" link as the first
  focusable element.

## Component conformance

| Component       | Status | Key mechanism (verified in source)                                                                                                     |
| --------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Button          | ✅ AA  | Native `<button>`/`<a>`; `aria-busy` while loading; disabled anchors use `aria-disabled` + `tabindex="-1"`; anchors activate on Space. |
| Input           | ✅ AA  | `<label for>`; `aria-invalid`; `aria-describedby` → hint/error; error is `role="alert"`; native `required`.                            |
| Switch          | ✅ AA  | `role="switch"` + `aria-checked`; `aria-label`/`aria-labelledby`; native button keyboard (Space/Enter).                                |
| Card            | ✅ AA  | Interactive cards get `role="button"`, `tabindex` and Enter/Space activation; nested controls disallowed by design.                    |
| Badge           | ✅ AA  | Decorative text; meaning is carried by adjacent content, not colour.                                                                   |
| Avatar          | ✅ AA  | Image `alt` from the name; initials fallback exposes the same name; presence dot is decorative.                                        |
| Spinner         | ✅ AA  | `role="status"` + `aria-live="polite"` with a label; artwork is `aria-hidden`.                                                         |
| Skeleton        | ✅ AA  | `aria-hidden` (decorative); animation removed under reduced motion.                                                                    |
| Tabs            | ✅ AA  | `tablist`/`tab`/`tabpanel`, roving `tabindex`, arrow-key navigation, `aria-selected`, `aria-controls`/`aria-labelledby`.               |
| Accordion       | ✅ AA  | Header buttons with `aria-expanded` controlling a `role="region"`; collapsed panels leave the tab order.                               |
| Dialog          | ✅ AA  | `role="dialog"` + `aria-modal`; **focus trap** and **focus restoration** to the trigger; `Escape`; page scroll-lock.                   |
| Drawer          | ✅ AA  | Same modal model as Dialog, from any edge.                                                                                             |
| Menu            | ✅ AA  | `role="menu"`/`menuitem`; opens on click/Enter/Space; arrow-key navigation; `Escape` returns focus to the trigger.                     |
| Toast           | ✅ AA  | Live region — `assertive` for danger, `polite` otherwise; auto- and manual-dismiss; focus is never stolen.                             |
| Breadcrumb      | ✅ AA  | `nav` landmark; the current page is `aria-current="page"`.                                                                             |
| Pagination      | ✅ AA  | `nav` landmark; active page is `aria-current`; ends disable at the bounds.                                                             |
| Table           | ✅ AA  | Semantic table; sortable headers expose `aria-sort` and are keyboard operable; selection checkboxes are labelled.                      |
| Command palette | ✅ AA  | Combobox/listbox pattern; `role="option"` + `aria-selected`; arrow-key navigation; `Escape` restores focus.                            |
| Tree            | ✅ AA  | `role="tree"`/`treeitem`, `aria-expanded`, `aria-selected`, arrow-key navigation.                                                      |
| Kanban          | ✅ AA  | Cards are movable by keyboard (not only pointer drag); columns are labelled regions.                                                   |

## How it's tested

- **Unit tests** assert the accessibility contract directly — e.g. the Spinner's
  `role="status"`, the Skeleton's `aria-hidden`, the Badge's reflected
  attributes, the Input's label/description wiring.
- **This audit** — a manual code review against WCAG 2.2 AA and the ARIA
  Authoring Practices.

## Known gaps & roadmap

- **Automated axe-core checks** are not yet wired into CI. Adding
  `@axe-core/playwright` assertions to the e2e suite (and per-component checks in
  the unit tests) is the next step and would make regressions impossible to miss.
- **Manual screen-reader passes** (NVDA + VoiceOver) have not been formally
  recorded here; the code review covers roles, names and keyboard operation.
- The `icons`, `utilities`, `ai` and `testing` libraries are scaffolded and out
  of scope until they ship components.

## Reporting an issue

Accessibility bugs are treated as defects, not enhancements. File them against
the component with the assistive technology, browser and steps to reproduce.
