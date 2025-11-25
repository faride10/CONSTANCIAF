import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlumnoFormComponent } from '../alumno-form/alumno-form.component';
import { AlumnoService } from '../alumno.service';

import { ConfirmationDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

import { AlumnoImportComponent } from '../alumno-import/alumno-import.component';

@Component({
  selector: 'app-alumno-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule,
    
  ],
  templateUrl: './alumno-list.component.html',
  styleUrls: ['./alumno-list.component.css']
})
export class AlumnoListComponent implements OnInit {

  displayedColumns: string[] = ['NOMBRE', 'NUM_CONTROL', 'CORREO_INSTITUCIONAL', 'grupo', 'acciones'];
  dataSource: MatTableDataSource<any>;

  constructor(
    private alumnoService: AlumnoService,
    public dialog: MatDialog,
    private viewContainerRef: ViewContainerRef
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos(): void {
    this.alumnoService.getAlumnos().subscribe(
      (data: any) => {
        this.dataSource.data = data;
      },
      (error: any) => {
        console.error("Error al cargar alumnos:", error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirModal(alumno?: any): void {
    const dialogRef = this.dialog.open(AlumnoFormComponent, {
      width: '500px',
      disableClose: true,
      data: alumno, 
      viewContainerRef: this.viewContainerRef 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarAlumnos(); 
      }
    });
  }

  eliminarAlumno(numControl: string, nombre: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: { 
        title: 'Confirmar Eliminación', 
        message: `¿Estás seguro de que deseas eliminar al alumno "${nombre}"?` 
      },
      viewContainerRef: this.viewContainerRef
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.alumnoService.deleteAlumno(numControl).subscribe(
          () => {
            this.cargarAlumnos(); 
          },
          (error: any) => {
            console.error('Error al eliminar el alumno:', error);
          }
        );
      }
    }); 
  } 

  abrirModalImportar(): void {
    const dialogRef = this.dialog.open(AlumnoImportComponent, {
      width: '550px',
      disableClose: true,
      viewContainerRef: this.viewContainerRef 
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result === true) {
        this.cargarAlumnos(); 
      }
    });
  }
} 