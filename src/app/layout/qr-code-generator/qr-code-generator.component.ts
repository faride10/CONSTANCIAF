import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { Location, CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   

import { DocenteService } from '../docente.service'; 
import { ConferenceService } from '../conference.service'; 

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';  
import { MatInputModule } from '@angular/material/input';           
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QrCodeDisplayComponent } from '../qr-code-display/qr-code-display.component'; 
import { RegistroManualComponent } from '../registro-manual/registro-manual.component'; 

@Component({
  selector: 'app-qr-code-generator', 
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,  
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,   
    MatInputModule,       
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './qr-code-generator.component.html',
  styleUrls: ['./qr-code-generator.component.css']
})
export class QrCodeGeneratorComponent implements OnInit, AfterViewInit {

  tituloConferencia: string = 'Cargando...';
  nombreGrupo: string = 'Cargando...';
  carreraGrupo: string = '...';
  contadorAsistencia: number = 0;
  totalAlumnos: number = 0;
  idConferencia: number | null = null;
  idGrupo: number | null = null;
  isLoading = true;
  alumnosDelGrupo: any[] = []; 
  
  filterValue: string = '';   

  displayedColumns: string[] = ['nombre', 'numControl', 'fechaRegistro', 'acciones'];
  dataSource = new MatTableDataSource<any>(); 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute, 
    private docenteService: DocenteService, 
    private location: Location, 
    public dialog: MatDialog 
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.idConferencia = +this.route.snapshot.paramMap.get('id')!;
    this.docenteService.getMiGrupo().subscribe({
      next: (data) => {
        if (!data || !data.grupo) throw new Error('No se pudo obtener el grupo.');
        
        this.idGrupo = data.grupo.id_grupo;
        this.nombreGrupo = data.grupo.nombre;
        this.carreraGrupo = data.grupo.carrera;
        this.totalAlumnos = data.grupo.alumnos?.length || 0;
        this.alumnosDelGrupo = data.grupo.alumnos || [];

        const miConferencia = data.grupo.conferencias?.find((c: any) => c.id_conferencia == this.idConferencia); 
        this.tituloConferencia = miConferencia?.nombre_conferencia || 'Detalle de Conferencia';

        this.cargarAsistencias();
      },
      error: (err) => {
        console.error("Error al cargar datos del grupo:", err);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarAsistencias(): void {
    if (!this.idConferencia || !this.idGrupo) return;
    this.docenteService.getAsistencias(this.idConferencia, this.idGrupo).subscribe({
      next: (asistencias) => {
        this.dataSource.data = asistencias; 
        this.contadorAsistencia = asistencias.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar asistencias:", err);
        this.isLoading = false;
      }
    });
  }

  applyFilter() {   
    const filterValue = this.filterValue; 
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abrirModalQR(): void {
    this.dialog.open(QrCodeDisplayComponent, {
      width: '400px',
      data: { 
        idConferencia: this.idConferencia, 
        idGrupo: this.idGrupo,
        nombreConferencia: this.tituloConferencia,
        nombreGrupo: this.nombreGrupo
      }
    });
  }

  volverAtras(): void {
    this.location.back();
  }
  
  eliminarAsistencia(asistencia: any): void {
    const nombreAlumno = asistencia.alumno?.nombre || 'este alumno';
    if (!confirm(`¿Estás seguro de que deseas eliminar la asistencia de "${nombreAlumno}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.docenteService.deleteAsistencia(asistencia.id_asistencia).subscribe({
      next: () => {
        console.log('Asistencia eliminada');
        this.cargarAsistencias(); 
      },
      error: (err) => {
        console.error('Error al eliminar asistencia:', err);
        alert('No se pudo eliminar la asistencia.');
      }
    });
  }

  abrirModalRegistroManual(): void {
    const dialogRef = this.dialog.open(RegistroManualComponent, {
      width: '500px', 
      data: { 
        idConferencia: this.idConferencia,
        idGrupo: this.idGrupo,
        alumnosDelGrupo: this.alumnosDelGrupo, 
        asistenciasActuales: this.dataSource.data 
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.cargarAsistencias(); 
      }
    });
  }
}