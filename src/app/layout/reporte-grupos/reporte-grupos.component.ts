import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; 
import { DashboardService } from '../dashboard.service'; 
import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table'; 
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button'; 

interface GrupoReporte {
  ID_GRUPO: number;
  NOMBRE_GRUPO: string;
  DOCENTE_NOMBRE: string;
  TOTAL_ALUMNOS: number;
  TOTAL_ASISTENCIAS: number;
}

@Component({
  selector: 'app-reporte-grupos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './reporte-grupos.component.html',
  styleUrls: ['./reporte-grupos.component.css']
})
export class ReporteGruposComponent implements OnInit {

  displayedColumns: string[] = ['grupo', 'docente', 'resumen', 'acciones'];
  reporteGrupos: GrupoReporte[] = [];

  isLoading = true;
  errorMessage: string | null = null;
  conferenciaTitulo: string = 'Cargando...';
  idConferencia: number | null = null;

  constructor(
    private route: ActivatedRoute, 
    private dashboardService: DashboardService,
    private authService: AuthService  
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.idConferencia = +id; 
      this.cargarReporte(this.idConferencia);
    } else {
      this.errorMessage = 'No se proporcionó un ID de conferencia.';
      this.isLoading = false;
    }
  }

  cargarReporte(idConferencia: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.dashboardService.getReportePorConferencia(idConferencia).subscribe({
      next: (data: any) => {
        this.conferenciaTitulo = data.conferencia.TITULO;
        this.reporteGrupos = data.reporte_grupos;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'No se pudo cargar el reporte de grupos.';
        this.isLoading = false;
      }
    });
  }
}