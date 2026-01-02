import { Component, OnInit, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core'; 
import { ConferenceService } from '../conference.service';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { ConferenceFormComponent } from '../conference-form/conference-form.component';
import Swal from 'sweetalert2';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

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
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './conference-list.component.html',
  styleUrl: './conference-list.component.css'
})
export class ConferenceListComponent implements OnInit, AfterViewInit { 

  conferences = new MatTableDataSource<any>([]); 
  
  displayedColumns: string[] = ['nombre', 'fechaHora', 'ponente', 'lugar', 'gruposAsignados', 'acciones'];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private conferenceService: ConferenceService,
    private dialog: MatDialog,
    private viewContainerRef: ViewContainerRef 
  ) {}

  ngOnInit(): void {
    this.loadConferences();
  }

  ngAfterViewInit() {
    this.conferences.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.conferences.filter = filterValue.trim().toLowerCase();
    
    if (this.conferences.paginator) {
      this.conferences.paginator.firstPage();
    }
  }

  loadConferences(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.conferenceService.getConferences().subscribe({
      next: (data: any) => {
      
        this.conferences.data = data.filter((conf: any) => !conf.esta_archivado);

        this.conferences.filterPredicate = (data: any, filter: string) => {
          const dataStr = JSON.stringify(data).toLowerCase();
          return dataStr.indexOf(filter) !== -1;
        };

        if (this.paginator) {
          this.conferences.paginator = this.paginator;
        }

        this.isLoading = false;
        console.log('Conferencias activas cargadas:', this.conferences.data);
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
      width: '800px', 
      maxWidth: '95vw', 
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
    const dialogRef = this.dialog.open(ConferenceFormComponent, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true,
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
    
    Swal.fire({
      title: 'Confirmar Eliminación',
      text: `¿Estás seguro de que deseas eliminar la conferencia "${conference.nombre_conferencia}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.isLoading = true; 
        
        this.conferenceService.deleteConference(conference.id_conferencia).subscribe({
          next: () => {
            Swal.fire(
              '¡Eliminado!',
              'La conferencia ha sido eliminada correctamente.',
              'success'
            );
            this.loadConferences();   
          },
          error: (err: any) => {
            console.error('Error al eliminar conferencia:', err);
            Swal.fire(
              'Error',
              'No se pudo eliminar la conferencia. Inténtalo de nuevo.',
              'error'
            );
            this.isLoading = false;
          }
        });
      }
    });
  }
}