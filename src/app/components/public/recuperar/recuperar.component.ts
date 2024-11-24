import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of, catchError } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PwnedService } from '../../services/pwned.service';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [MatProgressBarModule, MatIconModule, MatCardModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css'],
})
export class RecuperarComponent {
  recoveryStep = 0;
  emailForm: FormGroup;
  tokenForm: FormGroup;
  passwordForm: FormGroup;

  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  passwordStrength: string = '';
  passwordStrengthValue: number = 0;
  passwordStrengthColor: string = 'warn';

  otpArray = ['digit1', 'digit2', 'digit3', 'digit4', 'digit5', 'digit6', 'digit7', 'digit8'];
  constructor(private pwnedService: PwnedService, private fb: FormBuilder, private snackBar: MatSnackBar, private authService: AuthService, private router: Router) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.tokenForm = this.fb.group({
      digit1: ['', Validators.required],
      digit2: ['', Validators.required],
      digit3: ['', Validators.required],
      digit4: ['', Validators.required],
      digit5: ['', Validators.required],
      digit6: ['', Validators.required],
      digit7: ['', Validators.required],
      digit8: ['', Validators.required],
    });
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, this.passwordStrengthValidator.bind(this),], [this.checkPasswordCompromised.bind(this)],],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }
  // Validador personalizado para la fortaleza de la contraseña
  passwordStrengthValidator(control: FormControl): { [key: string]: any } | null {
    const newPassword = control.value || '';

    if (control.hasError('minlength')) {
      return null;
    }

    this.checkPasswordStrength(newPassword);
    if (this.passwordStrengthValue < 100) {
      return { weakPassword: true };
    }
    return null;
  }

  // Validador asincrónico para verificar si la contraseña está comprometida
  checkPasswordCompromised(control: AbstractControl): Observable<ValidationErrors | null> {
    const newPassword = control.value;
    if (!newPassword) return of(null);

    return this.pwnedService.checkPassword(newPassword).pipe(
      map((data) => {
        const lines = data.split('\n');
        const hashSuffix = this.pwnedService.sha1(newPassword).substring(5).toUpperCase();
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
  checkPasswordStrength(newPassword: string): void {
    if (!newPassword) {
      this.setPasswordStrength('Muy débil', 0, 'warn');
      return;
    }

    const lengthCondition = newPassword.length >= 8;
    const hasNumber = /[0-9]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

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
  //COINCIDEN
  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const newPasswordControl = form.get('newPassword');
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

  moveToNext(index: number, event: any) {
    const inputValue = event.target.value;
    if (inputValue && index < this.otpArray.length - 1) {
      const nextElement = document.querySelectorAll('input')[index + 1];
      if (nextElement) {
        (nextElement as HTMLElement).focus();
      }
    }
  }
  // Enviando el token al correo electrónico
  sendToken() {
    if (this.emailForm.valid) {
      this.authService.recu(this.emailForm.value).subscribe({
        next: () => {
          this.snackBar.open('Se ha enviado un token de recuperación a tu correo, valido por 5 minutos', 'Cerrar', { duration: 3000 });
          this.recoveryStep = 1;
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'Error al iniciar recuperación';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
        },
      });
    }
  }

  // Verificación del token
  verifyToken() {
    if (this.tokenForm.valid) {
      const otp = this.otpArray.map(control => this.tokenForm.get(control)?.value).join('');
      const email = this.emailForm.value.email;
      const credentials = { email, otp };
      this.authService.verOTP(credentials).subscribe({
        next: () => {
          this.snackBar.open('Verificación con éxito', 'Cerrar', { duration: 3000 });
          this.recoveryStep = 2;
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'El OTP ingresado es incorrecto o ha expirado.';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
        },
      });
    }
    else {
      this.snackBar.open(
        'Por favor, ingresa el OTP recibido en tu correo.',
        'Cerrar',
        { duration: 3000 }
      );
    }
  }
  //Cambio contra
  updatePassword() {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.value.newPassword;
      const email = this.emailForm.value.email;
      const credentials = { email, newPassword };
      this.authService.resContra(credentials).subscribe({
        next: () => {
          this.snackBar.open('Tu contraseña ha sido actualizada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'Error al restablecer la contraseña';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
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