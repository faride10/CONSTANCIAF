import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, AbstractControl } from '@angular/forms';
import { AuthService } from '../../layout/auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const password_confirmation = control.get('password_confirmation');

  if (password && password_confirmation && password.value !== password_confirmation.value) {
    return { passwordsMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    }, { validators: passwordsMatchValidator }); 
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.errorMessage = 'Asegúrate de que las contraseñas coincidan y tengan al menos 8 caracteres.';
      return;
    }
    this.errorMessage = null;
    this.successMessage = null; 

    const newPasswordData = {
      password: this.changePasswordForm.value.password,
      password_confirmation: this.changePasswordForm.value.password_confirmation
    };

    // LLAMADA AL SERVICIO Y MANEJO DE LA RESPUESTA
    this.authService.changePassword(newPasswordData).subscribe({
      next: (response: any) => { // ⬅️ Tipado añadido
        // ÉXITO: El servidor respondió 200 OK
        console.log('Cambio de contraseña exitoso:', response);
        this.successMessage = response.message || 'Contraseña actualizada correctamente.';
        
        // Cierra la sesión y redirige al login.
        this.authService.logout(); 
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000); 
      },
      error: (err: any) => { // ⬅️ Tipado añadido
        // FALLA: Captura el error (401 o 422) que devuelve Laravel
        console.error('Error al cambiar la contraseña:', err);

        // Si es 422 (validación), muestra los errores específicos
        if (err.status === 422 && err.error && err.error.errors) {
          this.errorMessage = 'Error de validación: ' + Object.values(err.error.errors).flat().join(' ');
        } else {
          // Si es 401 u otro error, muestra un mensaje genérico.
          this.errorMessage = 'Error de conexión o autenticación. Por favor, vuelve a iniciar sesión.';
          // Se recomienda forzar el logout aquí si es 401
          this.authService.logout(); 
        }
      }
    });
  }
}