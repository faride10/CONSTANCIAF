import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';  

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api';
  private _isAuthenticated = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isAuthenticated = this._isAuthenticated.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.access_token && response.usuario) {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('usuario', JSON.stringify(response.usuario)); 
          this._isAuthenticated.next(true);   
        }
      })
    );
  }

  changePassword(newPasswordData: any): Observable<any> {
    const token = this.getToken(); 
    if (!token) {
      throw new Error('No hay token de autenticación disponible.');
    }
    // Petición simple. El TokenInterceptor adjunta el header Bearer.
    return this.http.post(`${this.apiUrl}/change-password`, newPasswordData);
  }

  // CORREGIDO: Eliminamos la creación manual de Headers.
  getMiGrupo(): Observable<any> {
    const token = this.getToken(); 
    if (!token) {
      return new Observable(observer => observer.error({status: 401, message: 'No autenticado'}));
    }
    // Petición simple.
    return this.http.get(`${this.apiUrl}/docente/mi-grupo`);
  }

  // CORREGIDO: Eliminamos la creación manual de Headers.
  getMisConferencias(): Observable<any> {
    const token = this.getToken(); 
    if (!token) {
      return new Observable(observer => observer.error({status: 401, message: 'No autenticado'}));
    }
    // Petición simple.
    return this.http.get(`${this.apiUrl}/docente/mis-conferencias`);
  }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('usuario');   
    this._isAuthenticated.next(false);  
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
  
  public getUsuario(): any | null {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  public getRole(): string | null {
    const usuario = this.getUsuario();
    return usuario && usuario.rol ? usuario.rol.NOMBRE_ROL : null; 
  }

  public needsPasswordChange(): boolean {
    const usuario = this.getUsuario();
    return usuario ? usuario.needs_password_change : false;
  }
}