import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {
  
private apiUrl = (process.env['HTTP_SERVER_ADDRESS']
    ? `https://${process.env['HTTP_SERVER_ADDRESS']}/api`
    : '/api');

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

    if (formData.FECHA && formData.HORA) {
      const fecha = new Date(formData.FECHA);
      const [horas, minutos] = formData.HORA.split(':');
      fecha.setHours(Number(horas));
      fecha.setMinutes(Number(minutos));
      
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      const hours = String(fecha.getHours()).padStart(2, '0');
      const mins = String(fecha.getMinutes()).padStart(2, '0');
      const secs = '00';

      dataToSend.FECHA_HORA = `${year}-${month}-${day} ${hours}:${mins}:${secs}`;
    }
    
    delete dataToSend.FECHA;
    delete dataToSend.HORA;

    return dataToSend;
  }
}