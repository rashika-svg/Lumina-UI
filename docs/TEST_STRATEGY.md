# Lumina UI Test Strategy and Acceptance Cases

The quality model is layered: fast tests prove behaviour close to the source, browser tests prove
the product experience, and release checks prove cross-framework parity. Tests are run through Nx
targets so only affected projects need to execute in CI.

## Test layers

| Layer                     | Tooling                             | Purpose                                                           | Required for                       |
| ------------------------- | ----------------------------------- | ----------------------------------------------------------------- | ---------------------------------- |
| Static checks             | TypeScript, ESLint, Prettier        | Type safety, module boundaries, formatting                        | Every change                       |
| Token contract            | Vitest + generated-output snapshots | Token names, references, theme completeness                       | Tokens and themes                  |
| Unit/component            | Vitest + Angular TestBed            | Inputs, outputs, DOM semantics, CVA, state changes                | Every component                    |
| Stories                   | Storybook + a11y addon              | Variant coverage and visual development                           | Every documented component         |
| Documentation integration | Vitest/browser rendering            | Page manifests, tabs, code copying, route content                 | Docs and examples                  |
| E2E                       | Playwright                          | Keyboard flows, themes, responsive navigation, real user journeys | Public site and playground         |
| Visual regression         | Playwright screenshots (phase 7)    | Theme/state/layout regressions                                    | Flagship components and key routes |
| Cross-adapter contract    | Adapter-specific test runners       | Same component contract in Angular, React, and Vue                | Each released adapter              |

## Core acceptance cases

These are release cases, not optional ideas. Put each case into the relevant adapter's test suite and
keep the ID in the test name or test-case mapping.

| ID        | Area                  | Given / when / then                                                                                                                                                            |
| --------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TOK-001   | Token build           | Given token source changes, when the Nx token target runs, then CSS, TypeScript, and JSON outputs compile with no unresolved references.                                       |
| TOK-002   | Theme parity          | Given light, dark, and high-contrast themes, when generated files are inspected, then every required semantic token exists in all themes.                                      |
| THEME-001 | Persisted theme       | Given a user selects dark or high contrast, when the application reloads, then the selected mode remains and is reflected on the root element before component interaction.    |
| THEME-002 | Reduced motion        | Given reduced motion is enabled, when an interactive component changes state, then motion is removed or reduced according to tokens.                                           |
| DOC-001   | Discoverability       | Given a reader opens the docs, when they search a component name, then the component page appears with its current status.                                                     |
| DOC-002   | Responsive navigation | Given a 320px-wide viewport, when the reader opens documentation navigation, then it is keyboard-operable, dismissible, and does not obscure the selected content permanently. |
| DOC-003   | Example integrity     | Given every documented code example, when CI renders it, then it mounts successfully and its Copy action writes the shown source.                                              |
| DOC-004   | Adapter truth         | Given an adapter is planned, when its documentation tab is selected or viewed, then it is clearly marked planned and no unsupported import/API is rendered.                    |
| DOC-005   | Docs accessibility    | Given any docs route, when automated a11y checks run, then there are no critical or serious violations and heading order/main landmark are present.                            |
| CMP-001   | Native semantics      | Given an interactive component, when it renders, then it uses the expected native element or exposes the required accessible role and name.                                    |
| CMP-002   | Keyboard operation    | Given an interactive component, when each documented key is pressed, then focus and state change exactly as documented.                                                        |
| CMP-003   | Focus visibility      | Given keyboard focus reaches an interactive component, then a visible focus indicator appears in light, dark, and high-contrast themes.                                        |
| CMP-004   | Disabled state        | Given a component is disabled, when clicked or activated by keyboard, then it does not perform its action and exposes the correct disabled semantics.                          |
| CMP-005   | Theme contract        | Given every supported theme, when a component renders each supported variant, then it uses token-driven styles and preserves readable contrast.                                |
| CMP-006   | Forms contract        | Given a form control component, when used with reactive and template-driven forms, then value, touched, validation, and disabled state are synchronised.                       |
| CMP-007   | Public API            | Given the documented component API, when it is compiled in an example project, then every documented input, event, slot, and default is correct.                               |
| CARD-001  | Non-interactive card  | Given a Card without an action, when it receives pointer or keyboard input, then it is not announced or operated as an interactive control.                                    |
| CARD-002  | Interactive card      | Given an interactive Card, when Enter or Space activates it, then its documented action occurs once and focus remains predictable.                                             |
| CARD-003  | Card composition      | Given header, media, body, and footer slots, when content is omitted or reordered according to API rules, then no empty semantic landmarks or spacing defects are introduced.  |
| ADP-001   | Adapter parity        | Given a component contract scenario, when it runs against every released adapter, then variant/state/keyboard outcomes match the shared specification.                         |

## Component test checklist

For each component, add cases for every public input/prop, emitted event, default, variant, size,
state, content slot, error state, disabled/loading state, theme, and responsive rule. Form controls
also require real reactive-form and template-driven-form tests. Complex widgets require keyboard
navigation, focus restoration, escape/close, and screen-reader label tests.

## Commands and CI gates

Use the package-manager-prefixed Nx commands below from the workspace root:

```powershell
npm exec nx affected -t lint,test,build
npm exec nx run playground-e2e:e2e
npm exec nx run ui:build-storybook
```

The release pipeline blocks publication when affected lint, unit/component tests, build, critical
documentation tests, and E2E tests fail. Visual regression and all-adapter checks become blocking
as the respective adapters ship.

## Test data and reliability rules

- Prefer accessible queries (role, label, text) over implementation-only selectors.
- Keep deterministic fixtures; do not depend on network calls, system time, or random output.
- Test user-observable outcomes, not private component methods.
- Use `data-testid` only where an accessible query cannot describe the target.
- Add a regression test for every fixed accessibility or behaviour bug.
- Treat a documentation code example as production code: it compiles, renders, and is tested.
