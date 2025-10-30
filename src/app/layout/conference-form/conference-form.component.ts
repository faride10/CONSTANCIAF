import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConferenceService } from '../conference.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-conference-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './conference-form.component.html',
  styleUrl: './conference-form.component.css'
})
export class ConferenceFormComponent implements OnInit {
  conferenceForm: FormGroup;
  ponentes: any[] = [];
  isLoadingPonentes = false;
  errorMessage: string | null = null;
  isEditMode: boolean = false;
  currentConferenceId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConferenceFormComponent>,
    private conferenceService: ConferenceService,
    @Inject(MAT_DIALOG_DATA) public data: { conferenceData: any }
  ) {
    if (data && data.conferenceData) {
      this.isEditMode = true;
      const conference = data.conferenceData;
      this.currentConferenceId = conference.ID_CONFERENCIA;
      
      this.conferenceForm = this.fb.group({
        FECHA: [conference.FECHA_HORA ? new Date(conference.FECHA_HORA) : null, Validators.required],
        HORA: [conference.FECHA_HORA ? new Date(conference.FECHA_HORA).toTimeString().substring(0, 5) : null, Validators.required],
        NOMBRE_CONFERENCIA: [conference.NOMBRE_CONFERENCIA, Validators.required],
        TEMA: [conference.TEMA],
        LUGAR: [conference.LUGAR, Validators.required],
        NUM_PARTICIPANTES: [conference.NUM_PARTICIPANTES, Validators.pattern('^[0-9]*$')],
        ID_PONENTE: [conference.ID_PONENTE]
      });
    } else {
      this.isEditMode = false;
      this.conferenceForm = this.fb.group({
        NOMBRE_CONFERENCIA: ['', Validators.required],
        TEMA: [''],
        FECHA: [null, Validators.required],
        HORA: [null, Validators.required],
        LUGAR: ['', Validators.required],
        NUM_PARTICIPANTES: [null, Validators.pattern('^[0-9]*$')],
        ID_PONENTE: [null]
      });
    }
  }

  ngOnInit(): void {
    this.loadPonentes();
  }

  loadPonentes(): void {
    this.isLoadingPonentes = true;
    this.conferenceService.getPonentes().subscribe({
      next: (data: any) => {
        this.ponentes = data;
        this.isLoadingPonentes = false;
      },
      error: (err: any) => {
        console.error('Error al cargar ponentes:', err);
        this.isLoadingPonentes = false;
      }
    });
  }

  onSave(): void {
    this.conferenceForm.markAllAsTouched();
    if (this.conferenceForm.invalid) {
      this.errorMessage = 'Por favor, completa los campos requeridos.';
      return;
    }
    this.errorMessage = null;

    if (this.isEditMode && this.currentConferenceId) {
      this.conferenceService.updateConference(this.currentConferenceId, this.conferenceForm.value).subscribe({
        next: (response: any) => {
          console.log('Conferencia actualizada:', response);
          this.dialogRef.close('saved');
        },
        error: (err: any) => {
          console.error('Error al actualizar conferencia:', err);
          this.errorMessage = 'Error al actualizar la conferencia.';
        }
      });
    } else {
      this.conferenceService.createConference(this.conferenceForm.value).subscribe({
        next: (response: any) => {
          console.log('Conferencia creada:', response);
          this.dialogRef.close('saved');
        },
        error: (err: any) => {
          console.error('Error al crear conferencia:', err);
          this.errorMessage = 'Error al guardar la conferencia.';
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}