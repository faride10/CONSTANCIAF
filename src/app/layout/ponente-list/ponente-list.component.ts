import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip'; 

import { PonenteService } from '../ponente.service'; 
import { PonenteFormComponent } from '../ponente-form/ponente-form.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-ponente-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './ponente-list.component.html',
  styleUrl: './ponente-list.component.css'
})
export class PonenteListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['nombre', 'titulo', 'cargo', 'empresa', 'correo', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ponenteService: PonenteService, 
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPonentes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPonentes(): void {
    this.isLoading = true;
    this.ponenteService.getPonentes().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar ponentes:', err);
        this.errorMessage = 'No se pudieron cargar los ponentes.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openPonenteForm(ponente?: any): void {
    const dialogRef = this.dialog.open(PonenteFormComponent, {
      // ACTUALIZACIÓN: Modal más ancho para mejor visualización
      width: '800px', 
      maxWidth: '95vw',
      data: { ponenteData: ponente }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadPonentes();
      }
    });
  }

  deletePonente(ponente: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de eliminar al ponente "${ponente.NOMBRE}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.ponenteService.deletePonente(ponente.ID_PONENTE).subscribe({
          next: () => {
            console.log('Ponente eliminado');
            this.loadPonentes();
          },
          error: (err) => {
            console.error('Error al eliminar ponente:', err);
            this.errorMessage = 'Error al eliminar el ponente.';  
            this.isLoading = false;
          }
        });
      }
    });
  }
}