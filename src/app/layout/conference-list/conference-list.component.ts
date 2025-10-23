import { Component, OnInit } from '@angular/core';
import { ConferenceService } from '../conference.service';
// --- Importaciones Necesarias ---
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// --- ¡Importa MatDialog y MatDialogModule! ---
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// Importa el componente del modal QR
import { QrCodeGeneratorComponent } from '../qr-code-generator/qr-code-generator.component';
// Importa el componente del formulario de conferencia
import { ConferenceFormComponent } from '../conference-form/conference-form.component';


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
    MatDialogModule // Asegúrate que esté importado aquí
  ],
  templateUrl: './conference-list.component.html',
  styleUrl: './conference-list.component.css'
})
export class ConferenceListComponent implements OnInit {

  conferences: any[] = [];
  displayedColumns: string[] = ['nombre', 'fechaHora', 'ponente', 'lugar', 'acciones'];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // --- ¡Inyecta MatDialog en el constructor! ---
  constructor(
    private conferenceService: ConferenceService,
    private dialog: MatDialog // Inyectamos el servicio MatDialog
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

  // Abre el modal para crear/editar conferencia
  openConferenceForm(conference?: any): void { // Añadimos parámetro opcional para editar
    const dialogRef = this.dialog.open(ConferenceFormComponent, {
      width: '600px',
      disableClose: true,
      data: { conferenceData: conference } // Pasa la conferencia si es para editar
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadConferences(); // Recarga si se guardó
      }
    });
  }

  // --- ¡Asegúrate que esta función use dialog.open! ---
  generateQr(conference: any): void {
    console.log('Abriendo modal QR para:', conference); // Mensaje en consola está bien

    // ¡ESTA ES LA LÍNEA CLAVE QUE ABRE EL MODAL!
    const dialogRef = this.dialog.open(QrCodeGeneratorComponent, {
      width: '500px',
      data: { conferenceData: conference } // Pasa la info de la conferencia al modal
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal QR cerrado');
    });
  }
  // --- FIN generateQr ---

  editConference(conference: any): void {
    console.log('Editar conferencia:', conference);
    this.openConferenceForm(conference); // Reutiliza la función del modal de formulario
  }

  deleteConference(conference: any): void {
    console.log('Eliminar conferencia:', conference);
    // Aquí iría la lógica para llamar a la API y borrar,
    // probablemente mostrando un modal de confirmación antes.
  }
}