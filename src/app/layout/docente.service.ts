import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class DocenteService {

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

  getDocentes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/docentes`, { headers: this.getAuthHeaders() });
  }

  createDocente(docente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/docentes`, docente, { headers: this.getAuthHeaders() });
  }

  updateDocente(id: number, docente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/docentes/${id}`, docente, { headers: this.getAuthHeaders() });
  }

  deleteDocente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/docentes/${id}`, { headers: this.getAuthHeaders() });
  }

  importarDocentes(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo, archivo.name);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/docentes/importar`, formData, { headers: headers });
  }

  getMiGrupo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/docente/mi-grupo`, { headers: this.getAuthHeaders() });
  }

  getQrCode(idConferencia: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/conferencia/${idConferencia}/qr`, { headers: this.getAuthHeaders() });
  }
  
  getAsistencias(idConferencia: number, idGrupo: number): Observable<any[]> {
    const url = `${this.apiUrl}/asistencias?conferencia_id=${idConferencia}&grupo_id=${idGrupo}`;
    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() });
  }

  deleteAsistencia(idAsistencia: number): Observable<any> {
    const url = `${this.apiUrl}/asistencias/${idAsistencia}`;
    return this.http.delete(url, { headers: this.getAuthHeaders() });
  }

  createAsistenciaManual(asistenciaData: { 
    ID_CONFERENCIA: number, 
    ID_GRUPO: number, 
    NUM_CONTROL: string 
  }): Observable<any> {
    
    const url = `${this.apiUrl}/asistencias`;
    return this.http.post(url, asistenciaData, { headers: this.getAuthHeaders() });
  }

  getPerfil(): Observable<any> {
    return this.http.get(`${this.apiUrl}/docente/perfil-data`, { headers: this.getAuthHeaders() });
  }

  updatePerfil(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/docente/perfil-update`, data, { headers: this.getAuthHeaders() });
  }

  updatePassword(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/docente/password-update`, data, { headers: this.getAuthHeaders() });
  }

  getDashboardSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/docente/dashboard-summary`, { headers: this.getAuthHeaders() });
  }
}