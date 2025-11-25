import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'HTTP_SERVER_ADDRESS/api';


  constructor(private http: HttpClient) { }

  requestAttendance(data: { control_number: string, conference_id: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/request`, data);
  }

  confirmAttendance(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/confirm/${token}`);
  }
}