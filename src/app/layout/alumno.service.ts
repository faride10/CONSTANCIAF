import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root' 
})

export class AlumnoService {

    private apiUrl = 'HTTP_SERVER_ADDRESS/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAlumnos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/alumnos`, { headers: this.getAuthHeaders() });
  }

  createAlumno(alumno: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/alumnos`, alumno, { headers: this.getAuthHeaders() });
  }

  updateAlumno(numControl: string, alumno: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/alumnos/${numControl}`, alumno, { headers: this.getAuthHeaders() });
  }

  deleteAlumno(numControl: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/alumnos/${numControl}`, { headers: this.getAuthHeaders() });
  }
  
  importarAlumnos(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo, archivo.name);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.post(`${this.apiUrl}/alumnos/importar`, formData, { headers: headers });
  }
}