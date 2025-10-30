import { Component, OnInit } from '@angular/core';
import { ConferenceService } from '../conference.service';

// --- Módulos necesarios ---
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// --- ¡Importaciones para Diálogos! ---
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConferenceFormComponent } from '../conference-form/conference-form.component';
import { QrCodeGeneratorComponent } from '../qr-code-generator/qr-code-generator.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-conference-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule // ¡Asegúrate que esté aquí!
  ],
  templateUrl: './conference-list.component.html',
  styleUrl: './conference-list.component.css'
})
export class ConferenceListComponent implements OnInit {

  conferences: any[] = [];
  displayedColumns: string[] = ['nombre', 'fechaHora', 'ponente', 'lugar', 'acciones'];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private conferenceService: ConferenceService,
    private dialog: MatDialog // ¡Asegúrate de inyectarlo!
  ) {}

  ngOnInit(): void {
    this.loadConferences();
  }

  loadConferences(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.conferenceService.getConferences().subscribe({
      next: (data: any) => {
        this.conferences = data;
        this.isLoading = false;
        console.log('Conferencias cargadas:', this.conferences);
      },
      error: (err: any) => {
        console.error('Error al cargar conferencias:', err);
        this.errorMessage = 'No se pudieron cargar las conferencias.';
        this.isLoading = false;
      }
    });
  }

  // Abre el modal para "+ Nueva Conferencia" O "Editar"
  openConferenceForm(conference?: any): void { 
    const dialogRef = this.dialog.open(ConferenceFormComponent, {
      width: '600px',
      disableClose: true,
      data: { conferenceData: conference } // Pasa la conferencia (o null si es nueva)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadConferences();
      }
    });
  }

  // Abre el modal para "Generar QR"
  generateQr(conference: any): void {
    console.log('Abriendo modal QR para:', conference);
    const dialogRef = this.dialog.open(QrCodeGeneratorComponent, {
      width: '500px',
      data: { conferenceData: conference } 
    });
  }

  // --- ¡FUNCIÓN AÑADIDA/CORREGIDA! ---
  // Se llama con el botón "Editar" (lápiz)
  editConference(conference: any): void {
    console.log('Editar conferencia:', conference);
    // Reutiliza la misma función de "Nueva Conferencia", pero pasándole los datos
    this.openConferenceForm(conference); 
  }
  
  // --- ¡FUNCIÓN AÑADIDA/CORREGIDA! ---
  // Se llama con el botón "Borrar" (bote de basura)
  deleteConference(conference: any): void {
    console.log('Eliminar conferencia:', conference);
    
    // 1. Abre el modal de confirmación
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas eliminar la conferencia "${conference.NOMBRE_CONFERENCIA}"?`
      }
    });

    // 2. Escucha la respuesta
    dialogRef.afterClosed().subscribe(result => {
      // 3. Si el usuario confirmó (result === true)
      if (result === true) {
        this.isLoading = true;
        this.errorMessage = null;
        // 4. Llama al servicio para borrar (¡Asegúrate que exista en tu ConferenceService!)
        this.conferenceService.deleteConference(conference.ID_CONFERENCIA).subscribe({
          next: () => {
            console.log('Conferencia eliminada:', conference);
            this.loadConferences(); // Recarga la tabla
          },
          error: (err: any) => {
            console.error('Error al eliminar conferencia:', err);
            this.errorMessage = 'Error al eliminar la conferencia. Inténtalo de nuevo.';
            this.isLoading = false;
          }
        });
      } else {
        console.log('Eliminación cancelada');
      }
    });
  }
}