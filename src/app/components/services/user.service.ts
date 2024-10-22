import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/config';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.baseUrl}`;
  
  private tipoUsuarioSubject = new BehaviorSubject<string | null>(this.getFromLocalStorage('tipo_usuario'));
  private userIdSubject = new BehaviorSubject<string | null>(this.getFromLocalStorage('user_id'));
  
  tipoUsuario$: Observable<string | null> = this.tipoUsuarioSubject.asObservable();
  userId$: Observable<string | null> = this.userIdSubject.asObservable();

  constructor(private http: HttpClient) { // Inyectar HttpClient
    window.addEventListener('storage', (event) => {
      if (event.key === 'tipo_usuario') {
        this.tipoUsuarioSubject.next(event.newValue);
      }
      if (event.key === 'user_id') {
        this.userIdSubject.next(event.newValue);
      }
    });
  }

  // Método para cerrar sesión
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        // Limpiar los datos de la sesión local después de un cierre exitoso
        this.clearUserId();
        this.clearTipoUsuario();
      })
    );
  }

  // Llamar cuando el usuario se logee exitosamente
  setTipoUsuario(tipoUsuario: string): void {
    this.setToLocalStorage('tipo_usuario', tipoUsuario);
    this.tipoUsuarioSubject.next(tipoUsuario);
  }

  clearTipoUsuario(): void {
    this.removeFromLocalStorage('tipo_usuario');
    this.tipoUsuarioSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getFromLocalStorage('tipo_usuario');
  }

  setUserId(userId: string): void {
    this.setToLocalStorage('user_id', userId);
    this.userIdSubject.next(userId);
  }

  clearUserId(): void {
    this.removeFromLocalStorage('user_id');
    this.userIdSubject.next(null);
  }

  // Métodos auxiliares para manejar el localStorage de forma centralizada
  private setToLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  private getFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  private removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }
}
