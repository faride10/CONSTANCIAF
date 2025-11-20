import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { ConferenceService } from '../conference.service';  
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Conferencia {
  ID_CONFERENCIA: number;
  NOMBRE_CONFERENCIA: string;
}

@Component({
  selector: 'app-reporte-seleccion',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reporte-seleccion.component.html',
  styleUrls: ['./reporte-seleccion.component.css']
})
export class ReporteSeleccionComponent implements OnInit {

  conferencias: Conferencia[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private conferenceService: ConferenceService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.conferenceService.getConferences().subscribe({
      next: (data: any) => {
        this.conferencias = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'No se pudieron cargar las conferencias.';
        this.isLoading = false;
      }
    });
  }
}