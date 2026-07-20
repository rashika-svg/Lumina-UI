# Workspace conventions

Shared operating rules for anyone working in this repo, human or agent.
`AGENTS.md` (Codex) and `CLAUDE.md` (Claude Code) both point here so the two
assistants stay aligned on one source of truth.

## Running checks

- **Tests** — `npx nx test <project>`, or `npx nx run-many -t test` for the
  workspace. All eight projects pass.
- **Lint** — `npx nx run-many -t lint -p <projects>`. Only **errors** block;
  there are pre-existing `no-non-null-assertion` warnings in the phase 2/3
  components.
- **Build** — `npx nx run-many -t build -p ui playground`.
  `apps/playground/src/app/app.css` and `.../pages/lab/lab.css` exceed the 4 kB
  CSS budget. These are pre-existing **warnings** and do not fail the build.

## Vitest on Windows — do not "simplify" the test targets

Each project's `test` target deliberately runs `node ../../tools/nx-vitest.mjs`
instead of the inferred `vitest` command, and re-declares `cache` / `inputs` /
`outputs` (an explicit target does not inherit the inferred target's cache
metadata).

Nx normalizes the workspace root to a **lowercase drive** (`d:\...`) and passes
it as the child cwd and the injected `node_modules/.bin` PATH entry. The
`.bin/vitest.cmd` shim then loads `vitest.mjs` under a lowercase-drive path, so
Vitest 4 resolves its worker modules as `file:///d:/...` while comparing against
a canonical uppercase realpath. The worker is never associated with the test
module, and every suite fails with `Cannot read properties of undefined
(reading 'config')` having run 0 tests — Angular projects instead report `Need
to call TestBed.initTestEnvironment() first`. The launcher canonicalizes the
drive case of both the cwd and the Vitest entry in a fresh process before Vitest
loads. Reverting to the inferred target breaks every suite on Windows.

Related: `apps/playground/vite.config.mts` aliases `@lumina/*` to
`libs/*/src/index.ts`. Without it those barrels resolve to **empty modules**
under Vitest, which surfaces as `provideLuminaTheme is not a function`.

## Design tokens

Never edit `libs/tokens/src/generated/**` by hand. Change the source under
`libs/tokens/tokens/**` and regenerate with `npx nx run tokens:tokens`. The
generated CSS is committed in Prettier-formatted form, so a raw regeneration
shows a formatting-only diff that Prettier normalizes away on commit.

## Components

`@lumina/ui` ships Button, Badge, Avatar, Input, Switch and Card as the flagship
set, Spinner and Skeleton as the async-feedback primitives, plus the phase 2/3
composites. Every component carries a spec, a Storybook story, and an entry in
the Component Lab registry (`apps/playground/src/app/pages/lab/lab-registry.ts`)
so it is explorable with live controls and copyable code. See
`docs/COMPONENT_DOCUMENTATION_STANDARD.md` for the full definition of done.

## Working in parallel

Claude Code and Codex both operate in this repo at the same time. Stage explicit
paths (`git add libs/ui apps/playground`) — **never `git add -A`** — so you do
not sweep up the other assistant's in-progress files.

## Commits

Conventional Commits, enforced by commitlint. Allowed scopes: `tokens`, `theme`,
`ui`, `icons`, `utilities`, `ai`, `testing`, `playground`, `docs`, `repo`.
Husky and lint-staged run Prettier and ESLint over staged files. Do not add AI
co-author trailers.
