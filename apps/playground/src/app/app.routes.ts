import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    title: 'Lumina UI — enterprise Angular design system platform',
    loadComponent: () =>
      import('./pages/landing/landing').then((m) => m.LandingPage),
  },
  {
    path: 'docs',
    title: 'Getting started · Lumina UI',
    loadComponent: () => import('./pages/docs/docs').then((m) => m.DocsPage),
  },
  {
    path: 'components',
    title: 'Components · Lumina UI',
    loadComponent: () =>
      import('./pages/components/components').then((m) => m.ComponentsPage),
  },
  {
    path: 'playground',
    title: 'Playground · Lumina UI',
    loadComponent: () =>
      import('./pages/showcase/showcase').then((m) => m.ShowcasePage),
  },
  { path: '**', redirectTo: '' },
];
