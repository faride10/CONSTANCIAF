import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DocenteService } from '../docente.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-docente-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule
  ],
  templateUrl: './docente-form.component.html',
  styleUrls: ['./docente-form.component.css']
})
export class DocenteFormComponent implements OnInit {

  docenteForm: FormGroup;
  titulo: string = "Nuevo Docente";
  isEditMode: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<DocenteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private fb: FormBuilder,
    private docenteService: DocenteService
  ) {

    this.docenteForm = this.fb.group({
      ID_DOCENTE: [null],
      NOMBRE: ['', [Validators.required, Validators.maxLength(200)]],
      RFC: ['', [Validators.required, Validators.maxLength(13)]],
      CORREO: [null, [Validators.email, Validators.maxLength(200)]],
      TELEFONO: [null, [Validators.maxLength(30)]]
    });

    if (this.data) {
      this.isEditMode = true;
      this.titulo = "Editar Docente";
      this.docenteForm.patchValue(this.data);
    }
  }

  ngOnInit(): void {
  }

  guardarDocente(): void {
    if (this.docenteForm.invalid) { return; }

    const docenteData = this.docenteForm.value;

    if (this.isEditMode) {
      this.docenteService.updateDocente(docenteData.ID_DOCENTE, docenteData).subscribe(() => {
        this.dialogRef.close(true); 
      });
    } else {
      this.docenteService.createDocente(docenteData).subscribe(() => {
        this.dialogRef.close(true); 
      });
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}