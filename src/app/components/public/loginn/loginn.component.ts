import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; // Importar MatIconModule

@Component({
  selector: 'app-loginn',
  standalone: true,
  imports: [ MatIconModule,   CommonModule,FormsModule,MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule],
  templateUrl: './loginn.component.html',
  styleUrl: './loginn.component.css'
})
export class LoginnComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

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