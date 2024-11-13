import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../environments/config';
import { tap, switchMap } from 'rxjs/operators';
import { CsrfService } from './csrf.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl = `${environment.baseUrl}`;

  constructor(private csrfService: CsrfService,private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(storedUser));
    } else {
      this.currentUserSubject = new BehaviorSubject<any>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();
  }
  
  login(credentials: { email: string; password: string; recaptchaToken: string }): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.post(`${this.apiUrl}/auth/login`, credentials, { headers, withCredentials: true }).pipe(
          tap((response: any) => {
            console.log('respuesta ', response); 
            this.currentUserSubject.next(response);
            localStorage.setItem('currentUser', JSON.stringify(response));
          })
        );
      })
    );
  }
  
  // Método para registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.post(`${this.apiUrl}/auth/register/`, userData, { headers, withCredentials: true });
      })
    );
  }
  
  //RECUPERACION DE CONTRASE
  //iniciar el proceso de recuperación de contraseña
  recu(credentials: any): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.post(`${this.apiUrl}/auth/initiate-password-recovery`, credentials, { headers, withCredentials: true });
      })
    );
  }
  
  //verificar el código OTP
  verOTP(credentials: any): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.post(`${this.apiUrl}/auth/verify-otp`, credentials, { headers, withCredentials: true });
      })
    );
  }
  
  //reestablecer la contraseña
  resContra(credentials: any): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.post(`${this.apiUrl}/auth/reset-password`, credentials, { headers, withCredentials: true });
      })
    );
  }
  
  // Método para obtener el tipo de usuario actual como un Observable
  getTipoUsuario(): Observable<string | null> {
    const currentUser = this.currentUserSubject.getValue();
    return of(currentUser ? currentUser.tipo : null); // Convertir el tipo a un Observable
  }
  // Método para obtener el ID del usuario actual
  getId(): string | null {
    const currentUser = this.currentUserSubject.getValue();
    return currentUser ? currentUser.userId : null;
  }
  //Metodo para cerrar sesion
  logout(): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers, withCredentials: true }).pipe(
          tap(() => {
            localStorage.removeItem('currentUser');
            this.currentUserSubject.next(null);
          })
        );
      })
    );
  }
  // Método para obtener el token JWT almacenado (puedes ajustar esto según tu implementación)
  private getToken(): string | null {
    return localStorage.getItem('token'); // Suponiendo que el token se almacena en localStorage
  }
 
}