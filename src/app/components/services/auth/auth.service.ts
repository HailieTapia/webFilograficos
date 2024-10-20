import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { Usuario } from '../user/user.models';
import { Cuenta } from '../account/account.models';
import { AuthResponse, LoginCredentials } from './auth.models';
import { environment } from '../../../../environments/environment.example';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.API_URL}/auth`;
  public currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser: Observable<any>;
  private isCheckingAuth: boolean = false;
  private userRoleSubject = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) {
    this.currentUser = this.currentUserSubject.asObservable();
  }


  login(credenciales: LoginCredentials, captchaToken: string, rememberMe: boolean): Observable<any> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { credenciales, captchaToken }, {
      withCredentials: true,
    }).pipe(

    );
  }
  register(usuario: Partial<Usuario>, cuenta: Partial<Cuenta>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, { usuario, cuenta }, {
      withCredentials: true,
    }).pipe(

    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true,
    }).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      }),
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.currentUser.pipe(
      map(user => !!user)
    );
  }

  setUserRole(role: number): void {
    this.userRoleSubject.next(role);
  }

  getUserRole(): Observable<number | null> {
    return this.userRoleSubject.asObservable();
  }

  async checkAuthStatus(): Promise<any> {
    this.isCheckingAuth = true;
    try {
      const user = await this.http.get(`${this.apiUrl}/check-auth`, {
        withCredentials: true,
      }).toPromise();

      this.currentUserSubject.next(user);
      return user;
    } catch {
      this.currentUserSubject.next(null);
      return null;
    } finally {
      this.isCheckingAuth = false;
    }
  }

}

