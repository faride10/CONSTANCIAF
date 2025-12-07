import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../layout/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule, 
    MatInputModule        
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);

        if (this.authService.needsPasswordChange()) {
          console.log('El usuario necesita cambiar su contraseña');
          this.router.navigate(['/auth/change-password']); 
        
        } else {
          const role = this.authService.getRole();
          console.log('Rol del usuario:', role);

          switch (role) {
            case 'Administrador':
              console.log('Enviando al panel de Administrador');
              this.router.navigate(['/panel/admin']);   
              break;
            case 'Docente':
              console.log('Enviando al panel de Docente');
              this.router.navigate(['/panel/docente']);   
              break;
            default:
              console.error('Rol no reconocido:', role);
              this.errorMessage = 'Rol de usuario no reconocido.';
              this.authService.logout();  
          }
        }
        
      },
      error: (err) => {
        console.error('Error en el login', err);
        this.errorMessage = 'Usuario o contraseña incorrectos.';
      }
    });
  }
}