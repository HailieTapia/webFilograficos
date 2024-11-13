import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../environments/config';
import { tap, switchMap } from 'rxjs/operators';
import { CsrfService } from './csrf.service';  // Asegúrate de importar el servicio CSRF

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl = `${environment.baseUrl}`;

  constructor(private http: HttpClient, private csrfService: CsrfService) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = storedUser ? new BehaviorSubject<any>(JSON.parse(storedUser)) : new BehaviorSubject<any>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }
  // Login con CSRF LSITO 
  login(credentials: { email: string; password: string; recaptchaToken: string }): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.post(`${this.apiUrl}/auth/login`, credentials, { headers, withCredentials: true }).pipe(
          tap((response: any) => {
            console.log('respuesta ', response); // Agrega esta línea para verificar la respuesta
            this.currentUserSubject.next(response);
            localStorage.setItem('currentUser', JSON.stringify(response));
          })
        );
      })
    );
  }
  
  
  // Método para registrar un nuevo usuario LISTO
  register(userData: any): Observable<any> {
    return this.csrfService.getCsrfToken().pipe( // Obtener el token CSRF
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken); // Agregar el token CSRF al encabezado
        return this.http.post(`${this.apiUrl}/auth/register/`, userData, { headers,  withCredentials: true });
      })
    );
  }

  //RECUPERACION DE CONTRASE
  // Iniciar el proceso de recuperación de contraseña con CSRF
  recu(credentials: any): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.post(`${this.apiUrl}/auth/initiate-password-recovery`, credentials, {
          headers,
          withCredentials: true
        });
      })
    );
  }
  
  // Verificar el código OTP con CSRF
  verOTP(credentials: any): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.post(`${this.apiUrl}/auth/verify-otp`, credentials, {
          headers,
          withCredentials: true
        });
      })
    );
  }
  
  // Reestablecer la contraseña con CSRF
  resContra(credentials: any): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.post(`${this.apiUrl}/auth/reset-password`, credentials, {
          headers,
          withCredentials: true
        });
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

  // Metodo para cerrar sesión LISTO
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
  
  
  // Método para obtener el perfil del usuario
  getProfile(): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.get(`${this.apiUrl}/users/profile`, { headers, withCredentials: true });
      })
    );
  }
  // Método para eliminar la cuenta del usuario
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/delete-account`, { withCredentials: true })
      .pipe(
        tap(() => {
          localStorage.clear();
        })
      );
  }

  // Actualización del perfil del usuario (nombre, dirección, teléfono)
  updateProfile(data: any): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.put(`${this.apiUrl}/users/profile`, data, { headers, withCredentials: true });
      })
    );
  }

  // Actualizar solo la dirección del usuario
  updateUserProfile(direccion: any): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.put(`${this.apiUrl}/users/profile/change-address`, { direccion }, { headers, withCredentials: true });
      })
    );
  }

  // Método para eliminar la cuenta del usuario
  deleteMyAccount(): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.delete(`${this.apiUrl}/users/delete-account`, { headers, withCredentials: true });
      })
    );
  }

  // Desactivar la cuenta de usuario
  deactivateAccount(userId: string, accion: 'bloquear' | 'suspender' | 'activar'): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/deactivate-account`, { userId, accion }, { withCredentials: true });
  }

  // Obtener todos los usuarios con sus sesiones activas
  getAllUsersWithSessions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users/sessions`, { withCredentials: true });
  }

  // Método para obtener el token JWT almacenado
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Cambio de contraseña con CSRF
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      tap(csrfToken => {
        return this.csrfService.postWithCsrf(`${this.apiUrl}/auth/change-password`, { currentPassword, newPassword }, csrfToken);
      })
    );
  }
}
