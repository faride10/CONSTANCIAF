import { Routes } from '@angular/router';

export const routes: Routes = [
  
  {
    path: '',
    loadComponent: () => import('./public/home/home.component').then(m => m.HomeComponent),
  },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },

  {
    path: 'panel/admin',
    loadChildren: () => import('./layout/layout.routes').then(m => m.LAYOUT_ROUTES),
  },

  {
    path: 'panel/docente',
    loadChildren: () => import('./layout/docente.routes').then(m => m.DOCENTE_ROUTES) 
  },
  
  {
    path: 'panel',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  
  { path: '**', redirectTo: '/auth/login' }
];