import { Routes } from '@angular/router';
import { LoginnComponent } from './components/public/loginn/loginn.component';
import { RegisterComponent } from './components/public/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { RecuperarComponent } from './components/public/recuperar/recuperar.component';
import { RoleGuard } from './components/guards/auth.guard';

//cliente
import { ProfileComponent } from './components/autenticado/profile/profile.component';
import { HomeclienComponent } from './components/autenticado/homeclien/homeclien.component';

//admin
import { CompanyComponent } from './components/administrador/company/company.component';
import { HomeadminComponent } from './components/administrador/homeadmin/homeadmin.component';


export const routes: Routes = [
  { path: 'login', component: LoginnComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'recuperar', component: RecuperarComponent },

  //cliente
  { path: 'homecliente', component: HomeclienComponent, canActivate: [RoleGuard] },
  { path: 'perfil', component: ProfileComponent, canActivate: [RoleGuard] },

  //admin
  { path: 'homeadmin', component: HomeadminComponent, canActivate: [RoleGuard] },
  { path: 'empresa', component: CompanyComponent, canActivate: [RoleGuard] }
];