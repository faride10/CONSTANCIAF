import { Component, OnInit, OnDestroy } from '@angular/core';
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
  selector: 'app-docente-layout',
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
  templateUrl: './docente-layout.component.html',
  styleUrls: ['./docente-layout.component.css'] 
})
export class DocenteLayoutComponent implements OnInit, OnDestroy {

  notificaciones: any[] = [];
  private intervalId: any;

  constructor(
    private authService: AuthService, 
    private dashboardService: DashboardService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarNotificaciones();
    this.intervalId = setInterval(() => this.cargarNotificaciones(), 30000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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
      },
      error: (err: any) => console.error('Error cargando notificaciones del docente', err)
    });
  }

  get unreadCount(): number {
    return this.notificaciones.filter(n => !n.leido).length;
  }

  obtenerIcono(tipo: string): string {
    const t = tipo ? tipo.toUpperCase() : '';
    switch (t) {
      case 'SUCCESS': 
      case 'EXITO': return 'check_circle'; 
      case 'ALERTA': return 'warning';
      default: return 'notifications';
    }
  }

  obtenerColor(tipo: string): string {
    const t = tipo ? tipo.toUpperCase() : '';
    switch (t) {
      case 'SUCCESS':
      case 'EXITO': return '#43a047'; 
      case 'ALERTA': return '#fb8c00'; 
      default: return '#757575'; 
    }
  }

  limpiarNotificaciones() {
    this.dashboardService.limpiarNotificaciones().subscribe({
      next: () => {
        this.notificaciones = [];
      },
      error: (err: any) => console.error('Error al limpiar:', err)
    });
  }

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/auth/login']); 
  }
}