import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';

export interface RegulatoryDocument {
    _id?: string; // Optional for new documents
    titulo: string;
    versiones: Version[];
    fecha_vigencia: Date;
    version_actual: string;
    eliminado: boolean;
}

export interface Version {
    version: string;
    contenido: string;
    vigente: boolean;
    eliminado: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class RegulatoryDocumentService {
    private apiUrl = `${environment.baseUrl}/regulatory`;

    constructor(private http: HttpClient) {}

    // Create a new regulatory document
    createRegulatoryDocument(document: RegulatoryDocument): Observable<any> {
        return this.http.post(`${this.apiUrl}/create`, document, { withCredentials: true });
    }

    // Logically delete a regulatory document
    deleteRegulatoryDocument(documentId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete-document/${documentId}`, { withCredentials: true });
    }

    // Logically delete a version of a regulatory document
    deleteRegulatoryDocumentVersion(documentId: string, versionToDelete: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete/${documentId}/${versionToDelete}`, { withCredentials: true });
    }

    // Update a regulatory document and create a new version
    updateRegulatoryDocument(documentId: string, nuevoContenido: string, nuevaFechaVigencia?: Date): Observable<any> {
        return this.http.put(`${this.apiUrl}/update/${documentId}`, { nuevo_contenido: nuevoContenido, nueva_fecha_vigencia: nuevaFechaVigencia }, { withCredentials: true });
    }

    // Get the current version of a regulatory document
    getCurrentVersion(titulo: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/current-version/${titulo}`, { withCredentials: true });
    }

    // Get the version history of a document
    getVersionHistory(titulo: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/version-history/${titulo}`, { withCredentials: true });
    }

    // Get a document by its ID
    getDocumentById(documentId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/document/${documentId}`, { withCredentials: true });
    }

    // Restore a regulatory document by its ID
    restoreRegulatoryDocument(documentId: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/restore-document/${documentId}`, {}, { withCredentials: true });
    }
}
