import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import { Avatar } from './avatar/avatar';
import { Badge } from './badge/badge';
import { Button } from './button/button';
import { Card } from './card/card';
import { InputField } from './input/input';
import { Skeleton } from './skeleton/skeleton';
import { Spinner } from './spinner/spinner';
import { Switch } from './switch/switch';

/**
 * Automated accessibility smoke test. Renders the flagship components together
 * and runs axe-core over the result, asserting zero WCAG A/AA violations.
 *
 * `color-contrast` is disabled because jsdom has no layout engine to compute it
 * (contrast is covered by the token ramps + the manual audit); best-practice
 * page-level rules are excluded by scoping to WCAG tags, since this renders a
 * component fragment rather than a full page.
 */
@Component({
  imports: [Button, Badge, Avatar, InputField, Switch, Card, Spinner, Skeleton],
  template: `
    <button luiButton variant="primary">Save changes</button>
    <span luiBadge variant="success">Active</span>
    <lui-avatar name="Ada Lovelace" status="online" />
    <lui-input label="Email address" hint="We'll never share it." />
    <lui-switch label="Email notifications" />
    <lui-card variant="elevated">
      <h3 cardHeader>Project Lumina</h3>
      <p>A token-driven design system.</p>
    </lui-card>
    <lui-spinner />
    <lui-skeleton [lines]="3" />
  `,
})
class A11yHost {}

describe('Accessibility (axe-core)', () => {
  let host: HTMLElement | null = null;

  afterEach(() => {
    host?.remove();
    host = null;
  });

  it('renders the flagship components with no WCAG A/AA violations', async () => {
    const fixture = TestBed.createComponent(A11yHost);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
    // axe requires the context to be attached to the document.
    document.body.appendChild(host);

    const results = await axe.run(host, {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
      rules: { 'color-contrast': { enabled: false } },
    });

    const violations = results.violations.map(
      (v) => `${v.id} — ${v.help} (${v.nodes.length})`,
    );
    expect(violations).toEqual([]);
  });
});
