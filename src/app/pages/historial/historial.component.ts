import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ConferenceService } from '../../layout/conference.service'; 

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {
  periodosAgrupados: any[] = [];      
  conferenciasArchivadas: any[] = [];   
  periodoSeleccionado: any = null;    
  conferenciaSeleccionada: any = null;  
  grupoSeleccionado: any = null;      
  alumnosAsistencia: any[] = [];    

  columnasVisibles: string[] = ['titulo', 'ponente', 'fecha', 'total']; 

  constructor(private conferenceService: ConferenceService) {}

  ngOnInit(): void { 
    this.cargarHistorial(); 
  }

  cargarHistorial() {
    this.conferenceService.getConferences().subscribe({
      next: (res: any) => {
        const todasArchivadas = res.filter((conf: any) => conf.esta_archivado === 1);
        
        const grupos = todasArchivadas.reduce((acc: any, conf: any) => {
          const nombrePeriodo = conf.periodo?.nombre || 'Archivo Histórico';
          if (!acc[nombrePeriodo]) acc[nombrePeriodo] = [];
          acc[nombrePeriodo].push(conf);
          return acc;
        }, {});

        this.periodosAgrupados = Object.keys(grupos).map(nombre => ({
          nombre: nombre,
          conferencias: grupos[nombre]
        }));
      },
      error: (err: any) => console.error('Error al cargar el historial:', err)
    });
  }

  verPeriodo(periodo: any) {
    this.periodoSeleccionado = periodo;
    this.conferenciasArchivadas = periodo.conferencias;
  }

  verDetalleConferencia(conf: any) {
    this.conferenciaSeleccionada = conf;
    this.grupoSeleccionado = null;
  }

verAlumnos(grupo: any) {
    this.grupoSeleccionado = grupo;
    const idGrupoTarget = grupo.id_grupo || grupo.id;
    
    this.alumnosAsistencia = this.conferenciaSeleccionada.asistencias?.filter((asist: any) => {
    const idEnAsistencia = asist.id_grupo || asist.grupo_id;
    const idEnAlumno = asist.alumno?.id_grupo || asist.alumno?.grupo_id;
      
      return idEnAsistencia == idGrupoTarget || idEnAlumno == idGrupoTarget;
    }) || [];

    console.log('Alumnos filtrados para este grupo:', this.alumnosAsistencia);
  }

  volver() {
    if (this.grupoSeleccionado) { 
      this.grupoSeleccionado = null; 
    } else if (this.conferenciaSeleccionada) { 
      this.conferenciaSeleccionada = null; 
    } else if (this.periodoSeleccionado) { 
      this.periodoSeleccionado = null; 
      this.conferenciasArchivadas = [];
    }
  }
}