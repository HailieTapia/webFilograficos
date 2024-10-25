import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';

@Injectable({
    providedIn: 'root'
})
export class RegulatorioService {
    private apiUrl = `${environment.baseUrl}/regulatory`; // URL base ajustada

    constructor(private http: HttpClient) { }

    // Crear un nuevo documento regulatorio
    createDocument(document: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/create`, document, { withCredentials: true });
    }
    // Actualizar un documento regulatorio
    updateDocument(documentId: string, updatedContent: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/update/${documentId}`, updatedContent);
    }

    // Eliminar lógicamente un documento regulatorio
    deleteDocument(documentId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete-document/${documentId}`);
    }

    // Eliminar lógicamente una versión de un documento regulatorio
    deleteDocumentVersion(documentId: string, versionId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete/${documentId}/${versionId}`);
    }

    // Restaurar lógicamente un documento regulatorio
    restoreDocument(documentId: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/restore-document/${documentId}`, {});
    }

    // Restaurar lógicamente una versión de un documento regulatorio
    restoreDocumentVersion(documentId: string, versionId: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/restore-version/${documentId}/${versionId}`, {});
    }

    // Obtener el historial de versiones de un documento
    getVersionHistory(titulo: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/version-history/${titulo}`);
    }

    // Obtener un documento regulatorio por su ID
    getDocumentById(documentId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/document/${documentId}`);
    }

    // Obtener la versión vigente de un documento regulatorio (ruta pública)
    getCurrentVersion(titulo: string): Observable<any> {
        return this.http.get(`${environment.baseUrl}/public/regulatory-document/${titulo}`);
    }
}
