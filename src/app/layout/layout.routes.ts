import { Routes } from '@angular/router';

import { MainLayoutComponent } from './main-layout/main-layout.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';

import { ConferenceListComponent } from './conference-list/conference-list.component';
import { PonenteListComponent } from './ponente-list/ponente-list.component';
import { GrupoListComponent } from './grupo-list/grupo-list.component';
import { DocenteListComponent } from './docente-list/docente-list.component'; 

import { ReporteSeleccionComponent } from './reporte-seleccion/reporte-seleccion.component';
import { ReporteGruposComponent } from './reporte-grupos/reporte-grupos.component';
import { ReporteAlumnosComponent } from './reporte-alumnos/reporte-alumnos.component';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent, 
    children: [
      { path: 'admin', component: DashboardAdminComponent },
      { path: 'conferencias', component: ConferenceListComponent },
      { path: 'ponentes', component: PonenteListComponent },
      { path: 'grupos', component: GrupoListComponent },
            { path: 'docentes', component: DocenteListComponent }, 
  
      { 
        path: 'alumnos', 
        loadComponent: () => import('./alumno-list/alumno-list.component').then(m => m.AlumnoListComponent) 
      },
      {
        path: 'reporte-asistencia', 
        component: ReporteSeleccionComponent
      },

      { path: '', redirectTo: 'admin', pathMatch: 'full' }
    ]
  }
];