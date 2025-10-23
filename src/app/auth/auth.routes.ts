import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

import { RegisterComponent } from './register/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login', 
    component: LoginComponent
  },
  {
    path: 'change-password', 
    component: ChangePasswordComponent
  },
   {
    path: 'register',
    component: RegisterComponent
  },
  {
   
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];