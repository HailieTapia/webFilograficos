import { Routes } from '@angular/router';
import { LoginnComponent } from './components/public/loginn/loginn.component'; 
import { RegisterComponent } from './components/public/register/register.component'; 
import { HomeComponent } from './components/home/home.component'; 
import { RecuperarComponent } from './components/public/recuperar/recuperar.component'; 
import { ProfileComponent } from './components/autenticado/profile/profile.component'; 
import { RoleGuard } from './components/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginnComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'recuperar', component: RecuperarComponent },
  { path: 'perfil', component: ProfileComponent,  canActivate: [RoleGuard]  },
  // Puedes agregar otras rutas protegidas según el rol de usuario, por ejemplo, para admin:
 /* { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [RoleGuard]  // Proteger la ruta admin
  }*/
];