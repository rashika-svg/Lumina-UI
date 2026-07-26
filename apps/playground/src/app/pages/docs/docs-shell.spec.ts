import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLuminaTheme } from '@lumina/theme';
import { beforeEach, describe, expect, it } from 'vitest';
import { DocsShell } from './docs-shell';

describe('DocsShell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsShell],
      providers: [
        provideLuminaTheme({ defaultMode: 'light' }),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('renders grouped navigation with a getting-started link', () => {
    const fixture = TestBed.createComponent(DocsShell);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const groups = Array.from(el.querySelectorAll('.docs__group')).map((g) =>
      g.textContent?.trim(),
    );
    expect(groups).toEqual(['Foundations', 'Components', 'Feedback']);

    // Getting started + 11 registry entries.
    expect(el.querySelectorAll('.docs__link')).toHaveLength(12);
    expect(el.querySelector('.docs__link')?.textContent).toContain(
      'Getting started',
    );
  });
});
