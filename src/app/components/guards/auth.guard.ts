import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.userRole$.pipe(
      map(role => {
        if (role === 'cliente' || role === 'administrador') {
          return true;  // Permitir acceso si es cliente o administrador
        } else {
          this.router.navigate(['/login']);  // Redirigir si no tiene rol adecuado
          return false;
        }
      })
    );
  }
}
