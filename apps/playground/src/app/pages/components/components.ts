import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge, Card } from '@lumina/ui';

interface Group {
  readonly title: string;
  readonly items: readonly { name: string; status: 'stable' | 'beta' }[];
}

/** Component catalogue — a browsable index of the library. */
@Component({
  selector: 'lpg-components',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Card, Badge],
  template: `
    <div class="doc-page">
      <header class="doc-head">
        <p class="doc-eyebrow">Reference</p>
        <h1 class="doc-title">Components</h1>
        <p class="doc-lead">
          {{ total }} accessible, token-driven Angular components. Flagship
          components are documented in depth; the rest are available today and
          documented next.
        </p>
      </header>

      @for (group of groups; track group.title) {
        <section class="group">
          <h2 class="group__title">{{ group.title }}</h2>
          <div class="grid">
            @for (item of group.items; track item.name) {
              <lui-card variant="outlined">
                <h3 cardHeader>{{ item.name }}</h3>
                <div cardFooter>
                  <span
                    luiBadge
                    [variant]="item.status === 'stable' ? 'success' : 'warning'"
                    appearance="subtle"
                  >
                    {{ item.status }}
                  </span>
                  <a class="group__link" routerLink="/playground"
                    >View in playground →</a
                  >
                </div>
              </lui-card>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: `
    .doc-page {
      max-inline-size: 72rem;
      margin-inline: auto;
      padding: var(--lui-space-8) var(--lui-space-4) var(--lui-space-16);
    }
    .doc-eyebrow {
      margin: 0 0 var(--lui-space-2);
      font-size: var(--lui-type-caption-size);
      font-weight: var(--lui-font-weight-semibold);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--lui-color-accent-default);
    }
    .doc-title {
      margin: 0 0 var(--lui-space-3);
      font-size: var(--lui-type-heading-xl-size);
      font-weight: var(--lui-type-heading-xl-weight);
      letter-spacing: var(--lui-type-heading-xl-tracking);
      line-height: var(--lui-type-heading-xl-line);
    }
    .doc-lead {
      margin: 0;
      max-inline-size: 42rem;
      color: var(--lui-color-fg-muted);
      font-size: var(--lui-type-body-lg-size);
      line-height: var(--lui-type-body-lg-line);
    }
    .group {
      margin-block-start: var(--lui-space-8);
    }
    .group__title {
      margin: 0 0 var(--lui-space-4);
      font-size: var(--lui-type-heading-md-size);
      font-weight: var(--lui-type-heading-md-weight);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
      gap: var(--lui-space-3);
    }
    .group__link {
      color: var(--lui-color-fg-link);
      text-decoration: none;
      font-size: var(--lui-font-size-sm);
    }
    .group__link:hover {
      text-decoration: underline;
    }
  `,
})
export class ComponentsPage {
  protected readonly groups: readonly Group[] = [
    {
      title: 'Flagship',
      items: [
        { name: 'Button', status: 'stable' },
        { name: 'Input', status: 'stable' },
        { name: 'Badge', status: 'stable' },
        { name: 'Avatar', status: 'stable' },
        { name: 'Card', status: 'stable' },
      ],
    },
    {
      title: 'Overlay & composite',
      items: [
        { name: 'Tabs', status: 'stable' },
        { name: 'Accordion', status: 'stable' },
        { name: 'Dialog', status: 'stable' },
        { name: 'Drawer', status: 'stable' },
        { name: 'Menu', status: 'stable' },
        { name: 'Toast', status: 'stable' },
        { name: 'Breadcrumb', status: 'stable' },
        { name: 'Pagination', status: 'stable' },
        { name: 'Switch', status: 'stable' },
      ],
    },
    {
      title: 'Data & power-user',
      items: [
        { name: 'Table', status: 'stable' },
        { name: 'Command Palette', status: 'stable' },
        { name: 'Tree', status: 'stable' },
        { name: 'Kanban', status: 'stable' },
      ],
    },
  ];

  protected readonly total = this.groups.reduce(
    (n, g) => n + g.items.length,
    0,
  );
}
