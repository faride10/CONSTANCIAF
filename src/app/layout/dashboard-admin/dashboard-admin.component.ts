import { Component, OnInit } from '@angular/core'; 
import { DashboardService } from '../dashboard.service'; 
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';   
import { MatDialog, MatDialogModule } from '@angular/material/dialog';  
import { ConferenceFormComponent } from '../conference-form/conference-form.component';
import { AlumnoFormComponent } from '../alumno-form/alumno-form.component';
import { GrupoFormComponent } from '../grupo-form/grupo-form.component';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule 
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'   
})

export class DashboardAdminComponent implements OnInit {

  conferenciasActivas: number = 0;
  alumnosRegistrados: number = 0;
  docentesActivos: number = 0;

  isLoading: boolean = true; 
  errorMessage: string | null = null; 
  actividadesRecientes: any[] = []; 

  constructor(
    private dashboardService: DashboardService,
    private dialog: MatDialog   
  ) {}

  ngOnInit(): void {
    this.loadAdminSummary();
    this.loadRecentActivities();
  }

  loadAdminSummary(): void {
    this.dashboardService.getAdminSummary().subscribe({
      next: (data) => {
        this.conferenciasActivas = data.active_conferences;
        this.alumnosRegistrados = data.registered_students;
        this.docentesActivos = data.active_teachers;
        this.isLoading = false; 
      },
      error: (err) => {
        console.error('Error al cargar el resumen del dashboard:', err);
        this.errorMessage = 'No se pudieron cargar los datos del dashboard.';
        this.isLoading = false; 
      }
    });
  }

  loadRecentActivities(): void {
    this.dashboardService.getRecentActivities().subscribe({
      next: (data) => {
        this.actividadesRecientes = data;
      },
      error: (err) => {
        console.error('Error al cargar actividades recientes:', err);
      }
    });
  }

  nuevaConferencia() {
    const dialogRef = this.dialog.open(ConferenceFormComponent, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true
    });

    this.recargarAlCerrar(dialogRef);
  }

  nuevoAlumno() {
    const dialogRef = this.dialog.open(AlumnoFormComponent, {
      width: '500px',
      disableClose: true
    });

    this.recargarAlCerrar(dialogRef);
  }

  nuevoGrupo() {
    const dialogRef = this.dialog.open(GrupoFormComponent, {
      width: '500px',
      disableClose: true
    });

    this.recargarAlCerrar(dialogRef);
  }

  private recargarAlCerrar(dialogRef: any) {
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === true || result === 'saved') {
        this.loadAdminSummary();
        this.loadRecentActivities();
      }
    });
  }
}