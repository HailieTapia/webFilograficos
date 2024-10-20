import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loginn',
  standalone: true,
  imports: [MatSnackBarModule,MatIconModule,CommonModule,FormsModule,MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,],
  templateUrl: './loginn.component.html',
  styleUrls: ['./loginn.component.css'],
  animations: [
    trigger('transitionMessages', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LoginnComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  hide: boolean = true; 

  constructor(private snackBar: MatSnackBar, private authService: AuthService) {}

  showAlert(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }

  onSubmit(loginForm: any) {
    if (loginForm.valid) {
      const { email, password } = loginForm.value;

      this.authService.login({ email, password}).subscribe(
        (response) => {
          // Maneja la respuesta exitosa (ejemplo: redireccionar o guardar token)
          console.log('Inicio de sesión exitoso:', response);
          this.showAlert('Inicio de sesión exitoso');
        },
        (error) => {
          // Maneja el error (ejemplo: mostrar mensaje de error)
          console.error('Error en el inicio de sesión:', error);
          this.errorMessage = 'Error en el inicio de sesión. Verifica tus credenciales.';
          this.showAlert(this.errorMessage);
        }
      );
    } else {
      this.showAlert('Por favor completa el formulario correctamente.');
    }
  }
}