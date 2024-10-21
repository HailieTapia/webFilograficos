import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PwnedService } from '../../services/pwned.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
export class RegisterComponent {
  registerForm: FormGroup;
  hide: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  errorMessage1: string | null = null;
  successMessage1: string | null = null;

  constructor(private pwnedService: PwnedService, private fb: FormBuilder, private snackBar: MatSnackBar, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ\s]+$/), Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      tipo_usuario: ['cliente'],
      mfa_activado: [false]
    }, { validators: this.passwordMatchValidator });
     // Suscribirse a los cambios en los campos de contraseña y confirmación
     this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.updateValueAndValidity(); // Para re-evaluar el formulario
    });
    
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.registerForm.updateValueAndValidity(); // Para re-evaluar el formulario
    });
  }

  get f() {
    return this.registerForm.controls;
  }
  showAlert(message: string | null) {
    if (message) { // Verifica que no sea null o undefined
      this.snackBar.open(message, 'Cerrar', {
        duration: 3000,
      });
    }
  }
  // Valida que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  // Método para validar la contraseña
  validatePasswordStrength(password: string) {
    this.pwnedService.checkPassword(password).subscribe({
      next: (data) => {
        const lines = data.split('\n');
        const passwordHashSuffix = this.pwnedService.sha1(password).substring(5).toUpperCase();

        const match = lines.find(line => line.startsWith(passwordHashSuffix));
        if (match) {
          this.errorMessage1 = `Tu contraseña ha sido comprometida ${match.split(':')[1]} veces. Por favor, usa una contraseña más segura.`;
          this.hideMessageAfterDelay('errorMessage1');
        } else {
          this.successMessage1 = 'Tu contraseña es segura.';
           this.hideMessageAfterDelay('successMessage1');
          this.onRegister(); // Llama al método para continuar con el registro
        }
      },
      error: () => {
        this.errorMessage1 = 'Error al verificar la seguridad de la contraseña.';
        this.hideMessageAfterDelay('errorMessage1');
      }
    });
  }
   // Método para ocultar el mensaje después de 2 segundos
   hideMessageAfterDelay(messageType: 'errorMessage1' | 'successMessage1') {
    setTimeout(() => {
      if (messageType === 'errorMessage1') {
        this.errorMessage1 = null;
      } else if (messageType === 'successMessage1') {
        this.successMessage1 = null;
      }
    }, 3000);
  }

  // Método para continuar con el registro una vez validada la contraseña
  onRegister() {
    const { nombre, email, telefono, password, tipo_usuario, mfa_activado } = this.registerForm.value;

    this.authService.register({ nombre, email, telefono, password, tipo_usuario, mfa_activado }).subscribe({
      next: () => {
        this.successMessage = 'Registro exitoso';
        this.showAlert(this.successMessage);
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error en el registro';
        this.showAlert(this.errorMessage);
      }
    });
  }

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.valid) {
      const password = this.registerForm.get('password')?.value;
      // Llamar al servicio para validar si la contraseña ha sido comprometida
      this.validatePasswordStrength(password);
    } else {
      this.errorMessage = 'Por favor completa todos los campos requeridos.';
      this.showAlert(this.errorMessage);
    }
  }
}