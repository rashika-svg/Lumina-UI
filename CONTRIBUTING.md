# Contributing to Lumina UI

Thanks for your interest in improving Lumina UI! This guide covers the workflow and conventions.

## Prerequisites

- Node.js `>= 22`
- npm `>= 10`

```bash
npm install   # also installs Husky git hooks via the `prepare` script
```

## Day-to-day commands

| Command                | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `npm run playground`   | Serve the interactive playground at `localhost:4200` |
| `npm run tokens:build` | Recompile design tokens (CSS variables + typed TS)   |
| `npm test`             | Run all unit/component tests (Vitest)                |
| `npm run lint`         | Lint all projects (includes module-boundary checks)  |
| `npm run build`        | Build all projects                                   |
| `npm run e2e`          | Run Playwright end-to-end tests                      |
| `npm run affected`     | Lint + test + build only what your change touched    |
| `npm run graph`        | Open the Nx project graph                            |

Always prefer running tasks through Nx (`nx run`, `nx affected`) rather than the underlying tooling.

## Commit conventions

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) and are validated by
Commitlint on every commit. The scope should be one of the project names.

```
feat(ui): add Tooltip component
fix(theme): persist custom themes across reloads
docs(repo): expand architecture guide
```

Allowed scopes: `tokens`, `theme`, `ui`, `icons`, `utilities`, `ai`, `testing`, `playground`,
`docs`, `repo`.

A pre-commit hook runs `lint-staged` (Prettier + ESLint `--fix`) on staged files.

## Adding a component

1. Create `libs/ui/src/lib/<name>/<name>.ts`, `.css`, and `.spec.ts`.
2. Follow the [design principles](docs/DESIGN_PRINCIPLES.md): standalone, `OnPush`, signal inputs,
   native semantics, ARIA-correct, **token-driven styles only** (no hard-coded values).
3. If the component needs new visual decisions, add **component tokens** in
   `libs/tokens/tokens/component/` rather than hard-coding — then `npm run tokens:build`.
4. Export it from `libs/ui/src/index.ts`.
5. Add tests covering behaviour, state and accessibility. Form controls must test the
   `ControlValueAccessor` contract with a real `FormControl`.
6. Run `npm run lint && npm test` before opening a PR.

## Pull requests

- Keep PRs focused and small.
- Ensure `npm run lint`, `npm test` and `npm run build` pass — CI runs the same via `nx affected`.
- Update docs and the [changelog](CHANGELOG.md) where relevant.

## Code of conduct

Participation is governed by our [Code of Conduct](CODE_OF_CONDUCT.md).
