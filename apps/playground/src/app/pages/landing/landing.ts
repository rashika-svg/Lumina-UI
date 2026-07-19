import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge, Button, Card } from '@lumina/ui';

interface Framework {
  readonly name: string;
  readonly status: 'available' | 'planned';
}

interface Feature {
  readonly title: string;
  readonly body: string;
}

/** Landing page — the platform's front door. */
@Component({
  selector: 'lpg-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, Badge, Card],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingPage {
  protected readonly frameworks: readonly Framework[] = [
    { name: 'Angular', status: 'available' },
    { name: 'React', status: 'planned' },
    { name: 'Vue', status: 'planned' },
    { name: 'Next.js', status: 'planned' },
    { name: 'Tailwind', status: 'available' },
  ];

  protected readonly features: readonly Feature[] = [
    {
      title: 'OKLCH design tokens',
      body: 'A three-tier DTCG token system compiled to themed CSS variables — the perceptual colour model behind accessible, single-seed theming.',
    },
    {
      title: 'Runtime theming',
      body: 'Light, dark and high-contrast themes with tonal surfaces, plus custom themes — switched with a single data-theme swap, zero re-paint cost.',
    },
    {
      title: 'Accessible by default',
      body: 'WCAG 2.2 AA is the baseline: keyboard support, focus management, ARIA and reduced-motion are product requirements, not afterthoughts.',
    },
    {
      title: 'Framework-neutral contract',
      body: 'Tokens, specs and accessibility rules are shared. Angular ships today; React, Vue and Next consume the same contract next.',
    },
  ];
}
