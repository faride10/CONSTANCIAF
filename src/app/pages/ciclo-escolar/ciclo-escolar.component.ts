import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConferenceService } from '../../layout/conference.service'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ciclo-escolar',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './ciclo-escolar.component.html',
  styleUrl: './ciclo-escolar.component.css'
})
export class CicloEscolarComponent {

  constructor(private conferenceService: ConferenceService) {}

  ejecutarCierre() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción archivará todas las conferencias actuales del ITSAL.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar ciclo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.conferenceService.archivarPeriodo(1).subscribe({
          next: (res: any) => {
            Swal.fire(
              '¡Archivado!',
              'El periodo ha sido cerrado correctamente.',
              'success'
            );
          },
          error: (err: any) => {
            Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
          }
        });
      }
    });
  }
}