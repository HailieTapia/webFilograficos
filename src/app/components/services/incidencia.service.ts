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

  // Obtener historial de intentos fallidos de inicio de sesión
  getFailedLoginAttempts(periodo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/failed-attempts`, {
      params: { periodo },
      withCredentials: true
    }).pipe();
  }

  // Actualizar los tiempos de vida de tokens y códigos
  updateTokenLifetime(config: {
    jwt_lifetime: number,
    verificacion_correo_lifetime: number,
    otp_lifetime: number,
    sesion_lifetime: number,
    cookie_lifetime: number,
    expirationThreshold_lifetime?: number,
    maximo_intentos_fallidos_login: number,
    maximo_bloqueos_en_n_dias: number,
    dias_periodo_de_bloqueo: number,

  }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-token-lifetime`,
      config,
      { withCredentials: true }
    ).pipe();
  }

  // Desbloquear un usuario por su ID
  adminUnlockUser(userId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/unlock-user/${userId}`, 
      {}, 
      { withCredentials: true }
    ).pipe();
  }

  // Obtener configuración existente
  getConfig(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/token-lifetime`, { withCredentials: true })
      .pipe();
  }
}
