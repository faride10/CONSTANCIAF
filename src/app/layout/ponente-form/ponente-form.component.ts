import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { PonenteService } from '../ponente.service'; 

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ponente-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './ponente-form.component.html',
  styleUrl: './ponente-form.component.css'
})
export class PonenteFormComponent implements OnInit {
  ponenteForm: FormGroup;
  errorMessage: string | null = null;
  isEditMode = false;
  ponente: any = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PonenteFormComponent>,
    private ponenteService: PonenteService,    
    @Inject(MAT_DIALOG_DATA) public data: { ponenteData: any }
  ) {
    if (data && data.ponenteData) {
      this.isEditMode = true;
      this.ponente = data.ponenteData;
    }

    this.ponenteForm = this.fb.group({
      NOMBRE: [this.ponente?.NOMBRE || '', Validators.required],
      TITULO: [this.ponente?.TITULO || ''],
      CARGO: [this.ponente?.CARGO || ''],
      EMPRESA: [this.ponente?.EMPRESA || ''],
      CORREO: [this.ponente?.CORREO || '', Validators.email]
    });
  }

  ngOnInit(): void {
  }

  onSave(): void {
    this.ponenteForm.markAllAsTouched();
    if (this.ponenteForm.invalid) {
      this.errorMessage = 'Por favor, completa los campos requeridos.';
      return;
    }
    this.errorMessage = null;

    if (this.isEditMode) {
      // 3. CAMBIO: Usamos ponenteService
      this.ponenteService.updatePonente(this.ponente.ID_PONENTE, this.ponenteForm.value).subscribe({
        next: (response: any) => { 
          console.log('Ponente actualizado:', response);
          this.dialogRef.close('saved');
        },
        error: (err: any) => { 
          console.error('Error al actualizar ponente:', err);
          this.errorMessage = 'Error al actualizar el ponente.';
        }
      });
    } else {

      this.ponenteService.createPonente(this.ponenteForm.value).subscribe({
        next: (response: any) => {
          console.log('Ponente creado:', response);
          this.dialogRef.close('saved');
        },
        error: (err: any) => {
          console.error('Error al crear ponente:', err);
          this.errorMessage = 'Error al guardar el ponente.';
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}