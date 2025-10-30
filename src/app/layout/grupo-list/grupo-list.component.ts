import { Component, OnInit, ViewContainerRef } from '@angular/core'; // Importar ViewContainerRef
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { GrupoFormComponent } from '../grupo-form/grupo-form.component';
import { GrupoService } from '../grupo.service';

@Component({
  selector: 'app-grupo-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatIconModule, MatButtonModule
  ],
  templateUrl: './grupo-list.component.html',
  styleUrls: ['./grupo-list.component.css']
})
export class GrupoListComponent implements OnInit {

  // --- CAMBIO CLAVE: Columnas que coinciden con el diseño y los datos (MAYÚSCULAS) ---
  displayedColumns: string[] = ['NOMBRE', 'CARRERA', 'docente', 'acciones'];
  dataSource: MatTableDataSource<any>;

  constructor(
    private grupoService: GrupoService,
    public dialog: MatDialog,
    private viewContainerRef: ViewContainerRef // Inyectar para arreglar z-index
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.cargarGrupos();
  }

  cargarGrupos(): void {
    // --- Restauramos la llamada original ---
    this.grupoService.getGrupos().subscribe(
      (data: any) => {
        console.log('Datos recibidos de la API (Reseteo):', data);
        this.dataSource.data = data;
      },
      (error: any) => {
        console.error("Error al cargar grupos (Reseteo):", error);
      }
    );
  }

  abrirModal(grupo?: any): void {
    const dialogRef = this.dialog.open(GrupoFormComponent, {
      width: '500px',
      disableClose: true,
      data: grupo, 
      viewContainerRef: this.viewContainerRef // <-- Arregla el z-index
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarGrupos(); // Recargamos si se guardó
      }
    });
  }

  eliminarGrupo(id: number): void {
    // Aquí puedes añadir tu lógica de confirmación
    // this.grupoService.deleteGrupo(id).subscribe(() => this.cargarGrupos());
    console.log("Eliminar ID:", id);
  }
}