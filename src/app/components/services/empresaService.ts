import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';

@Injectable({
    providedIn: 'root'
})
export class EmpresaService {
    private apiUrl = `${environment.baseUrl}`;

    constructor(private http: HttpClient) { }

    // Obtener la información de la empresa
    getCompanyInfo(): Observable<any> {
        return this.http.get(`${this.apiUrl}/public/company/info`);
    }
    // Actualizar la información existente de la empresa
    updateCompanyInfo(companyData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/company/update`, companyData,{ withCredentials: true });
    }

    // Eliminar enlaces de redes sociales
    deleteSocialMediaLinks(links: string[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/company/delete-social-links`, { links });
    }
}
