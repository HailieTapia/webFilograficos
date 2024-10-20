import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    // Verificar si el usuario está autenticado
    const user = this.authService.getCurrentUser();
    if (user && user.isAuthenticated) {
      // Aquí puedes implementar lógica para verificar roles
      const requiredRoles = route.data['roles'] as Array<string>;
      if (requiredRoles && requiredRoles.length > 0) {
        // Verificar si el usuario tiene uno de los roles requeridos
        const hasRole = requiredRoles.some(role => user.roles.includes(role));
        if (hasRole) {
          return true; // Permitir el acceso
        } else {
          this.router.navigate(['/unauthorized']); // Redirigir a una página de acceso denegado
          return false; // Denegar el acceso
        }
      }
      return true; // Permitir el acceso si no se requieren roles
    } else {
      this.router.navigate(['/login']); // Redirigir a la página de login
      return false; // Denegar el acceso
    }
  }
}
