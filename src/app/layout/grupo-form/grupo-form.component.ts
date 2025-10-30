import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GrupoService } from '../grupo.service';

// Imports para Standalone
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grupo-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule
  ],
  templateUrl: './grupo-form.component.html',
  styleUrls: ['./grupo-form.component.css']
})
export class GrupoFormComponent implements OnInit {

  grupoForm: FormGroup;
  titulo: string = "Nuevo Grupo";
  docentes: any[] = []; 

  constructor(
    private dialogRef: MatDialogRef<GrupoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private fb: FormBuilder,
    private grupoService: GrupoService
  ) {
    // --- CAMBIO CLAVE: Usamos MAYÚSCULAS para coincidir con el backend ---
    this.grupoForm = this.fb.group({
      ID_GRUPO: [null], // El ID de la BD
      NOMBRE: ['', Validators.required],
      CARRERA: ['', Validators.required], // El campo que faltaba
      ID_DOCENTE: [null] // Puede ser nulo
    });

    if (this.data) {
      this.titulo = "Editar Grupo";
      this.grupoForm.patchValue(this.data); // Rellena el form con {NOMBRE: ..., etc}
    }
  }

  ngOnInit(): void {
    this.cargarDocentes(); 
  }

  cargarDocentes(): void {
    // Asumimos que getDocentes() también devuelve objetos con MAYÚSCULAS
    this.grupoService.getDocentes().subscribe((docentes: any) => {
      this.docentes = docentes;
    });
  }

  guardarGrupo(): void {
    if (this.grupoForm.invalid) { return; }
    
    const grupoData = this.grupoForm.value;

    if (grupoData.ID_GRUPO) {
      this.grupoService.updateGrupo(grupoData.ID_GRUPO, grupoData).subscribe((response: any) => {
        this.dialogRef.close(true); 
      });
    } else {
      this.grupoService.createGrupo(grupoData).subscribe((response: any) => {
        this.dialogRef.close(true); 
      });
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}