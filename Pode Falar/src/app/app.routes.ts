import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/tabs/tab1', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.routes').then(m => m.routes)
  },
  {
    path: 'denunciar',
    loadComponent: () =>
      import('./denunciar/denunciar.page').then(m => m.DenunciarPage)
  },
];
