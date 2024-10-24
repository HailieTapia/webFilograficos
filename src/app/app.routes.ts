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
import { EmpresaComponent } from './components/administrador/empresa/empresa.component';
import { HomeadminComponent } from './components/administrador/homeadmin/homeadmin.component';
import { IncidenciaComponent } from './components/administrador/incidencia/incidencia.component';
import { EmailTypeListComponent } from './components/administrador/email-type-list/email-type-list.component';
import { EmailTemplateComponent } from './components/administrador/email-template/email-template.component';
import { RegulatoriosComponent } from './components/administrador/regulatorios/regulatorios.component';


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
  { path: 'empresa', component: EmpresaComponent , canActivate: [RoleGuard] },
  { path: 'incidencia', component: IncidenciaComponent , canActivate: [RoleGuard] },
  { path: 'type', component: EmailTypeListComponent , canActivate: [RoleGuard] },
  { path: 'regulatorio', component: RegulatoriosComponent , canActivate: [RoleGuard] },
  { path: 'plantilla', component: EmailTemplateComponent , canActivate: [RoleGuard] },
];