import { Component, OnInit } from '@angular/core'; 
import { DashboardService } from '../dashboard.service'; 
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'; 

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule   
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'   
})

export class DashboardAdminComponent implements OnInit {

  conferenciasActivas: number = 0;
  alumnosRegistrados: number = 0;
  docentesActivos: number = 0;
  constanciasEmitidas: number = 0;
  isLoading: boolean = true; 
  errorMessage: string | null = null; 
  actividadesRecientes: any[] = []; 

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadAdminSummary();
    this.loadRecentActivities();
  }

  loadAdminSummary(): void {
    this.isLoading = true; 
    this.errorMessage = null;

    this.dashboardService.getAdminSummary().subscribe({
      next: (data) => {
        this.conferenciasActivas = data.active_conferences;
        this.alumnosRegistrados = data.registered_students;
        this.docentesActivos = data.active_teachers;
        this.constanciasEmitidas = data.issued_certificates;
        this.isLoading = false; 
        console.log('Datos del dashboard cargados:', data);
      },
      error: (err) => {
        console.error('Error al cargar el resumen del dashboard:', err);
        this.errorMessage = 'No se pudieron cargar los datos del dashboard. Inténtalo más tarde.';
        this.isLoading = false; 
      }
    });
  }

  loadRecentActivities(): void {
    this.dashboardService.getRecentActivities().subscribe({
      next: (data) => {
        this.actividadesRecientes = data;
        console.log('Actividades recientes cargadas:', data);
      },
      error: (err) => {
        console.error('Error al cargar actividades recientes:', err);
      }
    });
  }
}
