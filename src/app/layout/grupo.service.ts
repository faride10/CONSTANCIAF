import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service'; // Ajusta la ruta a tu AuthService

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  
  private apiUrl = 'http://127.0.0.1:8000/api'; 

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

  // --- Funciones para Grupos ---

  getGrupos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/grupos`, { headers: this.getAuthHeaders() });
  }

  createGrupo(grupo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/grupos`, grupo, { headers: this.getAuthHeaders() });
  }

  updateGrupo(id: number, grupo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/grupos/${id}`, grupo, { headers: this.getAuthHeaders() });
  }

  deleteGrupo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/grupos/${id}`, { headers: this.getAuthHeaders() });
  }

  // --- Función para Docentes (para el formulario) ---
  
  getDocentes(): Observable<any> {
    // Asumimos que tienes una ruta 'api/docentes' en Laravel
    return this.http.get(`${this.apiUrl}/docentes`, { headers: this.getAuthHeaders() });
  }
}