import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {

  private apiUrl = `${environment.baseUrl}/admin`;  // Usar la URL base del environment

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios con su sesión más reciente
  getAllUsersWithSessions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-users`, { withCredentials: true });
  }

  // Eliminar a un cliente
  deleteCustomer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-customer/${id}`, { withCredentials: true });
  }

  // Obtener lista de intentos fallidos de login
  getFailedLoginAttempts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/failed-attempts`, { withCredentials: true });
  }

  // Actualizar el número máximo de intentos fallidos de login
  updateMaxFailedLoginAttempts(maxAttempts: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-max-login-attempts`, { maxAttempts }, { withCredentials: true });
  }

  // Desbloquear a un usuario
  unlockUser(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/unlock-user/${userId}`, {}, { withCredentials: true });
  }

  // Actualizar el tiempo de vida de los tokens
  updateTokenLifetime(lifetime: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-token-lifetime`, { lifetime }, { withCredentials: true });
  }

  // Obtener la configuración de los tiempos de vida de los tokens
  getTokenLifetime(): Observable<any> {
    return this.http.get(`${this.apiUrl}/token-lifetime`, { withCredentials: true });
  }
}
