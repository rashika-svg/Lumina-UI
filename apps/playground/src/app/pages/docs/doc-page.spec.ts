import { TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { provideLuminaTheme } from '@lumina/theme';
import { of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { DocPage } from './doc-page';

function render(slug: string) {
  TestBed.configureTestingModule({
    imports: [DocPage],
    providers: [
      provideLuminaTheme({ defaultMode: 'light' }),
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { paramMap: of(convertToParamMap({ slug })) },
      },
    ],
  });
  const fixture = TestBed.createComponent(DocPage);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('DocPage', () => {
  it('renders a component page with its API table and on-this-page rail', () => {
    const el = render('button');

    expect(el.querySelector('.doc__title')?.textContent).toContain('Button');
    // API table lists the component's props.
    const props = Array.from(el.querySelectorAll('.doc__prop')).map((c) =>
      c.textContent?.trim(),
    );
    expect(props).toContain('variant');

    // The table of contents is built from the sections present.
    const toc = Array.from(el.querySelectorAll('.doc-toc__link')).map((a) =>
      a.textContent?.trim(),
    );
    expect(toc).toContain('API');
    expect(toc).toContain('Accessibility');
    expect(toc).toContain('Examples');
  });

  it('shows a not-found state for an unknown slug', () => {
    const el = render('does-not-exist');
    expect(el.querySelector('.doc__missing')).not.toBeNull();
    expect(el.textContent).toContain('Page not found');
  });
});
