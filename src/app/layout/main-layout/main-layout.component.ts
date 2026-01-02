import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from '../auth.service';
import { DashboardService } from '../dashboard.service'; 
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-main-layout',
  standalone: true, 
  imports: [ 
    CommonModule,
    RouterModule, 
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    MatBadgeModule 
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'] 
})
export class MainLayoutComponent implements OnInit {

  notificaciones: any[] = []; 

  constructor(
    private authService: AuthService, 
    private dashboardService: DashboardService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    this.dashboardService.getNotificaciones().subscribe({
      next: (data: any[]) => {
        this.notificaciones = data.map((noti: any) => ({
          id: noti.id,
          titulo: noti.titulo,
          mensaje: noti.mensaje,
          tipo: noti.tipo,
          leido: noti.leido,
          icono: this.obtenerIcono(noti.tipo),
          color: this.obtenerColor(noti.tipo),
          tiempo: noti.tiempo || 'Reciente' 
        }));
        console.log('Notificaciones procesadas:', this.notificaciones);
      },
      error: (err: any) => console.error('Error cargando notificaciones', err)
    });
  }

  obtenerIcono(tipo: string): string {
    const t = tipo ? tipo.toUpperCase() : '';
    switch (t) {
      case 'CONFERENCIA': return 'event_available';
      case 'DOCENTE': return 'person_add';
      case 'ALERTA': return 'warning';
      case 'EXITO': return 'check_circle';
      default: return 'notifications';
    }
  }

  obtenerColor(tipo: string): string {
    const t = tipo ? tipo.toUpperCase() : '';
    switch (t) {
      case 'CONFERENCIA': return '#1a237e'; 
      case 'DOCENTE': return '#43a047';    
      case 'ALERTA': return '#fb8c00';     
      case 'EXITO': return '#00acc1';       
      default: return '#757575';           
    }
  }

  limpiarNotificaciones() {
    this.dashboardService.limpiarNotificaciones().subscribe({
      next: () => {
        this.notificaciones = [];
      },
      error: (err) => console.error('Error al limpiar:', err)
    });
  }

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/auth/login']); 
  }
}