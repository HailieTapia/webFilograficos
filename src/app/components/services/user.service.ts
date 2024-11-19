import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config';
import { tap, switchMap } from 'rxjs/operators';
import { CsrfService } from './csrf.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl = `${environment.baseUrl}`;

    constructor(private http: HttpClient, private csrfService: CsrfService,) { }

    //  Actualización del perfil del usuario
    updateProfile(data: any): Observable<any> {
        return this.csrfService.getCsrfToken().pipe(
            switchMap(csrfToken => {
                const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
                return this.http.put(`${this.apiUrl}/users/profile`, data, { headers, withCredentials: true });
            })
        );
    }

    //Actualización solo de la dirección del usuario
    updateUserProfile(direccion: any): Observable<any> {
        return this.csrfService.getCsrfToken().pipe(
            switchMap(csrfToken => {
                const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
                return this.http.put(`${this.apiUrl}/users/change-address`, { direccion }, { headers, withCredentials: true });
            })
        );
    }

    //Obtener perfil del usuario autenticado
    getProfile(): Observable<any> {
        return this.csrfService.getCsrfToken().pipe(
            switchMap(csrfToken => {
                const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
                return this.http.get(`${this.apiUrl}/users/profile`, { headers, withCredentials: true });
            })
        );
    }

    // Eliminación de cuenta del cliente autenticado
    deleteMyAccount(): Observable<any> {
        return this.csrfService.getCsrfToken().pipe(
            switchMap(csrfToken => {
                const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
                return this.http.delete(`${this.apiUrl}/users/delete-account`, { headers, withCredentials: true });
            })
        );
    }
    //Cambio contra
    changePassword(currentPassword: string, newPassword: string): Observable<any> {
        return this.csrfService.getCsrfToken().pipe(
            switchMap(csrfToken => {
                const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
                return this.http.put(`${this.apiUrl}/auth/change-password`,
                    { currentPassword, newPassword },
                    { headers, withCredentials: true }
                );
            })
        );
    }
    //NO USAREMOS
    // Eliminación de cuenta de cliente por administrador
    deleteCustomerAccount(id: string): Observable<any> {
        return this.csrfService.getCsrfToken().pipe(
            switchMap(csrfToken => {
                const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
                return this.http.put(`${this.apiUrl}/users/deactivate-account/${id}`, {}, { headers, withCredentials: true });
            })
        );
    }

    // Obtener todos los usuarios con su sesión más reciente
    getAllUsersWithSessions(): Observable<any> {
        return this.csrfService.getCsrfToken().pipe(
            switchMap(csrfToken => {
                const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
                return this.http.get(`${this.apiUrl}/admin/users/sessions`, { headers, withCredentials: true });
            })
        );
    }

    //Desactivar o bloquear una cuenta de usuario
    deactivateAccount(userId: string, accion: 'bloquear' | 'suspender' | 'activar'): Observable<any> {
        return this.csrfService.getCsrfToken().pipe(
            switchMap(csrfToken => {
                const headers = new HttpHeaders().set('x-csrf-token', csrfToken);
                return this.http.put(`${this.apiUrl}/users/deactivate-account`, { userId, accion }, { headers, withCredentials: true });
            })
        );
    }
}