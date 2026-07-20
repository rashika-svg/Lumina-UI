// Launcher that works around a Vitest 4 + Windows failure under Nx.
//
// Nx spawns the inferred `vitest` test command with a LOWERCASE drive letter
// (e.g. `d:\...`) in both the child cwd and the injected `node_modules/.bin`
// PATH entry. On Windows the `.bin/vitest.cmd` shim then loads `vitest.mjs`
// with a lowercase-drive script path, so Vitest 4's worker resolves its own
// modules under `file:///d:/...`. Vitest compares that against a canonical
// (uppercase-drive) realpath internally, the paths don't match, and
// `globalThis.__vitest_worker__` is never associated with the test module.
// The first `describe()` then throws:
//   TypeError: Cannot read properties of undefined (reading 'config')
// (getWorkerState().config), and 0 tests run.
//
// Direct `vitest run` works because the shell resolves an uppercase-drive path.
// The fix: canonicalize the drive case of BOTH the cwd and the vitest entry
// path BEFORE the Vitest process starts, then invoke `vitest.mjs` directly via
// node (bypassing the lowercase `.bin` shim). This must happen in a fresh
// process — doing it inside vitest.config is too late, as Node has already
// cached its module graph under the lowercase paths.
import { realpathSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Normalize the working directory to its canonical (uppercase-drive) form.
process.chdir(realpathSync.native(process.cwd()));

// Resolve vitest's CLI entry and canonicalize its drive case.
const vitestEntry = realpathSync.native(
  join(dirname(require.resolve('vitest/package.json')), 'vitest.mjs'),
);

// Always run once (never watch) under Nx; forward any extra args such as
// --coverage or a name filter, keeping them in run mode.
const forwarded = process.argv.slice(2);
const args =
  forwarded.includes('run') || forwarded.includes('watch')
    ? forwarded
    : ['run', ...forwarded];

const result = spawnSync(process.execPath, [vitestEntry, ...args], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
