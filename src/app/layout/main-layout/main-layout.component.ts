import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from '../../auth/auth.service'; 

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider'; 


@Component({
  selector: 'app-main-layout',
  standalone: true, 
  imports: [ 
    CommonModule,
    RouterModule, 
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule 
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css' 
})
export class MainLayoutComponent {

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/auth/login']); 
    console.log('Cerrando sesión...');
  }

}