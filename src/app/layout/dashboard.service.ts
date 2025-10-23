import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service'; 

@Injectable({
  providedIn: 'root' 
})
export class DashboardService {

  private apiUrl = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAdminSummary(): Observable<any> {
    const token = this.authService.getToken(); 

    if (!token) {
   
      console.error('No se encontró token de autenticación.');
      return new Observable(observer => observer.error('No autenticado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/dashboard/admin/summary`, { headers: headers });
  }

}