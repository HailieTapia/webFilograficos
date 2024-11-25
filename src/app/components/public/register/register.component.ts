import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PwnedService } from '../../services/pwned.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable, of, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatProgressBarModule, MatChipsModule, MatProgressSpinnerModule, CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../estilos/spinner.css', '../../estilos/snackbar.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading: boolean = false;

  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  passwordStrength: string = '';
  passwordStrengthValue: number = 0;
  passwordStrengthColor: string = 'warn';

  constructor(
    private pwnedService: PwnedService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [
        Validators.required, 
        Validators.pattern(/^(?! )[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ]+)*$/),
        Validators.minLength(3), 
        Validators.maxLength(50)
      ]],      
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, this.passwordStrengthValidator.bind(this),], [this.checkPasswordCompromised.bind(this)],],
      confirmPassword: ['', [Validators.required]],
      tipo_usuario: ['cliente'],
      mfa_activado: [false],
    },
      { validators: this.passwordMatchValidator }
    );
  }

  // Validador personalizado para la fortaleza de la contraseña
  passwordStrengthValidator(control: FormControl): { [key: string]: any } | null {
    const password = control.value || '';

    if (control.hasError('minlength')) {
      return null;
    }

    this.checkPasswordStrength(password);
    if (this.passwordStrengthValue < 100) {
      return { weakPassword: true };
    }
    return null;
  }

  // Validador asincrónico para verificar si la contraseña está comprometida
  checkPasswordCompromised(control: AbstractControl): Observable<ValidationErrors | null> {
    const password = control.value;
    if (!password) return of(null);

    return this.pwnedService.checkPassword(password).pipe(
      map((data) => {
        const lines = data.split('\n');
        const hashSuffix = this.pwnedService.sha1(password).substring(5).toUpperCase();
        const isCompromised = lines.some((line) => line.startsWith(hashSuffix));

        if (isCompromised) {
          this.setPasswordStrength('Comprometida', 80, 'warn');
          return { compromised: true };
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  // Método para calcular la fortaleza de la contraseña
  checkPasswordStrength(password: string): void {
    if (!password) {
      this.setPasswordStrength('Muy débil', 0, 'warn');
      return;
    }

    const lengthCondition = password.length >= 8;
    const hasNumber = /[0-9]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (lengthCondition && hasNumber && hasLower && hasUpper && hasSpecialChar) {
      this.setPasswordStrength('Fuerte', 100, 'primary');
    } else if (lengthCondition && hasNumber && (hasLower || hasUpper)) {
      this.setPasswordStrength('Moderada', 60, 'accent');
    } else if (lengthCondition) {
      this.setPasswordStrength('Débil', 40, 'warn');
    } else {
      this.setPasswordStrength('Muy débil', 10, 'warn');
    }
  }

  setPasswordStrength(strength: string, value: number, color: string): void {
    this.passwordStrength = strength;
    this.passwordStrengthValue = value;
    this.passwordStrengthColor = color;
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const newPasswordControl = form.get('password');
    const confirmPasswordControl = form.get('confirmPassword');
  
    if (!newPasswordControl || !confirmPasswordControl) {
      return null; 
    }
  
    const newPassword = newPasswordControl.value;
    const confirmPassword = confirmPasswordControl.value;
  
    if (newPassword !== confirmPassword) {
      confirmPasswordControl.setErrors({ mismatch: true }); 
      return { mismatch: true }; 
    } else {
      if (confirmPasswordControl.hasError('mismatch')) {
        confirmPasswordControl.setErrors(null); 
      }
      return null;
    }
  }

  // Método para manejar el registro
  onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const userData = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'Error en el registro';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
          this.isLoading = false;
        },
      });
    } else {
      this.snackBar.open(
        'Por favor completa todos los campos correctamente.',
        'Cerrar',
        { duration: 3000 }
      );
    }
  }
}