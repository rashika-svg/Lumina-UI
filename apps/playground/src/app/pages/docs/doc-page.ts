import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import {
  Avatar,
  Badge,
  Button,
  Card,
  InputField,
  Skeleton,
  Spinner,
  Switch,
} from '@lumina/ui';
import { findDoc, type DocEntry } from './docs-registry';

interface TocItem {
  readonly id: string;
  readonly label: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Renders a single documentation entry (component or foundation) by slug. */
@Component({
  selector: 'lpg-doc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    Button,
    Badge,
    Avatar,
    InputField,
    Switch,
    Card,
    Spinner,
    Skeleton,
  ],
  templateUrl: './doc-page.html',
  styleUrl: './doc-page.css',
})
export class DocPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')),
    { initialValue: '' },
  );
  protected readonly doc = computed(() => findDoc(this.slug()));

  /** Sections actually present on the page, for the "On this page" rail. */
  protected readonly toc = computed<TocItem[]>(() => {
    const d = this.doc();
    if (!d) return [];
    const items: TocItem[] = [];
    if (d.selector) items.push({ id: 'preview', label: 'Preview' });
    if (d.selector) items.push({ id: 'installation', label: 'Installation' });
    if (d.usage) items.push({ id: 'usage', label: 'Usage' });
    if (d.selector) items.push({ id: 'variants', label: 'Variants & states' });
    for (const b of d.body ?? [])
      items.push({ id: slugify(b.heading), label: b.heading });
    if (d.api) items.push({ id: 'api', label: 'API' });
    if (d.a11y) items.push({ id: 'accessibility', label: 'Accessibility' });
    if (d.examples) items.push({ id: 'examples', label: 'Examples' });
    if (d.dos || d.donts) items.push({ id: 'guidelines', label: 'Guidelines' });
    return items;
  });

  protected readonly copied = signal(false);

  protected sectionId(heading: string): string {
    return slugify(heading);
  }

  /** The import statement shown in the Installation section. */
  protected importLine(d: DocEntry): string {
    return `import { ${d.className ?? d.title} } from '@lumina/ui';`;
  }

  protected copy(text: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(text);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    }
  }
}
