import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ConferenceService } from '../conference.service';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; // <--- Importamos MatTableDataSource
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip'; // Agregué Tooltip por si lo usas en el HTML
import { ConferenceFormComponent } from '../conference-form/conference-form.component';
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
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './conference-list.component.html',
  styleUrl: './conference-list.component.css'
})
export class ConferenceListComponent implements OnInit {

  // CAMBIO IMPORTANTE: Usamos MatTableDataSource para permitir filtrado
  conferences = new MatTableDataSource<any>([]); 
  
  displayedColumns: string[] = ['nombre', 'fechaHora', 'ponente', 'lugar', 'gruposAsignados', 'acciones'];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private conferenceService: ConferenceService,
    private dialog: MatDialog,
    private viewContainerRef: ViewContainerRef 
  ) {}

  ngOnInit(): void {
    this.loadConferences();
  }

  /**
   * LOGICA DEL BUSCADOR
   * Esto conecta con el (keyup)="applyFilter($event)" del HTML
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.conferences.filter = filterValue.trim().toLowerCase();
  }

  loadConferences(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.conferenceService.getConferences().subscribe({
      next: (data: any) => {
        // Asignamos los datos a la propiedad .data del DataSource
        this.conferences.data = data;
        
        // CONFIGURACIÓN EXTRA:
        // Esto ayuda a que el buscador encuentre texto también en el nombre del ponente
        this.conferences.filterPredicate = (data: any, filter: string) => {
          const dataStr = JSON.stringify(data).toLowerCase();
          return dataStr.indexOf(filter) !== -1;
        };

        this.isLoading = false;
        console.log('Conferencias cargadas:', this.conferences.data);
      },
      error: (err: any) => {
        console.error('Error al cargar conferencias:', err);
        this.errorMessage = 'No se pudieron cargar las conferencias.';
        this.isLoading = false;
      }
    });
  }

  openConferenceForm(conference?: any): void { 
    const dialogRef = this.dialog.open(ConferenceFormComponent, {
      // CAMBIO VISUAL: Hacemos el modal más ancho (800px)
      width: '800px', 
      maxWidth: '95vw', // Para que no se salga en celulares
      disableClose: true,
      data: { conferenceData: conference }, // Nota: Asegúrate que tu Form reciba 'conferenceData' o 'conference'
      viewContainerRef: this.viewContainerRef   
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadConferences();
      }
    });
  }

  editConference(conference: any): void {
    console.log('Editar conferencia:', conference);
    // Al editar, reutilizamos la lógica del formulario ancho
    const dialogRef = this.dialog.open(ConferenceFormComponent, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true,
      // Aquí pasamos isEditMode para que el formulario sepa qué hacer
      data: { conferenceData: conference, isEditMode: true }, 
      viewContainerRef: this.viewContainerRef
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadConferences();
      }
    });
  }
  
  deleteConference(conference: any): void {
    console.log('Eliminar conferencia:', conference);
    
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas eliminar la conferencia "${conference.NOMBRE_CONFERENCIA}"?`
      },
      viewContainerRef: this.viewContainerRef   
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.isLoading = true;
        this.errorMessage = null;
        this.conferenceService.deleteConference(conference.ID_CONFERENCIA).subscribe({
          next: () => {
            console.log('Conferencia eliminada:', conference);
            this.loadConferences();   
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