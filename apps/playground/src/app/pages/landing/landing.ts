import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avatar, Badge, Button, Card, Skeleton, Spinner } from '@lumina/ui';

interface Framework {
  readonly name: string;
  readonly status: 'available' | 'planned';
}

interface Feature {
  readonly key: 'tokens' | 'theming' | 'a11y' | 'contract';
  readonly title: string;
  readonly body: string;
}

interface Value {
  readonly title: string;
  readonly body: string;
}

interface Stat {
  readonly value: string;
  readonly label: string;
}

/** Landing page — the platform's front door. */
@Component({
  selector: 'lpg-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, Badge, Card, Avatar, Spinner, Skeleton],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingPage {
  protected readonly frameworks: readonly Framework[] = [
    { name: 'Angular', status: 'available' },
    { name: 'React', status: 'planned' },
    { name: 'Vue', status: 'planned' },
    { name: 'Next.js', status: 'planned' },
    { name: 'Tailwind', status: 'planned' },
  ];

  protected readonly stats: readonly Stat[] = [
    { value: 'OKLCH', label: 'Perceptual colour' },
    { value: '3', label: 'Built-in themes' },
    { value: 'WCAG 2.2 AA', label: 'Accessibility baseline' },
    { value: '100%', label: 'Token-driven' },
  ];

  protected readonly features: readonly Feature[] = [
    {
      key: 'tokens',
      title: 'OKLCH design tokens',
      body: 'A three-tier DTCG token system compiled to themed CSS variables — the perceptual colour model behind accessible, single-seed theming.',
    },
    {
      key: 'theming',
      title: 'Runtime theming',
      body: 'Light, dark and high-contrast themes with tonal surfaces, plus custom themes — switched with a single data-theme swap, zero re-paint cost.',
    },
    {
      key: 'a11y',
      title: 'Accessible by default',
      body: 'WCAG 2.2 AA is the baseline: keyboard support, focus management, ARIA and reduced-motion are product requirements, not afterthoughts.',
    },
    {
      key: 'contract',
      title: 'Framework-neutral contract',
      body: 'Tokens, specs and accessibility rules are shared. Angular ships today; React, Vue and Next consume the same contract next.',
    },
  ];

  protected readonly values: readonly Value[] = [
    {
      title: 'One contract, every framework',
      body: 'Decide colour, spacing and accessibility once, then ship native components per framework. Angular ships today; React, Vue and Next consume the same contract.',
    },
    {
      title: 'Reskin at runtime, per brand',
      body: 'Multi-brand and white-label theming from a single data-theme swap and one accent hue — no rebuilds, and no forks to maintain.',
    },
    {
      title: 'Passes accessibility review',
      body: 'WCAG 2.2 AA with focus traps, live regions and keyboard patterns, backed by automated axe tests and a written audit — not a README claim.',
    },
    {
      title: 'Own your look, not a vendor’s',
      body: 'OKLCH tokens make it your brand, not a locked-in Material aesthetic. Rebrand by editing tokens instead of fighting CSS overrides.',
    },
  ];
}
