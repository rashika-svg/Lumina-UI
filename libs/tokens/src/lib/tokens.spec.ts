import { describe, expect, it } from 'vitest';
import { cssVarName, token, tokens, TOKEN_PREFIX } from './tokens';

describe('@lumina/tokens', () => {
  it('exposes semantic tokens as CSS var() references', () => {
    expect(token('color.bg.canvas')).toBe('var(--lui-color-bg-canvas)');
    expect(token('color.accent.default')).toBe(
      'var(--lui-color-accent-default)',
    );
  });

  it('exposes component tokens that chain to semantic tokens', () => {
    expect(token('button.primary.bg')).toBe('var(--lui-button-primary-bg)');
  });

  it('derives the bare custom-property name and stays in sync with the var()', () => {
    const name = cssVarName('color.fg.default');
    expect(name).toBe('--lui-color-fg-default');
    expect(token('color.fg.default')).toBe(`var(${name})`);
  });

  it('prefixes every token with the Lumina namespace', () => {
    expect(TOKEN_PREFIX).toBe('lui');
    for (const value of Object.values(tokens)) {
      expect(value).toMatch(/^var\(--lui-/);
    }
  });
});
