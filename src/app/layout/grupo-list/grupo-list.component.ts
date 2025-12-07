import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { GrupoFormComponent } from '../grupo-form/grupo-form.component';
import { GrupoService } from '../grupo.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ConfirmationDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-grupo-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatIconModule, 
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule
    
  ],
  templateUrl: './grupo-list.component.html',
  styleUrls: ['./grupo-list.component.css']
})
export class GrupoListComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'carrera', 'docente', 'acciones'];
  dataSource: MatTableDataSource<any>;

  constructor(
    private grupoService: GrupoService,
    public dialog: MatDialog,
    private viewContainerRef: ViewContainerRef
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.cargarGrupos();
  }

  cargarGrupos(): void {
    this.grupoService.getGrupos().subscribe(
      (data: any) => { this.dataSource.data = data; },
      (error: any) => { console.error("Error al cargar grupos:", error); }
    );
  }

  abrirModal(grupo?: any): void {
    const dialogRef = this.dialog.open(GrupoFormComponent, {
      width: '500px',
      disableClose: true,
      data: grupo, 
      viewContainerRef: this.viewContainerRef 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) { this.cargarGrupos(); }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminarGrupo(id: number, nombre: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: { 
        title: 'Confirmar Eliminación', 
        message: `¿Estás seguro de que deseas eliminar el grupo "${nombre}"? Esta acción no se puede deshacer.` 
      },
      viewContainerRef: this.viewContainerRef
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.grupoService.deleteGrupo(id).subscribe(
          () => {
            console.log('Grupo eliminado exitosamente');
            this.cargarGrupos(); 
          },
          (error: any) => {
            console.error('Error al eliminar el grupo:', error);
          }
        );
      }
    });
  }
}