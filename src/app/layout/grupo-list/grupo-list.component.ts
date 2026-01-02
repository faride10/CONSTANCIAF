import { Component, OnInit, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core'; 
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-grupo-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatIconModule, 
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule,
    MatPaginatorModule
  ],
  templateUrl: './grupo-list.component.html',
  styleUrls: ['./grupo-list.component.css']
})
export class GrupoListComponent implements OnInit, AfterViewInit { 
  
  displayedColumns: string[] = ['nombre', 'carrera', 'docente', 'acciones'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarGrupos(): void {
    this.grupoService.getGrupos().subscribe(
      (data: any) => { 
        this.dataSource.data = data; 
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
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

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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