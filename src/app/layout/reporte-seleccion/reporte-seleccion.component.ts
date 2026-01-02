import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConferenceService } from '../conference.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reporte-seleccion',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './reporte-seleccion.component.html',
  styleUrls: ['./reporte-seleccion.component.css']
})
export class ReporteSeleccionComponent implements OnInit {
  
  conferencias: any[] = []; 
  
  isLoading = true;

  constructor(private conferenceService: ConferenceService) {}

  ngOnInit(): void {
    this.cargarConferencias();
  }

  cargarConferencias() {
    this.isLoading = true;
    this.conferenceService.getConferences().subscribe({
      next: (data) => {
        this.conferencias = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar conferencias', err);
        this.isLoading = false;
      }
    });
  }
}