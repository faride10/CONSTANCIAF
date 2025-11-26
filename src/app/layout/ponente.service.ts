import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PonenteService {
  
private apiUrl = (process.env['HTTP_SERVER_ADDRESS']
    ? `https://${process.env['HTTP_SERVER_ADDRESS']}/api`
    : '/api');
  
  
  constructor(private http: HttpClient) { }

  getPonentes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createPonente(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updatePonente(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deletePonente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}