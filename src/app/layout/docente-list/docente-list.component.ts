import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DocenteFormComponent } from '../docente-form/docente-form.component';
import { DocenteService } from '../docente.service';
import { ConfirmationDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

import { DocenteImportComponent } from '../docente-import/docente-import.component';  

@Component({
  selector: 'app-docente-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule
  ],
  templateUrl: './docente-list.component.html', 
  styleUrls: ['./docente-list.component.css']
})
export class DocenteListComponent implements OnInit {   

  displayedColumns: string[] = ['nombre', 'rfc', 'correo', 'grupo', 'acciones'];
  dataSource: MatTableDataSource<any>;

  constructor(
    private docenteService: DocenteService,
    public dialog: MatDialog,
    private viewContainerRef: ViewContainerRef
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.cargarDocentes();
  }

  cargarDocentes(): void {
    this.docenteService.getDocentes().subscribe(
      (data: any) => {
        this.dataSource.data = data;
      },
      (error: any) => {
        console.error("Error al cargar docentes:", error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirModal(docente?: any): void {
    const dialogRef = this.dialog.open(DocenteFormComponent, {
      width: '500px',
      disableClose: true,
      data: docente, 
      viewContainerRef: this.viewContainerRef 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarDocentes(); 
      }
    });
  }

  eliminarDocente(id: number, nombre: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: { 
        title: 'Confirmar Eliminación', 
        message: `¿Estás seguro de que deseas eliminar al docente "${nombre}"? Esta acción también eliminará su cuenta de usuario.` 
      },
      viewContainerRef: this.viewContainerRef
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.docenteService.deleteDocente(id).subscribe(
          () => {
            this.cargarDocentes(); 
          },
          (error: any) => {
            console.error('Error al eliminar el docente:', error);
          }
        );
      }
      
    });
  }

  abrirModalImportar(): void {
    const dialogRef = this.dialog.open(DocenteImportComponent, {
      width: '550px',
      disableClose: true,
      viewContainerRef: this.viewContainerRef 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarDocentes(); 
      }
    });
  }
  
}