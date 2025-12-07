import { Routes } from '@angular/router';
import { AttendanceScanComponent } from './pages/attendance-scan/attendance-scan.component';
import { authGuard } from './auth/auth.guard';

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
    canActivate: [authGuard], 
    loadChildren: () => import('./layout/layout.routes').then(m => m.LAYOUT_ROUTES),
  },

  {
    path: 'panel/docente',
    canActivate: [authGuard], 
    loadChildren: () => import('./layout/docente.routes').then(m => m.DOCENTE_ROUTES) 
  },

  {
    path: 'panel',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },

  { path: 'asistencia/:id', 
    component: AttendanceScanComponent 
  },

  { path: '**',
    redirectTo: '/auth/login' 
  },
];