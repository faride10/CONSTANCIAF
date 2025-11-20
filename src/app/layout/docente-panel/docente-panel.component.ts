import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';  
import Swal from 'sweetalert2';   
import { DocenteService } from '../docente.service';
@Component({
  selector: 'app-docente-panel',
  standalone: true,
  
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule  
  ],
  templateUrl: './docente-panel.component.html',
  styleUrls: ['./docente-panel.component.css']
})
export class DocentePanelComponent implements OnInit {

  isLoading: boolean = false;
  dashboardData: any = null;  

  constructor(private docenteService: DocenteService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.docenteService.getDashboardSummary().subscribe({
      next: (data: any) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        if (err.status === 404) {
            Swal.fire({
                title: 'Atención',
                text: 'No tienes un grupo asignado. Comunícate con tu administrador para gestionar tu carga.',
                icon: 'warning',
                confirmButtonColor: '#ff9800'   
            });
        } else {
            Swal.fire({
                title: 'Error de Conexión',
                text: 'No se pudo cargar el resumen del panel. Intenta recargar la página.',
                icon: 'error'
            });
        }
      }
    });
  }
}