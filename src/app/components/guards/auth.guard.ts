import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.currentUser.pipe(
      map(user => {
        if (!user) {
          // Si no hay usuario autenticado, redirigir
          this.router.navigate(['/home']);
          return false;
        }

        const clienteRoutes = ['perfil', 'homecliente']; 

        const adminRoutes = ['empresa', 'homeadmin']; 

        if (user.tipo === 'cliente') {
          if (clienteRoutes.includes(route.routeConfig?.path || '')) {
            return true; 
          }
        } else if (user.tipo === 'administrador') {
          if (adminRoutes.includes(route.routeConfig?.path || '')) {
            return true;
          }
        }

        // Si no tiene acceso a la ruta
        this.router.navigate(['/home']);
        return false;
      })
    );
  }
}
