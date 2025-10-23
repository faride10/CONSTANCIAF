import { Routes } from '@angular/router';

import { MainLayoutComponent } from './main-layout/main-layout.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardDocenteComponent } from './dashboard-docente/dashboard-docente.component';
import { ConferenceListComponent } from './conference-list/conference-list.component'; // Asegúrate de que esta importación esté

export const LAYOUT_ROUTES: Routes = [
  {
    path: '', 
    component: MainLayoutComponent, 
    children: [ 
      {
        path: 'admin', 
        component: DashboardAdminComponent
      }, 
      { 
        path: 'conferencias', 
        component: ConferenceListComponent
      }, 
      {
        path: 'docente', 
        component: DashboardDocenteComponent
      },
      {
        path: '',
        redirectTo: 'admin', 
        pathMatch: 'full'
      }
    ]
  }
];