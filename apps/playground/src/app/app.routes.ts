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
    title: 'Getting started · Lumina UI',
    loadComponent: () => import('./pages/docs/docs').then((m) => m.DocsPage),
  },
  { path: 'components', pathMatch: 'full', redirectTo: 'components/button' },
  {
    path: 'components/:slug',
    title: 'Component Lab · Lumina UI',
    loadComponent: () => import('./pages/lab/lab').then((m) => m.LabPage),
  },
  { path: '**', redirectTo: '' },
];
