import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';  
import { MatInputModule } from '@angular/material/input';       
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DocenteService } from '../docente.service';

interface Alumno {
  NUM_CONTROL: string;
  NOMBRE: string;
}
interface Asistencia {
  NUM_CONTROL: string;
  alumno?: { 
    NUM_CONTROL: string;
    NOMBRE: string;
  };
}

@Component({
  selector: 'app-registro-manual',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,  
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,   
    MatInputModule,       
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './registro-manual.component.html',
  styleUrls: ['./registro-manual.component.css']
})
export class RegistroManualComponent implements OnInit {

  alumnosFaltantes: Alumno[] = [];
  alumnosFiltrados: Alumno[] = [];
  terminoBusqueda: string = '';
  isLoading = false;
  alumnoSeleccionado: Alumno | null = null;

  constructor(
    private dialogRef: MatDialogRef<RegistroManualComponent>,
    private docenteService: DocenteService,
    @Inject(MAT_DIALOG_DATA) public data: {
      idConferencia: number,
      idGrupo: number,
      alumnosDelGrupo: Alumno[],
      asistenciasActuales: Asistencia[]
    }
  ) { }

  ngOnInit(): void {
    const alumnosAsistidos = new Set(this.data.asistenciasActuales.map(a => a.NUM_CONTROL));
    this.alumnosFaltantes = this.data.alumnosDelGrupo.filter(alumno => {
      return !alumnosAsistidos.has(alumno.NUM_CONTROL);
    });
    this.alumnosFiltrados = this.alumnosFaltantes;
  }

  filtrarAlumnos(): void {
    if (!this.terminoBusqueda) {
      this.alumnosFiltrados = this.alumnosFaltantes;
      return;
    }
    const filtro = this.terminoBusqueda.toLowerCase();
    this.alumnosFiltrados = this.alumnosFaltantes.filter(alumno =>
      alumno.NOMBRE.toLowerCase().includes(filtro) ||
      alumno.NUM_CONTROL.toLowerCase().includes(filtro)
    );
  }

  seleccionarAlumno(alumno: Alumno): void {
    this.alumnoSeleccionado = alumno;
  }

  registrarAsistencia(): void {
    if (!this.alumnoSeleccionado) return;
    this.isLoading = true;

    const datosAsistencia = {
      ID_CONFERENCIA: this.data.idConferencia,
      ID_GRUPO: this.data.idGrupo,
      NUM_CONTROL: this.alumnoSeleccionado.NUM_CONTROL
    };

    this.docenteService.createAsistenciaManual(datosAsistencia).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.dialogRef.close('saved'); 
      },
      error: (err) => {
        console.error('Error al registrar manualmente:', err);
        this.isLoading = false;
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}