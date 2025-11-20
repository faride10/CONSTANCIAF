import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; 
import { DashboardService } from '../dashboard.service';  
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';   

interface AlumnoReporte {
  NUM_CONTROL: string;
  NOMBRE_ALUMNO: string;
  ASISTIO: boolean;   
}

@Component({
  selector: 'app-reporte-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatChipsModule  
  ],
  templateUrl: './reporte-alumnos.component.html',
  styleUrls: ['./reporte-alumnos.component.css']
})
export class ReporteAlumnosComponent implements OnInit {

  displayedColumns: string[] = ['num_control', 'nombre', 'estatus'];
  reporteAlumnos: AlumnoReporte[] = [];

  isLoading = true;
  errorMessage: string | null = null;
  conferenciaTitulo: string = 'Cargando...';
  grupoNombre: string = 'Cargando...';
  idConferencia: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    const idConf = this.route.snapshot.paramMap.get('idConf');
    const idGrupo = this.route.snapshot.paramMap.get('idGrupo');
    
    if (idConf && idGrupo) {
      this.idConferencia = +idConf;
      this.cargarReporte(+idConf, +idGrupo);
    } else {
      this.errorMessage = 'No se proporcionaron los IDs necesarios.';
      this.isLoading = false;
    }
  }

  cargarReporte(idConferencia: number, idGrupo: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.dashboardService.getReportePorAlumnos(idConferencia, idGrupo).subscribe({
      next: (data: any) => {
        this.conferenciaTitulo = data.conferencia.TITULO;
        this.grupoNombre = data.grupo.NOMBRE_GRUPO;
        this.reporteAlumnos = data.reporte_alumnos;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'No se pudo cargar el reporte de alumnos.';
        this.isLoading = false;
      }
    });
  }
}