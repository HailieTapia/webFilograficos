import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha-2';
import { Router } from '@angular/router';
//import { UserService } from '../../services/user.service'; // Importa el servicio

@Component({
  selector: 'app-loginn',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule, RecaptchaModule, RecaptchaFormsModule, ReactiveFormsModule],
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
  recaptchaToken: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  hide: boolean = true;
  loading: boolean = false;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      recaptcha: ['', Validators.required],
    });
  }
  get f() {
    return this.loginForm.controls;
  }

  showAlert(message: string | null) {
    if (message) {
      this.snackBar.open(message, 'Cerrar', {
        duration: 3000,
      });
    }
  }
  onRecaptchaResolved(captchaResponse: string | null) {
    if (captchaResponse) {
      this.loginForm.patchValue({ recaptcha: captchaResponse });
    }
  }

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password, recaptcha } = this.loginForm.value;

      if (recaptcha) {
        this.authService.login({ email, password, recaptchaToken: recaptcha }).subscribe({
          next: (response: any) => {
            const userId = response?.userId;
            const tipo_usuario = response?.tipo;

            if (userId && tipo_usuario) {
              this.authService.getId();
              this.authService.getTipoUsuario();

              if (tipo_usuario === 'cliente') {
                this.router.navigate(['/homecliente']); // Redirige a homeclient
              } else if (tipo_usuario === 'administrador') {
                this.router.navigate(['/homeadmin']); // Redirige a homeadmin
              }

            } else {
              console.error('Los campos userId o tipo no existen en la respuesta');
            }

            this.successMessage = 'Inicio de sesión exitoso';
            this.showAlert(this.successMessage);
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2000);
          },
          error: (err) => {
            this.errorMessage = err.error?.message || 'Error en el inicio de sesión';
            this.showAlert(this.errorMessage);
            setTimeout(() => {
              location.reload();
            }, 2000);
          },
          complete: () => {
            this.loading = false;
          }
        });
      } else {
        this.errorMessage = 'El reCAPTCHA es obligatorio.';
        this.showAlert(this.errorMessage);
        this.loading = false;
      }
    } else {
      this.errorMessage = 'Por favor completa todos los campos requeridos.';
      this.showAlert(this.errorMessage);
    }
  }
}
