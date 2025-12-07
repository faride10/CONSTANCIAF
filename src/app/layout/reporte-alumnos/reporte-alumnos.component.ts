import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs'; 

import { DocenteService } from '../docente.service';
import { ConferenceService } from '../conference.service';
import { GrupoService } from '../grupo.service';

@Component({
  selector: 'app-reporte-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './reporte-alumnos.component.html',
  styleUrls: ['./reporte-alumnos.component.css']
})
export class ReporteAlumnosComponent implements OnInit {

  idConferencia: number | null = null;
  idGrupo: number | null = null;

  nombreConferencia: string = 'Cargando...';
  nombreGrupo: string = 'Cargando...';
  docenteName: string = 'Cargando...';
  
  asistencias: any[] = [];
  displayedColumns: string[] = ['foto', 'nombre', 'control', 'status', 'fecha'];
  
  isLoading = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private docenteService: DocenteService, 
    private conferenceService: ConferenceService,
    private grupoService: GrupoService
  ) {}

  ngOnInit(): void {
    const idConfParam = this.route.snapshot.paramMap.get('idConferencia');
    const idGrupoParam = this.route.snapshot.paramMap.get('idGrupo');

    if (idConfParam && idGrupoParam) {
      this.idConferencia = +idConfParam;
      this.idGrupo = +idGrupoParam;
      
      this.cargarDatosCompletos();
    } else {
      this.errorMessage = 'Faltan parámetros en la URL.';
      this.isLoading = false;
    }
  }

  cargarDatosCompletos() {
    this.isLoading = true;

    this.conferenceService.getConferences().subscribe({
      next: (data: any[]) => {
        const conf = data.find(c => c.id_conferencia === this.idConferencia || c.id === this.idConferencia);
        if (conf) this.nombreConferencia = conf.nombre_conferencia;
      }
    });

    this.grupoService.getGrupos().subscribe({
      next: (data: any[]) => {
        const grupo = data.find(g => g.id_grupo === this.idGrupo);
        if (grupo) this.nombreGrupo = grupo.nombre;
      }
    });
    
    this.cargarDocente();
   
    this.docenteService.getAsistencias(this.idConferencia!, this.idGrupo!).subscribe({
      next: (data) => {
        this.asistencias = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando asistencias', err);
        this.errorMessage = 'Error al cargar la lista de alumnos.';
        this.isLoading = false;
      }
    });
  }

  cargarDocente() {
      this.grupoService.getDocenteByGroupId(this.idGrupo!).subscribe({
          next: (data) => {
              this.docenteName = data.docenteNombre;
          },
          error: (err) => {
              console.error('Error cargando docente', err);
              this.docenteName = 'No asignado / Error';
          }
      });
  }

  volver() {
    this.location.back();
  }
}
