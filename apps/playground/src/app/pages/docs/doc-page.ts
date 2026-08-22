import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
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
import { DOCS, findDoc, type DocEntry } from './docs-registry';

interface TocItem {
  readonly id: string;
  readonly label: string;
}

/** Slugs that have a hand-authored live preview + variants gallery. */
const PREVIEWABLE = new Set([
  'button',
  'input',
  'badge',
  'avatar',
  'switch',
  'card',
  'spinner',
  'skeleton',
]);

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
  private readonly el = inject(ElementRef);

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
    const canPreview = PREVIEWABLE.has(d.slug);
    if (canPreview) items.push({ id: 'preview', label: 'Preview' });
    if (d.selector) items.push({ id: 'installation', label: 'Installation' });
    if (d.usage) items.push({ id: 'usage', label: 'Usage' });
    if (canPreview) items.push({ id: 'variants', label: 'Variants & states' });
    for (const b of d.body ?? [])
      items.push({ id: slugify(b.heading), label: b.heading });
    if (d.api) items.push({ id: 'api', label: 'API' });
    if (d.a11y) items.push({ id: 'accessibility', label: 'Accessibility' });
    if (d.examples) items.push({ id: 'examples', label: 'Examples' });
    if (d.dos || d.donts) items.push({ id: 'guidelines', label: 'Guidelines' });
    return items;
  });

  /** Previous / next entry in registry order, for sequential navigation. */
  protected readonly pager = computed(() => {
    const i = DOCS.findIndex((d) => d.slug === this.slug());
    return {
      prev: i > 0 ? DOCS[i - 1] : null,
      next: i >= 0 && i < DOCS.length - 1 ? DOCS[i + 1] : null,
    };
  });

  /** The section currently scrolled into view, for the on-this-page rail. */
  protected readonly activeId = signal('');

  protected readonly copied = signal(false);

  constructor() {
    // Highlight the section in view as the reader scrolls. Re-runs when the
    // page (and therefore its sections) changes; guarded so SSR/jsdom no-op.
    effect((onCleanup) => {
      const items = this.toc();
      if (typeof IntersectionObserver === 'undefined' || !items.length) return;

      let observer: IntersectionObserver | undefined;
      const host = this.el.nativeElement as HTMLElement;
      // Wait a frame so the new page's sections are in the DOM.
      const raf = requestAnimationFrame(() => {
        const sections = items
          .map((i) => host.querySelector<HTMLElement>(`[id="${i.id}"]`))
          .filter((s): s is HTMLElement => s !== null);
        if (!sections.length) return;

        const visible = new Set<string>();
        observer = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) visible.add(e.target.id);
              else visible.delete(e.target.id);
            }
            const active = items.find((i) => visible.has(i.id));
            if (active) this.activeId.set(active.id);
          },
          { rootMargin: '-88px 0px -66% 0px', threshold: 0 },
        );
        sections.forEach((s) => observer!.observe(s));
      });

      onCleanup(() => {
        cancelAnimationFrame(raf);
        observer?.disconnect();
      });
    });
  }

  protected sectionId(heading: string): string {
    return slugify(heading);
  }

  protected hasPreview(slug: string): boolean {
    return PREVIEWABLE.has(slug);
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
