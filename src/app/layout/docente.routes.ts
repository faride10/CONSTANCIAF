import { Routes } from '@angular/router';
import { DocenteLayoutComponent } from './docente-layout/docente-layout.component';
import { ReporteAlumnosComponent } from './reporte-alumnos/reporte-alumnos.component';

// 1. Importaciones necesarias para el Guard
import { inject } from '@angular/core';
import { AuthService } from './auth.service';import { Router } from '@angular/router';

// Función canActivate que verifica la sesión
const isAuthenticatedGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isUserLogged = authService.isLoggedIn(); // Guarda el resultado de la función

  // LÍNEA DE DIAGNÓSTICO CLAVE
  console.log('GUARD CHECK:', isUserLogged, ' (Si es false, te redirige)'); 

  if (isUserLogged) {
    return true; // Usuario logueado, permite el acceso
  } else {
    // Si no está logueado, redirige al login principal
    router.navigate(['/auth/login']);
    return false;
  }
};

export const DOCENTE_ROUTES: Routes = [
  {
    path: '',
    component: DocenteLayoutComponent,
    // 2. APLICACIÓN DEL GUARD: Protege todos los hijos
    canActivate: [isAuthenticatedGuard], 
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./docente-panel/docente-panel.component').then(m => m.DocentePanelComponent)
      },
      {
        path: 'mi-grupo',
        loadComponent: () => import('./docente-mi-grupo/docente-mi-grupo.component').then(m => m.DocenteMiGrupoComponent) 
      },
      {
        path: 'mis-conferencias',
        loadComponent: () => import('./mis-conferencias/mis-conferencias.component').then(m => m.MisConferenciasComponent)
      },
      // La navegación a 'asistencia/:id' ahora estará protegida por el guard de arriba.
      {
        path: 'asistencia/:id', 
        loadComponent: () => import('./asistencia/asistencia.component').then(m => m.AsistenciaComponent)
      },
      {
        path: 'perfil', 
        loadComponent: () => import('./docente-perfil/docente-perfil.component').then(m => m.DocentePerfilComponent)
      },
      {
        path: 'reporte-alumnos/:idConf/:idGrupo',
        component: ReporteAlumnosComponent 
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  }
];