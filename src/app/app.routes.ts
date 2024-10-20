import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component'; // Ajusta la ruta si es necesario
import { FooterComponent } from './components/footer/footer.component'; // Ajusta la ruta si es necesario

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // Otras rutas...
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    // Otros módulos...
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
