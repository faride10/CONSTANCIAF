import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs'; 
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private tokenKey = 'access_token'; 
    private userKey = 'usuario';       

  private apiUrl = 'HTTP_SERVER_ADDRESS/api';

  private _isAuthenticated = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isAuthenticated = this._isAuthenticated.asObservable();

  constructor(private http: HttpClient, private router: Router) { } 

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.access_token && response.usuario) {
          localStorage.setItem(this.tokenKey, response.access_token);
          localStorage.setItem(this.userKey, JSON.stringify(response.usuario)); 
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
    return this.http.post(`${this.apiUrl}/change-password`, newPasswordData);
  }

  getMiGrupo(): Observable<any> {
    const token = this.getToken(); 
    if (!token) {
      return new Observable(observer => observer.error({status: 401, message: 'No autenticado'}));
    }
    return this.http.get(`${this.apiUrl}/docente/mi-grupo`);
  }

  getMisConferencias(): Observable<any> {
    const token = this.getToken(); 
    if (!token) {
      return new Observable(observer => observer.error({status: 401, message: 'No autenticado'}));
    }
    return this.http.get(`${this.apiUrl}/docente/mis-conferencias`);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this._isAuthenticated.next(false);
    
    window.location.href = '/auth/login'; 
}

  isLoggedIn(): boolean {
  const token = this.getToken();
  
  console.log('--- ESTADO DE SEGURIDAD ---');
  console.log('Token encontrado:', !!token);
  console.log('--- --------------- ---');  
  return !!token;
}
  
  public getUsuario(): any | null {
    const usuario = localStorage.getItem(this.userKey);
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