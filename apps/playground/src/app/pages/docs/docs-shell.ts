import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DOC_GROUPS, DOCS, type DocGroup } from './docs-registry';

interface NavGroup {
  readonly label: DocGroup;
  readonly items: readonly { slug: string; title: string }[];
}

/** Documentation shell — a persistent left-nav sidebar around the doc content. */
@Component({
  selector: 'lpg-docs-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './docs-shell.html',
  styleUrl: './docs-shell.css',
})
export class DocsShell {
  protected readonly navOpen = signal(false);

  protected readonly groups: readonly NavGroup[] = DOC_GROUPS.map((label) => ({
    label,
    items: DOCS.filter((d) => d.group === label).map((d) => ({
      slug: d.slug,
      title: d.title,
    })),
  }));

  protected toggleNav(): void {
    this.navOpen.update((v) => !v);
  }

  protected closeNav(): void {
    this.navOpen.set(false);
  }
}
