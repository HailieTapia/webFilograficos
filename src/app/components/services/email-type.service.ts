import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';

export interface EmailType {
  _id?: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  variables_requeridas: string[];
  activo?: boolean;
  creado_por?: string;
  actualizado_por?: string;
}
// Crear una nueva interfaz para la respuesta
export interface EmailTypeResponse {
  emailTypes: EmailType[];
}
@Injectable({
  providedIn: 'root',
})
export class EmailTypeService {
  private apiUrl = `${environment.baseUrl}/email-types`;

  constructor(private http: HttpClient) {}

  // Cambiar el método en el servicio
getAllEmailTypes(): Observable<EmailTypeResponse> {
  return this.http.get<EmailTypeResponse>(this.apiUrl, { withCredentials: true });
}
  // Obtener un tipo de email por su ID
  getEmailTypeById(id: string): Observable<EmailType> {
    return this.http.get<EmailType>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // Crear un nuevo tipo de email
  createEmailType(data: EmailType): Observable<EmailType> {
    return this.http.post<EmailType>(this.apiUrl, data, { withCredentials: true });
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
