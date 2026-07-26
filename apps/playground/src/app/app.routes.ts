import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Lumina UI — enterprise Angular design system platform',
    loadComponent: () =>
      import('./pages/landing/landing').then((m) => m.LandingPage),
  },
  {
    path: 'docs',
    loadComponent: () =>
      import('./pages/docs/docs-shell').then((m) => m.DocsShell),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Getting started · Lumina UI',
        loadComponent: () =>
          import('./pages/docs/docs-home').then((m) => m.DocsHome),
      },
      {
        path: ':slug',
        title: 'Documentation · Lumina UI',
        loadComponent: () =>
          import('./pages/docs/doc-page').then((m) => m.DocPage),
      },
    ],
  },
  {
    path: 'components',
    pathMatch: 'full',
    title: 'Components · Lumina UI',
    loadComponent: () =>
      import('./pages/catalogue/catalogue').then((m) => m.CataloguePage),
  },
  {
    path: 'components/:slug',
    title: 'Component Lab · Lumina UI',
    loadComponent: () => import('./pages/lab/lab').then((m) => m.LabPage),
  },
  { path: '**', redirectTo: '' },
];
