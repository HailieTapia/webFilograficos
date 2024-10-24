import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';

export interface EmailTemplate {
  _id?: string;
  nombre: string;
  tipo: string; // Suponiendo que esto es un ID de tipo
  asunto: string;
  contenido_html: string;
  contenido_texto: string;
  variables: string[];
  activo?: boolean;
  creado_por?: string;
  actualizado_por?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailTemplateService {
  private apiUrl = `${environment.baseUrl}/email-templates`;
  
    constructor(private http: HttpClient) {}
  
    // Obtener todas las plantillas activas
    getAllTemplates(): Observable<any> {
      return this.http.get(`${this.apiUrl}`, { withCredentials: true });
    }
  
    // Obtener una plantilla por su ID
    getTemplateById(id: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/${id}`, { withCredentials: true });
    }
  
    // Crear una nueva plantilla
    createTemplate(data: any): Observable<any> {
      return this.http.post(`${this.apiUrl}`, data, { withCredentials: true });
    }
  
    // Actualizar una plantilla existente
    updateTemplate(id: string, data: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}`, data, { withCredentials: true });
    }
  
    // Eliminar una plantilla por su ID
    deleteTemplate(id: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
    }
  }
  