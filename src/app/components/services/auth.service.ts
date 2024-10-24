import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../environments/config';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl = `${environment.baseUrl}`;

  // Recuperar el rol al cargar la aplicación
  constructor(private http: HttpClient) {
    // Recupera el usuario del localStorage al iniciar la aplicación
    const storedUser = localStorage.getItem('currentUser');

    // Inicializa currentUserSubject con los datos del localStorage o null si no existe
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);

    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(credentials: { email: string; password: string; recaptchaToken: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials, { withCredentials: true }).pipe(
      tap((response: any) => {
        console.log('respuesta ', response); // Agrega esta línea para verificar la respuesta
        this.currentUserSubject.next(response);
        localStorage.setItem('currentUser', JSON.stringify(response));
      })
    );
  }
  // Método para registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/`, userData);
  }
  //RECUPERACION DE CONTRASE
  //iniciar el proceso de recuperación de contraseña
  recu(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/initiate-password-recovery`, credentials);
  }
  //verificar el código OTP
  verOTP(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify-otp`, credentials);
  }
  //reestablecer la contraseña
  resContra(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, credentials);
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
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      })
    );
  }

  // Método para obtener el perfil del usuario
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`, { withCredentials: true });
  }
  // Método para actualizar el perfil del usuario
  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/profile`, data, { withCredentials: true });
  }

  // Método para eliminar la cuenta del usuario
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/delete-account`, { withCredentials: true })
      .pipe(
        tap(() => {
          // Limpia todo el localStorage al eliminar la cuenta
          localStorage.clear();
        })
      );
  }

  // Método para obtener el token JWT almacenado (puedes ajustar esto según tu implementación)
  private getToken(): string | null {
    return localStorage.getItem('token'); // Suponiendo que el token se almacena en localStorage
  }
}