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
import { EmailTemplateListComponent } from './components/administrador/email-template-list/email-template-list.component';
import { EmailTemplateFormComponent } from './components/administrador/email-template-form/email-template-form.component';


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
  { path: 'email-templates', component: EmailTemplateListComponent , canActivate: [RoleGuard] },
  { path: 'email-templates/new', component: EmailTemplateFormComponent , canActivate: [RoleGuard] },
  { path: 'email-templates/edit/:id', component: EmailTemplateFormComponent , canActivate: [RoleGuard] },
];