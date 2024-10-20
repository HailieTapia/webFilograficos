import { Component } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input'; // Para matInput
import { MatFormFieldModule } from '@angular/material/form-field'; // Para mat-form-field
import { MatButtonModule } from '@angular/material/button'; // Para los botones
import { MatToolbarModule } from '@angular/material/toolbar'; // Para mat-toolbar
import { CommonModule } from '@angular/common'; 

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    CommonModule, 
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Asegúrate de usar 'styleUrls'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor() {}

  onSubmit() {
    // Aquí agregarás la lógica para autenticar al usuario.
    if (this.email === 'user@example.com' && this.password === 'password') {
      console.log('Inicio de sesión exitoso');
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Credenciales inválidas. Inténtalo de nuevo.';
    }
  }
}
