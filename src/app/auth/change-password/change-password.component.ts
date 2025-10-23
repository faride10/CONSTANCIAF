import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, AbstractControl } from '@angular/forms';
import { AuthService } from '../auth.service'; 

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
      return;
    }
    this.errorMessage = null;
    this.successMessage = null;

    const newPasswordData = {
      password: this.changePasswordForm.value.password,
      password_confirmation: this.changePasswordForm.value.password_confirmation
    };

    console.log('Enviando nueva contraseña:', newPasswordData);
    this.successMessage = 'Contraseña actualizada. Redirigiendo al login...';
    setTimeout(() => {
      this.authService.logout(); 
      this.router.navigate(['/auth/login']);
    }, 3000); 
  }
}