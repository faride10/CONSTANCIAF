import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router'; 
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider'; 

@Component({
  selector: 'app-docente-layout',
  standalone: true,
  imports: [ 
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './docente-layout.component.html',
  styleUrls: ['./docente-layout.component.css']
})
export class DocenteLayoutComponent {

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/auth/login']); 
    console.log('Cerrando sesión...');
  }
}