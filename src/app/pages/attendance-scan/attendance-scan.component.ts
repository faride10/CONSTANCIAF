import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttendanceService } from '../../services/attendance.service';
import { ConferenceService } from '../../layout/conference.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-attendance-scan',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './attendance-scan.component.html',
  styleUrls: ['./attendance-scan.component.css']
})
export class AttendanceScanComponent implements OnInit {

  conferenceId: number = 0;
  controlNumber: string = '';
  isLoading: boolean = false;
  
  // Datos para el diseño
  conferenceName: string = 'Cargando nombre...';
  
  // Mensajes en pantalla
  message: string = '';
  messageType: 'success' | 'error' | null = null;

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
    private conferenceService: ConferenceService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.conferenceId = +params['id'];
      if (this.conferenceId) {
        this.loadConferenceInfo(this.conferenceId);
      }
    });
  }

  loadConferenceInfo(id: number) {
    this.conferenceService.getConferences().subscribe({
      next: (data: any[]) => {
        const conf = data.find(c => c.ID_CONFERENCIA === id || c.id === id);
        if (conf) {
          this.conferenceName = conf.NOMBRE_CONFERENCIA;
        } else {
          this.conferenceName = 'Conferencia no encontrada';
        }
      },
      error: (err: any) => { // Agregamos ': any' para quitar el error rojo
        console.error('Error cargando info:', err);
        this.conferenceName = 'TecNM Salina Cruz';
      }
    });
  }

  onSubmit() {
    if (!this.controlNumber || this.controlNumber.length < 8) {
      this.showMessage('Ingresa un número de control válido', 'error');
      return;
    }

    this.isLoading = true;
    this.message = '';

    const data = {
      control_number: this.controlNumber,
      conference_id: this.conferenceId
    };

    this.attendanceService.requestAttendance(data).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.showMessage('¡Asistencia registrada correctamente! ✅', 'success');
        this.controlNumber = ''; 
      },
      error: (error: any) => {
        this.isLoading = false;
        let msg = 'Error al registrar';
        if (error.error && error.error.message) msg = error.error.message;
        this.showMessage(msg, 'error');
      }
    });
  }

  showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = null;
    }, 5000);
  }
}