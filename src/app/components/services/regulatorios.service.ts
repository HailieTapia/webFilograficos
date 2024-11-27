import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';
import { tap, switchMap } from 'rxjs/operators';
import { CsrfService } from './csrf.service';

@Injectable({
    providedIn: 'root'
})
export class RegulatorioService {

    private apiUrl = `${environment.baseUrl}`; 

    constructor(private csrfService: CsrfService,private http: HttpClient) { }

  // Crear un nuevo documento regulatorio
  createDocument(document: any): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.post<any>(`${this.apiUrl}/regulatory/create`, document, {
          headers,
          withCredentials: true
        });
      })
    );
  }
  // eliminar lógicamente un documento completo regulatorio LISTO
  deleteDocument(documentId: string): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.delete<any>(`${this.apiUrl}/regulatory/delete-document/${documentId}`, {
          headers,
          withCredentials: true
        });
      })
    );
  }
  // eliminar lógicamente una version de un documento regulatorio 
  deleteDocumentVersion(documentId: string, version: string): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.delete<any>(`${this.apiUrl}/regulatory/delete/${documentId}/${version}`, {
          headers,
          withCredentials: true
        });
      })
    );
  }
  // Actualizar documento regulatorio y crear una nueva versión
  updateDocument(documentId: string, updatedContent: any): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.put<any>(`${this.apiUrl}/regulatory/update/${documentId}`, updatedContent, {
          headers,
          withCredentials: true
        });
      })
    );
  }
  // Obtener la versión vigente de un documento regulatorio y Obtener un documento regulatorio
  getCurrentVersion(titulo: string): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.get<any>(`${this.apiUrl}/public/regulatory-document/${titulo}`, {
          headers,
          withCredentials: true
        });
      })
    );
  } 
  // Obtener el historial de versiones de un documento
  getVersionHistory(titulo: string): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.get<any>(`${this.apiUrl}/regulatory/version-history/${titulo}`, {
          headers,
          withCredentials: true
        });
      })
    );
  }
  // Obtener un documento por ID
  getDocumentById(documentId: string): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.get<any>(`${this.apiUrl}/regulatory/document/${documentId}`, {
          headers,
          withCredentials: true
        });
      })
    );
  }
  // Restaurar un documento regulatorio por su id
  restoreDocument(documentId: string): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.put<any>(`${this.apiUrl}/regulatory/restore-document/${documentId}`, {}, {
          headers,
          withCredentials: true
        });
      })
    );
  }
  // Restaurar una versión de un documento
  restoreDocumentVersion(documentId: string, versionId: string): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.put<any>(`${this.apiUrl}/regulatory/restore-version/${documentId}/${versionId}`, {}, {
          headers,
          withCredentials: true
        });
      })
    );
  }
  // Obtener todos los documentos regulatorios y obtener la versión vigente LISTO
  getAllDocuments(): Observable<any> {
    return this.csrfService.getCsrfToken().pipe(
      switchMap(csrfToken => {
        const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
        return this.http.get<any>(`${this.apiUrl}/public/regulatory-document`, {
          headers,
          withCredentials: true
        });
      })
    );
  }
}

