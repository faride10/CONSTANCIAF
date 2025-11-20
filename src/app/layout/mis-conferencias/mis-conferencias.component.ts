import { Component, OnInit } from '@angular/core';
// 1. IMPORTA 'DatePipe' AQUÍ
import { CommonModule, DatePipe } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { DocenteService } from '../docente.service';

@Component({
  selector: 'app-mis-conferencias',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,             
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './mis-conferencias.component.html',
  styleUrls: ['./mis-conferencias.component.css']
})
export class MisConferenciasComponent implements OnInit {

  conferenciasAsignadas: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private docenteService: DocenteService) { }

  ngOnInit(): void {
    this.cargarConferencias();
  }
  
  cargarConferencias(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.docenteService.getMiGrupo().subscribe({
      next: (data) => {
        if (data && data.grupo && data.grupo.conferencias) {
          this.conferenciasAsignadas = data.grupo.conferencias;
        } else {
          this.errorMessage = 'No se encontraron conferencias asignadas a tu grupo.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener conferencias asignadas:', err);
        this.errorMessage = 'Ocurrió un error al cargar las conferencias.';
        this.isLoading = false;
      }
    });
  }
}