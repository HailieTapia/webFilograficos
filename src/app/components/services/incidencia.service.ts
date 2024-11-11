import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';
import { HttpParams, HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private apiUrl = `${environment.baseUrl}/admin`; 

  constructor(private http: HttpClient) { }
  // Obtener intentos fallidos de inicio de sesión
  getFailedLoginAttempts(periodo: string): Observable<any> {
    const params = new HttpParams().set('periodo', periodo);
    return this.http.get<any>(`${this.apiUrl}/failed-attempts`, { params, withCredentials: true })
  }
  // Método para actualizar los tiempos de vida de los tokens y códigos
  updateTokenLifetime(config: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-token-lifetime`, config,{ withCredentials: true });
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