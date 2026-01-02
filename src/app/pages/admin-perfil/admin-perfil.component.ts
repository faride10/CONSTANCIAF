import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PerfilService } from '../../services/perfil.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-perfil',
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
  templateUrl: './admin-perfil.component.html',
  styleUrls: ['./admin-perfil.component.css']
})
export class AdminPerfilComponent implements OnInit {

  usuario: any = { username: '' };
  
  pass = {
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  };

  loadingInfo: boolean = false;
  loadingPass: boolean = false;

  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;

  constructor(private perfilService: PerfilService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.perfilService.getPerfil().subscribe({
      next: (res) => {
        this.usuario = res;
      },
      error: (err) => console.error('Error al cargar perfil:', err)
    });
  }

  guardarDatos() {
    this.loadingInfo = true;
    this.perfilService.updatePerfil(this.usuario).subscribe({
      next: (res) => {
        Swal.fire('¡Actualizado!', 'Tu información ha sido guardada.', 'success');
        this.loadingInfo = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo actualizar la información. Quizás el usuario ya existe.', 'error');
        this.loadingInfo = false;
      }
    });
  }

  cambiarPassword() {
    if (this.pass.new_password !== this.pass.new_password_confirmation) {
       Swal.fire('Error', 'Las contraseñas nuevas no coinciden.', 'warning');
       return; 
    }

    this.loadingPass = true;
    
    this.perfilService.changePassword(this.pass).subscribe({
      next: (res) => {
        Swal.fire('¡Éxito!', 'Contraseña actualizada correctamente.', 'success');
        this.pass = { current_password: '', new_password: '', new_password_confirmation: '' };
        this.loadingPass = false;
      },
      error: (err) => {
        console.error(err);
        const msg = err.error?.message || 'La contraseña actual es incorrecta o hubo un error.';
        Swal.fire('Error', msg, 'error');
        this.loadingPass = false;
      }
    });
  }
}