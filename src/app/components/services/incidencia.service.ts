import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/config';
import { tap, switchMap } from 'rxjs/operators';
import { CsrfService } from './csrf.service';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private apiUrl = `${environment.baseUrl}/admin`; 

  constructor(private csrfService: CsrfService,private http: HttpClient) { }
  // Obtener intentos fallidos de inicio de sesión
  getFailedLoginAttempts(periodo: string): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        const params = new HttpParams().set('periodo', periodo);
        return this.http.get<any>(`${this.apiUrl}/failed-attempts`, {
          headers,
          params,
          withCredentials: true
        });
      })
    );
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