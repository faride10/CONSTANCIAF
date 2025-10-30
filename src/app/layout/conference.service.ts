import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders | null {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No se encontró token de autenticación.');
      return null;
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getConferences(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable(observer => observer.error('No autenticado'));
    return this.http.get(`${this.apiUrl}/conferencias`, { headers });
  }

  getPonentes(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable(observer => observer.error('No autenticado'));
    return this.http.get(`${this.apiUrl}/ponentes`, { headers });
  }

  createConference(conferenceData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable(observer => observer.error('No autenticado'));
    return this.http.post(`${this.apiUrl}/conferencias`, conferenceData, { headers });
  }
  updateConference(id: number, conferenceData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable(observer => observer.error('No autenticado'));
    return this.http.put(`${this.apiUrl}/conferencias/${id}`, conferenceData, { headers });
  }

  deleteConference(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable(observer => observer.error('No autenticado'));
    return this.http.delete(`${this.apiUrl}/conferencias/${id}`, { headers });
  }
  
  getGrupos(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable(observer => observer.error('No autenticado'));
    return this.http.get(`${this.apiUrl}/grupos`, { headers });
  }

  getQrData(conferenceId: number, grupoId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable(observer => observer.error('No autenticado'));
    return this.http.get(`${this.apiUrl}/conferencias/${conferenceId}/grupos/${grupoId}/qr-data`, { headers });
  }
  createPonente(ponenteData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable(observer => observer.error('No autenticado'));
    return this.http.post(`${this.apiUrl}/ponentes`, ponenteData, { headers });
  }
  
deletePonente(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable(observer => observer.error('No autenticado'));
    return this.http.delete(`${this.apiUrl}/ponentes/${id}`, { headers });
  }
}