import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ConferenceService } from '../conference.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
  ],
  templateUrl: './conference-list.component.html',
  styleUrl: './conference-list.component.css'
})
export class ConferenceListComponent implements OnInit {

  conferences: any[] = [];
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

  openConferenceForm(conference?: any): void { 
    const dialogRef = this.dialog.open(ConferenceFormComponent, {
      width: '600px',
      disableClose: true,
      data: { conferenceData: conference },
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
    this.openConferenceForm(conference); 
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