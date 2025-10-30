import { Routes } from '@angular/router';

import { MainLayoutComponent } from './main-layout/main-layout.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardDocenteComponent } from './dashboard-docente/dashboard-docente.component';
import { ConferenceListComponent } from './conference-list/conference-list.component'; 
import { PonenteListComponent } from './ponente-list/ponente-list.component'; 
import { GrupoListComponent } from './grupo-list/grupo-list.component';   

export const LAYOUT_ROUTES: Routes = [
  {
    path: '', 
    component: MainLayoutComponent, 
    children: [ 
      {path: 'admin', component: DashboardAdminComponent }, 
      { path: 'conferencias', component: ConferenceListComponent}, 
      {path: 'docente', component: DashboardDocenteComponent},

      {path: 'grupos', 
        component: GrupoListComponent},
      
    {path: 'ponentes', component: PonenteListComponent},
    {path: '', redirectTo: 'admin', pathMatch: 'full'}
    ]
  }
];