import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DocenteService } from '../docente.service'; 

@Component({
  selector: 'app-docente-mi-grupo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './docente-mi-grupo.component.html',
  styleUrls: ['./docente-mi-grupo.component.css']
})
export class DocenteMiGrupoComponent implements OnInit, AfterViewInit {

  nombreGrupo: string = 'Cargando...';
  carreraGrupo: string = '...';
  isLoading = true;
  errorMessage: string | null = null;

  displayedColumns: string[] = ['numControl', 'nombre', 'email'];   
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private docenteService: DocenteService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.docenteService.getMiGrupo().subscribe({
      next: (data) => {
        if (data && data.grupo) {
          this.nombreGrupo = data.grupo.nombre;
          this.carreraGrupo = data.grupo.carrera;
          
          this.dataSource.data = data.grupo.alumnos || [];
          
          if (data.grupo.alumnos.length === 0) {
            this.errorMessage = "Aún no hay alumnos asignados a este grupo.";
          }
        } else {
          this.errorMessage = "No se te ha asignado un grupo.";
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar datos del grupo:", err);
        this.errorMessage = "No se pudo cargar la información del grupo.";
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}