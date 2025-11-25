import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  
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

  getDocentes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/docentes`, { headers: this.getAuthHeaders() });
  }

  getDocenteByGroupId(grupoId: number): Observable<any> {
    const url = `${this.apiUrl}/grupo/${grupoId}/docente`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
}
}