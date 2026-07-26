import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, Card } from '@lumina/ui';

/** Documentation home — getting started, rendered inside the docs shell. */
@Component({
  selector: 'lpg-docs-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, Card],
  template: `
    <article class="doc">
      <header class="doc__head">
        <p class="doc__eyebrow">Documentation</p>
        <h1 class="doc__title">Getting started</h1>
        <p class="doc__summary">
          Install Lumina, import the token stylesheet once, and provide the
          theme engine. You'll have a themed, accessible Button in under five
          minutes.
        </p>
      </header>

      <section class="doc__section">
        <h2 class="doc__h2">Installation</h2>
        <div class="code-block">
          <button
            type="button"
            class="code-block__copy"
            (click)="copy(install)"
          >
            {{ copied() ? 'Copied ✓' : 'Copy' }}
          </button>
          <pre class="code-block__pre"><code>{{ install }}</code></pre>
        </div>
      </section>

      <section class="doc__section">
        <h2 class="doc__h2">Add the tokens &amp; theme engine</h2>
        <pre
          class="code-block__pre code-block__pre--plain"
        ><code>{{ setup }}</code></pre>
      </section>

      <section class="doc__section">
        <h2 class="doc__h2">Use a component</h2>
        <pre
          class="code-block__pre code-block__pre--plain"
        ><code>&lt;button luiButton variant="primary"&gt;Save&lt;/button&gt;</code></pre>
        <div class="doc__preview">
          <button luiButton variant="primary">Save</button>
          <button luiButton variant="secondary">Cancel</button>
          <button luiButton variant="ghost">More</button>
        </div>
      </section>

      <section class="doc__section">
        <h2 class="doc__h2">Explore</h2>
        <div class="doc__grid">
          @for (link of explore; track link.slug) {
            <a class="doc__card-link" [routerLink]="['/docs', link.slug]">
              <lui-card variant="outlined">
                <h3 cardHeader>{{ link.title }}</h3>
                <p>{{ link.body }}</p>
              </lui-card>
            </a>
          }
        </div>
        <div class="doc__cta">
          <a luiButton variant="secondary" routerLink="/components"
            >Open the Component Lab →</a
          >
        </div>
      </section>
    </article>
  `,
  styleUrl: './doc-page.css',
  styles: `
    .doc__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
      gap: var(--lui-space-4);
    }
    .doc__card-link {
      text-decoration: none;
      color: inherit;
    }
    .doc__card-link p {
      margin: 0;
    }
    .code-block__pre--plain {
      padding-block-start: var(--lui-space-4);
    }
    .code-block__pre--plain::before {
      content: none;
    }
    .doc__cta {
      margin-block-start: var(--lui-space-5);
    }
  `,
})
export class DocsHome {
  protected readonly copied = signal(false);

  protected readonly install =
    'npm install @lumina/ui @lumina/tokens @lumina/theme';

  protected readonly setup = `// styles.css
@import '@lumina/tokens/styles';

// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideLuminaTheme } from '@lumina/theme';

bootstrapApplication(App, {
  providers: [provideLuminaTheme({ defaultMode: 'system' })],
});`;

  protected readonly explore = [
    {
      slug: 'tokens',
      title: 'Design tokens',
      body: 'The three-tier OKLCH system behind every visual decision.',
    },
    {
      slug: 'theming',
      title: 'Theming',
      body: 'Light, dark and high-contrast themes, switched at runtime.',
    },
    {
      slug: 'accessibility',
      title: 'Accessibility',
      body: 'The WCAG 2.2 AA baseline every component ships with.',
    },
    {
      slug: 'button',
      title: 'Components',
      body: 'Browse the token-driven component catalogue.',
    },
  ];

  protected copy(text: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(text);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    }
  }
}
