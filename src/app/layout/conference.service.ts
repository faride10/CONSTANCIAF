import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {
  
  // 1. URL BASE: Apunta a la raíz de la API
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  // 2. OBTENER CONFERENCIAS (Asegúrate que diga /conferencias)
  getConferences(): Observable<any> {
    return this.http.get(`${this.baseUrl}/conferencias`);
  }

  createConference(data: any): Observable<any> {
    const formattedData = this.formatData(data);
    return this.http.post(`${this.baseUrl}/conferencias`, formattedData);
  }

  updateConference(id: number, data: any): Observable<any> {
    const formattedData = this.formatData(data);
    return this.http.put(`${this.baseUrl}/conferencias/${id}`, formattedData); 
  }

  deleteConference(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/conferencias/${id}`);
  }

  // --- Métodos Auxiliares ---

  // Obtener ponentes para el formulario (Esto SÍ debe llamar a /ponentes)
  getPonentes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ponentes`); 
  }

  getQrCodeData(conferenceId: number, grupoId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/conferencias/${conferenceId}/grupos/${grupoId}/qr-data`);
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