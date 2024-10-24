import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private apiUrl = `${environment.baseUrl}/incidencias`;

  constructor(private http: HttpClient) { }

  // Obtener todas las incidencias
  getIncidencias(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Crear nueva incidencia
  createIncidencia(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualizar incidencia
  updateIncidencia(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar incidencia
  deleteIncidencia(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
