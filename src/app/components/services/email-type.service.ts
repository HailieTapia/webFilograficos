import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';
import { tap, switchMap } from 'rxjs/operators';
import { CsrfService } from './csrf.service';

export interface EmailType {
  _id?: string; //(opcional)
  codigo: string; 
  nombre: string; 
  descripcion?: string; 
  variables_requeridas: string[]; 
  activo?: boolean;
  creado_por: string; 
  fecha_creacion?: Date;
  fecha_actualizacion?: Date; //(opcional)
  __v?: number; // (opcional)
}

export interface EmailTypeResponse {
  emailTypes: EmailType[];
}
@Injectable({
  providedIn: 'root',
})
export class EmailTypeService {
  private apiUrl = `${environment.baseUrl}/email-types`;

  constructor(private csrfService: CsrfService,private http: HttpClient) { }

  // Crear un nuevo tipo de email
  createEmailType(data: EmailType): Observable<EmailType> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.post<EmailType>(this.apiUrl, data, { headers, withCredentials: true });
      })
    );
  }
  
  // Obtener un tipo de email por su ID
  getEmailTypeById(id: string): Observable<EmailType> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.get<EmailType>(`${this.apiUrl}/${id}`, { headers, withCredentials: true });
      })
    );
  }
  
  // obtener todos los tipos de email
  getAllEmailTypes(): Observable<EmailTypeResponse> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.get<EmailTypeResponse>(this.apiUrl, { headers, withCredentials: true });
      })
    );
  }
  
  // Actualizar un tipo de email existente
  updateEmailType(id: string, data: EmailType): Observable<EmailType> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.put<EmailType>(`${this.apiUrl}/${id}`, data, { headers, withCredentials: true });
      })
    );
  }
  
  // Eliminar un tipo de email por su ID (eliminación lógica)
  deleteEmailType(id: string): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.delete(`${this.apiUrl}/${id}`, { headers, withCredentials: true });
      })
    );
  }
  
}
