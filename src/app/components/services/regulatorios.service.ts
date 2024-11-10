import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';
@Injectable({
    providedIn: 'root'
})
export class RegulatorioService {

    private apiUrl = `${environment.baseUrl}`; 

    constructor(private http: HttpClient) { }

  // Crear un nuevo documento regulatorio
  createDocument(document: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/regulatory/create`, document, { withCredentials: true });
  }
  // eliminar lógicamente un documento completo regulatorio LISTO
  deleteDocument(documentId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/regulatory/delete-document/${documentId}`, { withCredentials: true });
  }
  // eliminar lógicamente una version de un documento regulatorio 
  deleteDocumentVersion(documentId: string, version: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/regulatory/delete/${documentId}/${version}`);
  }
  // Actualizar documento regulatorio y crear una nueva versión
  updateDocument(documentId: string, updatedContent: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/regulatory/update/${documentId}`, updatedContent, { withCredentials: true });
  }
  // Obtener la versión vigente de un documento regulatorio y Obtener un documento regulatorio
  getCurrentVersion(titulo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/public/regulatory-document/${titulo}`);
  }
  // Obtener el historial de versiones de un documento
  getVersionHistory(titulo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/regulatory/version-history/${titulo}`, { withCredentials: true });
  }
  // Obtener un documento por ID
  getDocumentById(documentId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/regulatory/document/${documentId}`);
  }
  // Restaurar un documento regulatorio por su id
  restoreDocument(documentId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/regulatory/restore-document/${documentId}`, {});
  }
  // Restaurar una versión de un documento
  restoreDocumentVersion(documentId: string, versionId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/regulatory/restore-version/${documentId}/${versionId}`, {});
  }
  // Obtener todos los documentos regulatorios y obtener la versión vigente LISTO
  getAllDocuments(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/public/regulatory-document`);
  }
}

