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

  protected readonly copied = signal(false);

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
