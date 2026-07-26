import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLuminaTheme } from '@lumina/theme';
import { beforeEach, describe, expect, it } from 'vitest';
import { CataloguePage } from './catalogue';

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

  it('lists every flagship component, each linking into the Lab', () => {
    const fixture = TestBed.createComponent(CataloguePage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('.cat-card')).toHaveLength(8);

    const links = Array.from(el.querySelectorAll('.cat-card__link')).map((a) =>
      a.getAttribute('href'),
    );
    expect(links).toContain('/components/button');
    expect(links).toContain('/components/skeleton');
  });
});
