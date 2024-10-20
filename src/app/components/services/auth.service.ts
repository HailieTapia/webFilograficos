
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /* private user: { isAuthenticated: boolean; roles: string[] } | null = null;
 
   constructor() {
     // Puedes inicializar el usuario desde localStorage o cualquier otra fuente
     const storedUser = localStorage.getItem('currentUser');
     if (storedUser) {
       this.user = JSON.parse(storedUser);
     }
   }
 
   // Método para iniciar sesión
   login(username: string, password: string): boolean {
     // Lógica para verificar credenciales (puedes hacer una llamada a una API)
     // Aquí solo se muestra un ejemplo básico
     if (username === 'admin' && password === 'admin') {
       this.user = { isAuthenticated: true, roles: ['admin'] };
       localStorage.setItem('currentUser', JSON.stringify(this.user));
       return true;
     } else if (username === 'user' && password === 'user') {
       this.user = { isAuthenticated: true, roles: ['user'] };
       localStorage.setItem('currentUser', JSON.stringify(this.user));
       return true;
     }
     return false;
   }
 
   // Método para cerrar sesión
   logout(): void {
     this.user = null;
     localStorage.removeItem('currentUser');
   }
 
   // Método para verificar si el usuario está autenticado
   isAuthenticated(): boolean {
     return this.user !== null && this.user.isAuthenticated;
   }
 
   // Método para obtener el usuario actual
   getCurrentUser() {
     return this.user;
   }*/
  private apiUrl = `${environment.baseUrl}`;
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();
  constructor(private http: HttpClient) { }


  login(credentials: { email: string; password: string; recaptchaToken: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login/`, credentials).pipe(
      tap((response: any) => {
        this.userRoleSubject.next(response.tipo);
      })
    );
  }

}
