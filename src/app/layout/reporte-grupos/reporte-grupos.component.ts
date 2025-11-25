import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ConferenceService } from '../conference.service';
import { GrupoService } from '../grupo.service'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-reporte-grupos',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatIconModule, 
    MatButtonModule, 
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './reporte-grupos.component.html',
  styleUrls: ['./reporte-grupos.component.css']
})
export class ReporteGruposComponent implements OnInit {

  idConferencia: number | null = null;
  conferencia: any = null;
  grupos: any[] = []; 
  
  isLoading = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private conferenceService: ConferenceService,
    private location: Location
  ) {}

  ngOnInit(): void {
  
    const idParam = this.route.snapshot.paramMap.get('idConferencia');

    if (idParam) {
      this.idConferencia = +idParam;
      this.cargarDatos();
    } else {
      this.errorMessage = 'No se proporcionó un ID de conferencia válido.';
      this.isLoading = false;
    }
  }

  cargarDatos() {
    this.isLoading = true;
    
    this.conferenceService.getConferences().subscribe({
      next: (data: any[]) => {
        const found = data.find(c => c.ID_CONFERENCIA === this.idConferencia || c.id === this.idConferencia);
        
        if (found) {
          this.conferencia = found;
   
          this.grupos = found.grupos || []; 
        } else {
          this.errorMessage = 'Conferencia no encontrada.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando conferencia', err);
        this.errorMessage = 'Error al conectar con el servidor.';
        this.isLoading = false;
      }
    });
  }

  volver() {
    this.location.back();
  }
}