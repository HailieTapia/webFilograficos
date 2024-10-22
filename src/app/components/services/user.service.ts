import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
  })
  export class UserService {
    private tipoUsuarioSubject = new BehaviorSubject<string | null>(localStorage.getItem('tipo_usuario') || null);
    private userIdSubject = new BehaviorSubject<string | null>(localStorage.getItem('user_id') || null);
  
    // Observable para que los componentes se puedan suscribir
    tipoUsuario$: Observable<string | null> = this.tipoUsuarioSubject.asObservable();
    userId$: Observable<string | null> = this.userIdSubject.asObservable(); // Observable para userId
  
    constructor() {}
  
    // Llamar cuando el usuario se logee exitosamente
    setTipoUsuario(tipoUsuario: string): void {
      localStorage.setItem('tipo_usuario', tipoUsuario);
      this.tipoUsuarioSubject.next(tipoUsuario); // Emitir el nuevo valor
    }
  
    // Llamar cuando el usuario cierra sesión
    clearTipoUsuario(): void {
      localStorage.removeItem('tipo_usuario');
      this.tipoUsuarioSubject.next(null); // Emitir null para indicar que no hay usuario autenticado
    }
  
    // Verifica si el usuario está logeado
    isLoggedIn(): boolean {
      return !!localStorage.getItem('tipo_usuario');
    }
  
    // Establecer y limpiar userId
    setUserId(userId: string): void {
      localStorage.setItem('user_id', userId);
      this.userIdSubject.next(userId);
    }
    
    clearUserId(): void {
      localStorage.removeItem('user_id');
      this.userIdSubject.next(null);
    }
  }
  