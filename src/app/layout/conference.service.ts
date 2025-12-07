import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConferenceService {
  
  private apiUrl = environment.apiUrl;   


  constructor(private http: HttpClient) { }

  getConferences(): Observable<any> {
    return this.http.get(`${this.apiUrl}/conferencias`);
  }

  createConference(data: any): Observable<any> {
    const formattedData = this.formatData(data);
    return this.http.post(`${this.apiUrl}/conferencias`, formattedData);
  }

  updateConference(id: number, data: any): Observable<any> {
    const formattedData = this.formatData(data);
    return this.http.put(`${this.apiUrl}/conferencias/${id}`, formattedData); 
  }

  deleteConference(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/conferencias/${id}`);
  }

  getPonentes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ponentes`); 
  }

  getQrCodeData(conferenceId: number, grupoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/conferencias/${conferenceId}/grupos/${grupoId}/qr-data`);
  }
  
  private formatData(formData: any): any {
    const dataToSend = { ...formData };

    if (formData.fecha && formData.hora) {
      const fecha = new Date(formData.fecha);
      const [horas, minutos] = formData.hora.split(':');
      fecha.setHours(Number(horas));
      fecha.setMinutes(Number(minutos));
      
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      const hours = String(fecha.getHours()).padStart(2, '0');
      const mins = String(fecha.getMinutes()).padStart(2, '0');
      const secs = '00';

      dataToSend.fecha_hora = `${year}-${month}-${day} ${hours}:${mins}:${secs}`;
    }
    
    delete dataToSend.fecha;
    delete dataToSend.hora;

    return dataToSend;
  }
}