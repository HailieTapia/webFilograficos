import { Routes } from '@angular/router';
import { LoginnComponent } from './components/public/loginn/loginn.component'; 
import { RegisterComponent } from './components/public/register/register.component'; 
import { HomeComponent } from './components/home/home.component'; 
import { RecuperarComponent } from './components/public/recuperar/recuperar.component'; 


export const routes: Routes = [
    { path: 'login', component: LoginnComponent },
    { path: 'registro', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'recuperar', component: RecuperarComponent },
];

