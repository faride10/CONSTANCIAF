import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GrupoService } from '../grupo.service';
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
    this.grupoForm = this.fb.group({
      id_grupo: [null], 
      nombre: ['', Validators.required],
      carrera: ['', Validators.required], 
      id_docente: [null] 
    });

    if (this.data) {
      this.titulo = "Editar Grupo";
      this.grupoForm.patchValue(this.data); 
    }
  }

  ngOnInit(): void {
    this.cargarDocentes(); 
  }

  cargarDocentes(): void {
    this.grupoService.getDocentes().subscribe((docentes: any) => {
      this.docentes = docentes;
    });
  }

  guardarGrupo(): void {
    if (this.grupoForm.invalid) { return; }
    
    const grupoData = this.grupoForm.value;

    if (grupoData.id_grupo) {
      this.grupoService.updateGrupo(grupoData.id_grupo, grupoData).subscribe((response: any) => {
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