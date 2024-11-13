import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';
import { tap, switchMap } from 'rxjs/operators';
import { CsrfService } from './csrf.service';

export interface EmailTemplate {
  _id?: string;
  nombre: string;
  tipo: string;
  asunto: string;
  contenido_html: string;
  contenido_texto: string;
  variables: string[]; 
  activo?: boolean;
  creado_por?: string;
  actualizado_por?: string;
}
export interface EmailTemplateResponse {
  emailTemplate: EmailTemplate[];
}
@Injectable({
  providedIn: 'root',
})
export class EmailTemplateService {
  private apiUrl = `${environment.baseUrl}/email-templates`;

  constructor(private csrfService: CsrfService,private http: HttpClient) { }

  // Crear una nueva plantilla
  createTemplate(emailTemplate: EmailTemplate): Observable<EmailTemplate> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.post<EmailTemplate>(this.apiUrl, emailTemplate, { headers, withCredentials: true });
      })
    );
  }

  // Obtener todas las plantillas activas
  getAllTemplates(): Observable<EmailTemplate[]> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.get<EmailTemplate[]>(this.apiUrl, { headers, withCredentials: true });
      })
    );
  }

  // Obtener plantilla por ID
  getTemplateById(id: string): Observable<EmailTemplate> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.get<EmailTemplate>(`${this.apiUrl}/${id}`, { headers, withCredentials: true });
      })
    );
  }

  // Actualizar una plantilla existente
  updateTemplate(id: string, data: EmailTemplate): Observable<EmailTemplate> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.put<EmailTemplate>(`${this.apiUrl}/${id}`, data, { headers, withCredentials: true });
      })
    );
  }

  // Eliminar una plantilla por su ID
  deleteTemplate(id: string): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.delete(`${this.apiUrl}/${id}`, { headers, withCredentials: true });
      })
    );
  }
}
