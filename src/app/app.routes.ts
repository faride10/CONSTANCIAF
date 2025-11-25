import { Routes } from '@angular/router';
import { AttendanceScanComponent } from './pages/attendance-scan/attendance-scan.component';

// Importamos el Guardia (Asegúrate de que este archivo exista y esté correcto)
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

  // 1. BLINDAMOS EL ACCESO AL ADMIN AQUÍ MISMO
  {
    path: 'panel/admin',
    canActivate: [authGuard], // <--- CANDADO APLICADO
    loadChildren: () => import('./layout/layout.routes').then(m => m.LAYOUT_ROUTES),
  },

  // 2. BLINDAMOS EL ACCESO AL DOCENTE AQUÍ MISMO
  {
    path: 'panel/docente',
    canActivate: [authGuard], // <--- CANDADO APLICADO
    loadChildren: () => import('./layout/docente.routes').then(m => m.DOCENTE_ROUTES) 
  },

  // 3. Ruta genérica (queda sin cambios, pero debe ir abajo de las específicas)
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