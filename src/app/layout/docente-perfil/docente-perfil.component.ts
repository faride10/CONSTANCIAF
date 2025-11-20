import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DocenteService } from '../docente.service';

@Component({
  selector: 'app-docente-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,   
    MatInputModule,       
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressBarModule 
  ],
  templateUrl: './docente-perfil.component.html',
  styleUrls: ['./docente-perfil.component.css']
})
export class DocentePerfilComponent implements OnInit {

  infoForm: FormGroup;
  passwordForm: FormGroup;
  isLoading = false;
  docenteData: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private docenteService: DocenteService
  ) {
    this.infoForm = this.fb.group({
      NOMBRE: [{value: '', disabled: true}],  
      RFC: [{value: '', disabled: true}],     
      CORREO: ['', [Validators.required, Validators.email]],
      TELEFONO: ['', [Validators.pattern('^[0-9]{10}$')]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;
    
    this.docenteService.getPerfil().subscribe({
      next: (data: any) => {
        this.docenteData = data;
        this.infoForm.patchValue({
          NOMBRE: data.NOMBRE,
          RFC: data.RFC,
          CORREO: data.CORREO,
          TELEFONO: data.TELEFONO
        });
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar perfil', err);
        this.mostrarNotificacion('Error al cargar la información del perfil.', 'error');
        this.isLoading = false;
      }
    });
  }

  guardarInfo(): void {
    if (this.infoForm.invalid) return;
    
    this.isLoading = true;
    const dataToSend = this.infoForm.value; 

    this.docenteService.updatePerfil(dataToSend).subscribe({
      next: (res: any) => {
        this.mostrarNotificacion('Información actualizada correctamente.', 'success');
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        const msg = err.error?.message || 'No se pudo actualizar la información.';
        this.mostrarNotificacion(msg, 'error');
        this.isLoading = false;
      }
    });
  }

  cambiarPassword(): void {
    if (this.passwordForm.invalid) return;
    
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
    
    if (newPassword !== confirmPassword) {
      this.mostrarNotificacion('Las contraseñas nuevas no coinciden.', 'error');
      return;
    }

    this.isLoading = true;

    const payload = {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword
    };

    this.docenteService.updatePassword(payload).subscribe({
      next: (res: any) => {
        this.mostrarNotificacion('Contraseña actualizada correctamente.', 'success');
        this.passwordForm.reset(); 
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        const msg = err.error?.message || 'Error al cambiar la contraseña.';
        this.mostrarNotificacion(msg, 'error');
        this.isLoading = false;
      }
    });
  }

  // 3. CAMBIO: Usamos SweetAlert en lugar de snackBar
  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' = 'success') {
    
    if (tipo === 'success') {
      Swal.fire({
        title: '¡Excelente!',
        text: mensaje,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1b396a',
        timer: 3000
      });
    } else {
      Swal.fire({
        title: 'Ocurrió un problema',
        text: mensaje,
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#d33'
      });
    }

  }
}