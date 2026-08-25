import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Contract: the generated @lumina/tailwind preset (v3) and theme (v4) may only
 * reference `--lui-*` custom properties that the CSS token build actually
 * defines. This is the machine-checkable form of the Phase 4 exit criterion —
 * "Angular and a Tailwind sample consume identical generated values" — because
 * both resolve to the very same custom properties.
 */

const HERE = dirname(fileURLToPath(import.meta.url));
const cssFile = (f: string) =>
  readFileSync(resolve(HERE, '../generated/css', f), 'utf8');
const twFile = (f: string) =>
  readFileSync(resolve(HERE, '../../../tailwind', f), 'utf8');

/** Custom properties DEFINED by the CSS build (primitives + light theme). */
function definedVars(): Set<string> {
  const css = cssFile('_primitives.css') + cssFile('theme-light.css');
  const names = new Set<string>();
  for (const m of css.matchAll(/(--lui-[a-z0-9-]+)\s*:/g)) names.add(m[1]);
  return names;
}

/** Custom properties REFERENCED via `var(--lui-…)` in a file. */
function referencedVars(text: string): Set<string> {
  const names = new Set<string>();
  for (const m of text.matchAll(/var\((--lui-[a-z0-9-]+)\)/g)) names.add(m[1]);
  return names;
}

describe('@lumina/tailwind ⇄ token CSS contract', () => {
  const defined = definedVars();
  const presetText = twFile('preset.cjs');
  const themeText = twFile('theme.css');

  it('defines a non-trivial set of token custom properties', () => {
    expect(defined.size).toBeGreaterThan(100);
  });

  it('every var() the v3 preset references is defined by the token CSS', () => {
    const missing = [...referencedVars(presetText)].filter(
      (v) => !defined.has(v),
    );
    expect(missing).toEqual([]);
  });

  it('every var() the v4 theme references is defined by the token CSS', () => {
    const missing = [...referencedVars(themeText)].filter(
      (v) => !defined.has(v),
    );
    expect(missing).toEqual([]);
  });

  it('maps key semantic + primitive tokens to the vars Angular consumes', async () => {
    const presetPath = resolve(HERE, '../../../tailwind/preset.cjs');
    const preset = (await import(pathToFileURL(presetPath).href)).default;
    const { extend } = preset.theme;

    expect(extend.colors.accent.DEFAULT).toBe(
      'var(--lui-color-accent-default)',
    );
    expect(extend.colors.surface.canvas).toBe('var(--lui-color-bg-canvas)');
    // `default` is mapped to Tailwind's `DEFAULT`, so `text-fg` resolves.
    expect(extend.colors.fg.DEFAULT).toBe('var(--lui-color-fg-default)');
    expect(extend.borderRadius.md).toBe('var(--lui-radius-md)');
    expect(extend.spacing['4']).toBe('var(--lui-space-4)');
    expect(extend.boxShadow.lg).toBe('var(--lui-shadow-lg)');
    expect(extend.fontFamily.sans).toBe('var(--lui-font-family-sans)');
  });

  it('exposes the Tailwind v4 accent shorthand (default dropped)', () => {
    expect(themeText).toContain(
      '--color-accent: var(--lui-color-accent-default);',
    );
  });
});
