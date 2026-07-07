/**
 * One-off migration: rewrite primitive color tokens from hex to OKLCH.
 *
 * OKLCH is Lumina's primary color model — perceptually-uniform lightness and
 * predictable chroma give accessible, consistent ramps and make single-seed
 * theme generation (Theme Studio) produce correct results.
 *
 *   node scripts/hex-to-oklch.mjs
 */
import { converter } from 'culori';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const toOklch = converter('oklch');
const file = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'tokens',
  'primitive',
  'color.json',
);
const json = JSON.parse(readFileSync(file, 'utf8'));

/** Format a hex value as an `oklch(L C H)` string (achromatic → hue 0). */
function hexToOklch(hex) {
  if (hex === '#00000000') return 'transparent';
  const c = toOklch(hex);
  const L = +c.l.toFixed(4);
  const C = +(c.c ?? 0).toFixed(4);
  const H = c.h == null ? 0 : +c.h.toFixed(2);
  return `oklch(${L} ${C} ${H})`;
}

let count = 0;
function walk(node) {
  if (node && typeof node === 'object') {
    if (
      typeof node.$value === 'string' &&
      node.$type === 'color' &&
      node.$value.startsWith('#')
    ) {
      node.$value = hexToOklch(node.$value);
      count++;
    }
    for (const key of Object.keys(node)) walk(node[key]);
  }
}
walk(json);

writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
console.log(`✓ Converted ${count} primitive colors to OKLCH`);
