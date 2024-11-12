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
        return this.http.put(`${this.apiUrl}/company/update`, companyData, { withCredentials: true });
    }
    // Eliminar enlaces de redes sociales
    deleteSocialMediaLinks(redesSociales: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/company/delete-social-media-links`, { redes_sociales: redesSociales }, { withCredentials: true });
    }
    //NO SE OCUPA
    // Crear una nueva empresa
    createCompany(companyData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/company/create`, companyData, { withCredentials: true });
    }
    // Borrar la empresa (marcarla como inactiva)
    deleteCompany(): Observable<any> {
        return this.http.post(`${this.apiUrl}/company/delete`, {}, { withCredentials: true });
    }
    // Restaurar la empresa (activar de nuevo)
    restoreCompany(): Observable<any> {
        return this.http.post(`${this.apiUrl}/company/restore`, {}, { withCredentials: true });
    }
}
