import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLuminaTheme } from '@lumina/theme';
import { beforeEach, describe, expect, it } from 'vitest';
import { CataloguePage } from './catalogue';
import { DOCS } from '../docs/docs-registry';

describe('CataloguePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CataloguePage],
      providers: [
        provideLuminaTheme({ defaultMode: 'light' }),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('lists every non-foundation component with the right destination', () => {
    const fixture = TestBed.createComponent(CataloguePage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const expected = DOCS.filter((d) => d.group !== 'Foundations').length;
    expect(el.querySelectorAll('.cat-card')).toHaveLength(expected);

    const links = Array.from(el.querySelectorAll('.cat-card__link')).map((a) =>
      a.getAttribute('href'),
    );
    // Every component — flagship and composite — opens the interactive Lab.
    expect(links).toContain('/components/button');
    expect(links).toContain('/components/tabs');
  });
});
