import { Routes } from '@angular/router';
import { LoginnComponent } from './components/public/loginn/loginn.component';
import { RegisterComponent } from './components/public/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { RecuperarComponent } from './components/public/recuperar/recuperar.component';
import { ProfileComponent } from './components/autenticado/profile/profile.component';
import { RoleGuard } from './components/guards/auth.guard';
import { CompanyComponent } from './components/administrador/company/company.component';

export const routes: Routes = [
  { path: 'login', component: LoginnComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'recuperar', component: RecuperarComponent },

  //cliente
  { path: 'perfil', component: ProfileComponent, canActivate: [RoleGuard] },
  //admin
  { path: 'empresa', component: CompanyComponent, canActivate: [RoleGuard] }
];