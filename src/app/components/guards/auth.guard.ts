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
          // Si no hay usuario autenticado, redirigir a login
          this.router.navigate(['/login']);
          return false;
        }

        // Aquí definimos las rutas permitidas para cada rol
        const clienteRoutes = ['perfil', 'otraRutaCliente']; // Rutas permitidas para clientes
        const adminRoutes = ['empresa', 'otraRutaAdmin']; // Rutas permitidas para administradores

        if (user.tipo === 'cliente') {
          // Verificar si la ruta a la que se intenta acceder es para clientes
          if (clienteRoutes.includes(route.routeConfig?.path || '')) {
            return true; // Permitir acceso a la ruta de cliente
          }
        } else if (user.tipo === 'administrador') {
          // Verificar si la ruta a la que se intenta acceder es para administradores
          if (adminRoutes.includes(route.routeConfig?.path || '')) {
            return true; // Permitir acceso a la ruta de administrador
          }
        }

        // Si no tiene acceso a la ruta, redirigir a login
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
