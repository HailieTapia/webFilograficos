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

@Component({
  selector: 'app-loginn',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ReactiveFormsModule // Asegúrate de incluir este módulo aquí
  ],
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
  recaptchaToken: string = ''; // Variable para almacenar el token
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
    if (message) { // Verifica que no sea null o undefined
      this.snackBar.open(message, 'Cerrar', {
        duration: 3000,
      });
    }
  }
  

  onRecaptchaResolved(captchaResponse: string | null) {
    if (captchaResponse) {
      this.loginForm.patchValue({ recaptcha: captchaResponse }); // Almacena el token en el formulario
    }
  }

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;
  
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password, recaptcha } = this.loginForm.value;
  
      // Verifica que recaptcha tenga un valor
      if (recaptcha) {
        this.authService.login({ email, password, recaptchaToken: recaptcha }).subscribe({
          next: (response: any) => {
            this.successMessage = 'Inicio de sesión exitoso';
            this.showAlert(this.successMessage);
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          },
          error: (err) => {
            this.errorMessage = err.error?.message || 'Error en el inicio de sesión';
            this.showAlert(this.errorMessage);
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
