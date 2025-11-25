import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
  })

export class DashboardService {

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

  getAdminSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/admin/summary`, { headers: this.getAuthHeaders() });
  }

  getRecentActivities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/recent-activities`, { headers: this.getAuthHeaders() });
  }

  getReportePorConferencia(idConferencia: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/reporte/conferencia/${idConferencia}`, { 
      headers: this.getAuthHeaders() 
    });
  }
  getReportePorAlumnos(idConferencia: number, idGrupo: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/reporte/conferencia/${idConferencia}/grupo/${idGrupo}`, { 
      headers: this.getAuthHeaders() 
    });
  }
}