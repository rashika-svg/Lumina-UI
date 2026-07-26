import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, Card } from '@lumina/ui';

/** Documentation home — getting started + links into the foundations. */
@Component({
  selector: 'lpg-docs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, Card],
  template: `
    <div class="doc-page">
      <header class="doc-head">
        <p class="doc-eyebrow">Documentation</p>
        <h1 class="doc-title">Getting started</h1>
        <p class="doc-lead">
          Install Lumina, import the token stylesheet once, and provide the
          theme engine. You'll have a themed, accessible Button in under five
          minutes.
        </p>
      </header>

      <section class="prose">
        <h2>Installation</h2>
        <pre
          class="code"
        ><code>npm install &#64;lumina/ui &#64;lumina/tokens &#64;lumina/theme</code></pre>

        <h2>Add the tokens &amp; theme engine</h2>
        <pre class="code"><code>// styles.css
&#64;import '&#64;lumina/tokens/styles';</code></pre>
        <pre class="code"><code>// main.ts
import {{ '{' }} bootstrapApplication {{ '}' }} from '&#64;angular/platform-browser';
import {{ '{' }} provideLuminaTheme {{ '}' }} from '&#64;lumina/theme';

bootstrapApplication(App, {{ '{' }}
  providers: [provideLuminaTheme({{ '{' }} defaultMode: 'system' {{ '}' }})],
{{ '}' }});</code></pre>

        <h2>Use a component</h2>
        <pre
          class="code"
        ><code>&lt;button luiButton variant="primary"&gt;Save&lt;/button&gt;</code></pre>

        <div class="preview">
          <button luiButton variant="primary">Save</button>
          <button luiButton variant="secondary">Cancel</button>
          <button luiButton variant="ghost">More</button>
        </div>
      </section>

      <section class="foundations">
        <h2 class="foundations__title">Foundations</h2>
        <div class="grid">
          <lui-card variant="elevated">
            <h3 cardHeader>Design tokens</h3>
            <p>
              Three-tier OKLCH token system — the source of every visual
              decision.
            </p>
          </lui-card>
          <lui-card variant="elevated">
            <h3 cardHeader>Theming</h3>
            <p>
              Light, dark and high-contrast themes, plus runtime custom themes.
            </p>
          </lui-card>
          <lui-card variant="elevated">
            <h3 cardHeader>Accessibility</h3>
            <p>
              WCAG 2.2 AA baseline — keyboard, focus, ARIA and reduced motion.
            </p>
          </lui-card>
          <lui-card variant="elevated">
            <h3 cardHeader>Components</h3>
            <p>Browse the full, token-driven component catalogue.</p>
            <div cardFooter>
              <a
                luiButton
                size="sm"
                variant="secondary"
                routerLink="/components"
                >Browse →</a
              >
            </div>
          </lui-card>
        </div>
      </section>
    </div>
  `,
  styles: `
    .doc-page {
      max-inline-size: 60rem;
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
    .prose {
      margin-block-start: var(--lui-space-8);
    }
    .prose h2 {
      margin: var(--lui-space-8) 0 var(--lui-space-3);
      font-size: var(--lui-type-heading-lg-size);
      font-weight: var(--lui-type-heading-lg-weight);
      letter-spacing: var(--lui-type-heading-lg-tracking);
    }
    .code {
      position: relative;
      margin: 0 0 var(--lui-space-3);
      padding: calc(var(--lui-space-4) + 1.75rem) var(--lui-space-4)
        var(--lui-space-4);
      border: var(--lui-border-width-thin) solid var(--lui-color-border-default);
      border-radius: var(--lui-radius-lg);
      background: var(--lui-elevation-2-surface);
      box-shadow: var(--lui-elevation-1-shadow);
      overflow-x: auto;
    }
    /* Terminal-window chrome: three dots + a hairline under the title bar. */
    .code::before {
      content: '';
      position: absolute;
      inset-block-start: 1rem;
      inset-inline-start: var(--lui-space-4);
      inline-size: 0.5rem;
      block-size: 0.5rem;
      border-radius: var(--lui-radius-full);
      background: var(--lui-color-border-strong);
      box-shadow:
        0.75rem 0 var(--lui-color-border-strong),
        1.5rem 0 var(--lui-color-border-strong);
    }
    .code::after {
      content: '';
      position: absolute;
      inset-block-start: 2.5rem;
      inset-inline: 0;
      border-block-start: var(--lui-border-width-thin) solid
        var(--lui-color-border-muted);
    }
    .code code {
      font-family: var(--lui-font-family-mono);
      font-size: var(--lui-type-code-size);
      line-height: var(--lui-type-code-line);
      color: var(--lui-color-fg-default);
      white-space: pre;
    }
    .preview {
      display: flex;
      flex-wrap: wrap;
      gap: var(--lui-space-3);
      margin-block-start: var(--lui-space-4);
      padding: var(--lui-space-6);
      border: var(--lui-border-width-thin) solid var(--lui-color-border-default);
      border-radius: var(--lui-radius-lg);
      background: var(--lui-surface-canvas);
    }
    .foundations {
      margin-block-start: var(--lui-space-12);
    }
    .foundations__title {
      margin: 0 0 var(--lui-space-4);
      font-size: var(--lui-type-heading-lg-size);
      font-weight: var(--lui-type-heading-lg-weight);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
      gap: var(--lui-space-4);
    }
    .grid p {
      margin: 0;
    }
  `,
})
export class DocsPage {}
