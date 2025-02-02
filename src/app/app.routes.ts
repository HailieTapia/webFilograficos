import { Routes } from '@angular/router';
import { LoginnComponent } from './components/public/loginn/loginn.component';
import { RegisterComponent } from './components/public/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { RecuperarComponent } from './components/public/recuperar/recuperar.component';
import { RoleGuard } from './components/guards/auth.guard';
import { DocumentosComponent } from './components/public/documentos/documentos.component';
import { CondocumetoComponent } from './components/public/condocumento/condocumento.component';
import { privdocumentosComponent } from './components/public/privdocumento/privdocumento.component';

//cliente
import { ProfileComponent } from './components/autenticado/profile/profile.component';
import { HomeclienComponent } from './components/autenticado/homeclien/homeclien.component';

//admin
import { EmpresaComponent } from './components/administrador/empresa/empresa.component';
import { HomeadminComponent } from './components/administrador/homeadmin/homeadmin.component';
import { IncidenciaComponent } from './components/administrador/incidencia/incidencia.component';
import { EmailTypeListComponent } from './components/administrador/email-type-list/email-type-list.component';
import { EmailTemplateComponent } from './components/administrador/email-template/email-template.component';
import { RegulatoryDocumentComponent } from './components/administrador/regulatory-document/regulatory-document.component';
//Errores
import { Error400Component } from './components/errores/error400/error400.component';
import { Error404Component } from './components/errores/error404/error404.component';
import { Error500Component } from './components/errores/error500/error500.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginnComponent, data: { 4: ['Inicio', 'Login'] } },
  { path: 'registro', component: RegisterComponent, data: { breadcrumbs: ['Inicio', 'Registro'] } },
  { path: 'home', component: HomeComponent, data: { breadcrumbs: ['Inicio'] } },
  { path: 'recuperar', component: RecuperarComponent, data: { breadcrumbs: ['Inicio', 'Recuperar Contraseña'] } },
  { path: 'deslinde-legal', component: DocumentosComponent, data: { breadcrumbs: ['Inicio', 'Documentos', 'Deslinde Legal'] } },
  { path: 'aviso-privacidad', component: privdocumentosComponent, data: { breadcrumbs: ['Inicio', 'Documentos', 'Aviso de Privacidad'] } },
  { path: 'terminos-condiciones', component: CondocumetoComponent, data: { breadcrumbs: ['Inicio', 'Documentos', 'Términos y Condiciones'] } },

  //cliente
  { path: 'homecliente', component: HomeclienComponent, canActivate: [RoleGuard], data: { breadcrumbs: ['Cliente', 'Home'] } },
  { path: 'perfil', component: ProfileComponent, canActivate: [RoleGuard], data: { breadcrumbs: ['Cliente', 'Perfil'] } },

  //admin
  { path: 'homeadmin', component: HomeadminComponent, canActivate: [RoleGuard], data: { breadcrumbs: ['Administrador', 'Home'] } },
  { path: 'empresa', component: EmpresaComponent, canActivate: [RoleGuard], data: { breadcrumbs: ['Administrador', 'Empresa'] } },
  { path: 'incidencia', component: IncidenciaComponent, canActivate: [RoleGuard], data: { breadcrumbs: ['Administrador', 'Incidencias'] } },
  { path: 'type', component: EmailTypeListComponent, canActivate: [RoleGuard], data: { breadcrumbs: ['Administrador', 'Tipos de Emails'] } },
  { path: 'regulatorio', component: RegulatoryDocumentComponent, canActivate: [RoleGuard], data: { breadcrumbs: ['Administrador', 'Documentos Regulatorios'] } },
  { path: 'plantilla', component: EmailTemplateComponent, canActivate: [RoleGuard], data: { breadcrumbs: ['Administrador', 'Plantillas de Email'] } },

  // Rutas de error
  { path: 'error400', component: Error400Component, data: { breadcrumbs: ['Error', '400'] } },
  { path: 'error500', component: Error500Component, data: { breadcrumbs: ['Error', '500'] } },

  // Ruta comodín para manejar 404
  { path: '**', component: Error404Component, data: { breadcrumbs: ['Error', '404'] } }
];
