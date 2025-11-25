import { Routes } from '@angular/router';

import { DocenteLayoutComponent } from './docente-layout/docente-layout.component';
import { ReporteAlumnosComponent } from './reporte-alumnos/reporte-alumnos.component';

import { authGuard } from '../auth/auth.guard'; 

export const DOCENTE_ROUTES: Routes = [
  {
    path: '',
    component: DocenteLayoutComponent,
    
    canActivate: [authGuard], 
    
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
      {
        path: 'conferencia/:id/asistencia', 
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