import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { AlumnoService } from '../alumno.service';  
import { GrupoService } from '../grupo.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alumno-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule
  ],
  templateUrl: './alumno-form.component.html',
  styleUrls: ['./alumno-form.component.css']
})
export class AlumnoFormComponent implements OnInit {

  alumnoForm: FormGroup;
  titulo: string = "Nuevo Alumno";
  grupos: any[] = []; 
  isEditMode: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AlumnoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private fb: FormBuilder,
    private alumnoService: AlumnoService,
    private grupoService: GrupoService 
  ) {
    this.alumnoForm = this.fb.group({
      num_control: ['', [Validators.required, Validators.maxLength(30)]],
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      correo_institucional: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      id_grupo: [null]
    });

    if (this.data) {
      this.isEditMode = true;
      this.titulo = "Editar Alumno";
      this.alumnoForm.patchValue(this.data);
      this.alumnoForm.get('num_control')?.disable();
    }
  }

  ngOnInit(): void {
    this.cargarGrupos(); 
  }

  cargarGrupos(): void {
    this.grupoService.getGrupos().subscribe((data: any) => {
      this.grupos = data;
    });
  }

  guardarAlumno(): void {
    if (this.alumnoForm.invalid) { return; }

    const alumnoData = this.alumnoForm.getRawValue();

    if (this.isEditMode) {
      this.alumnoService.updateAlumno(alumnoData.NUM_CONTROL, alumnoData).subscribe(() => {
        this.dialogRef.close(true); 
      });
    } else {
      this.alumnoService.createAlumno(alumnoData).subscribe(() => {
        this.dialogRef.close(true); 
      });
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}