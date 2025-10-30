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
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { PonenteFormComponent } from '../ponente-form/ponente-form.component'; // ¡Importa el formulario de ponente!

@Component({
  selector: 'app-ponente-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule // <-- Asegúrate que MatDialogModule esté aquí
  ],
  templateUrl: './ponente-list.component.html',
  styleUrl: './ponente-list.component.css'
})
export class PonenteListComponent implements OnInit {

  ponentes: any[] = [];
  displayedColumns: string[] = ['nombre', 'titulo', 'empresa_cargo', 'correo', 'acciones'];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private conferenceService: ConferenceService,
    private dialog: MatDialog // <-- Asegúrate de inyectar MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPonentes();
  }

  loadPonentes(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.conferenceService.getPonentes().subscribe({
      next: (data: any) => {
        this.ponentes = data;
        this.isLoading = false;
        console.log('Ponentes cargados:', this.ponentes);
      },
      error: (err: any) => {
        console.error('Error al cargar ponentes:', err);
        this.errorMessage = 'No se pudieron cargar los ponentes.';
        this.isLoading = false;
      }
    });
  }

  // --- ¡FUNCIÓN CORREGIDA Y COMPLETADA! ---
  // Se llama con el botón "+ Nuevo Ponente" o "Editar"
  openPonenteForm(ponente?: any): void {
    console.log('Abrir formulario para:', ponente ? ponente : 'Nuevo Ponente');
    
    // Abre el PonenteFormComponent en un modal
    const dialogRef = this.dialog.open(PonenteFormComponent, {
      width: '500px', // Ancho del modal de formulario
      disableClose: true,
      data: { ponenteData: ponente } // Pasa el ponente (null si es nuevo)
    });

    // Escucha si el modal se cerró guardando
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadPonentes(); // Recargamos la lista
      }
    });
  }
  // --- FIN openPonenteForm ---

  // --- ¡FUNCIÓN CORREGIDA Y COMPLETADA! ---
  // Se llama con el botón "Borrar"
  deletePonente(ponente: any): void {
    // 1. Abre el modal de confirmación
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas eliminar a ${ponente.NOMBRE}?`
      }
    });

    // 2. Escucha la respuesta
    dialogRef.afterClosed().subscribe(result => {
      // 3. Si el usuario confirmó (result === true)
      if (result === true) {
        this.isLoading = true;
        this.errorMessage = null;

        // 4. Llama al servicio para borrar
        this.conferenceService.deletePonente(ponente.ID_PONENTE).subscribe({
          next: () => {
            console.log('Ponente eliminado:', ponente);
            this.loadPonentes(); // Recarga la tabla
          },
          error: (err: any) => {
            console.error('Error al eliminar ponente:', err);
            this.errorMessage = 'Error al eliminar el ponente. Inténtalo de nuevo.';
            this.isLoading = false;
          }
        });
      } else {
        // El usuario hizo clic en "Cancelar"
        console.log('Eliminación cancelada');
      }
    });
  }
  // --- FIN deletePonente ---

} // <-- Cierre de la CLASE