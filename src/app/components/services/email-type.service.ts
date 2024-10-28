import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';

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

  constructor(private http: HttpClient) { }

  // Crear un nuevo tipo de email
  createEmailType(data: EmailType): Observable<EmailType> {
    return this.http.post<EmailType>(this.apiUrl, data, { withCredentials: true });
  }
  // Obtener un tipo de email por su ID
  getEmailTypeById(id: string): Observable<EmailType> {
    return this.http.get<EmailType>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
  // obtener todos los tipos de email
  getAllEmailTypes(): Observable<EmailTypeResponse> {
    return this.http.get<EmailTypeResponse>(this.apiUrl, { withCredentials: true });
  }
  // Actualizar un tipo de email existente
  updateEmailType(id: string, data: EmailType): Observable<EmailType> {
    return this.http.put<EmailType>(`${this.apiUrl}/${id}`, data, { withCredentials: true });
  }
  // Eliminar un tipo de email por su ID (eliminación lógica)
  deleteEmailType(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
