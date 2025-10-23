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
import { MatNativeDateModule } from '@angular/material/core';


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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConferenceFormComponent>,
    private conferenceService: ConferenceService
  ) {
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

  ngOnInit(): void {
    this.loadPonentes();
  }

  loadPonentes(): void {
    this.isLoadingPonentes = true;
    this.conferenceService.getPonentes().subscribe({
      next: (data) => {
        this.ponentes = data;
        this.isLoadingPonentes = false;
      },
      error: (err) => {
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
    this.conferenceService.createConference(this.conferenceForm.value).subscribe({
      next: (response) => {
        console.log('Conferencia creada:', response);
        this.dialogRef.close('saved');
      },
      error: (err) => {
        console.error('Error al crear conferencia:', err);
        this.errorMessage = 'Error al guardar la conferencia. Inténtalo de nuevo.';
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}