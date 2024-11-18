import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PwnedService } from '../../services/pwned.service';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [MatProgressBarModule, MatIconModule, MatCardModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css'],
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
export class RecuperarComponent {
  recoveryStep = 0;
  emailForm: FormGroup;
  tokenForm: FormGroup;
  passwordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
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
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      return null;
    }
  }
  checkPasswordStrength(newPassword: string): string {
    let strength = '';
    const lengthCondition = newPassword.length >= 8;
    const hasNumber = /[0-9]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (lengthCondition && hasNumber && hasLower && hasUpper && hasSpecialChar) {
      strength = 'Fuerte';
      this.passwordStrengthValue = 100;
      this.passwordStrengthColor = 'primary';
    } else if (lengthCondition && hasNumber && (hasLower || hasUpper)) {
      strength = 'Moderada';
      this.passwordStrengthValue = 70;
      this.passwordStrengthColor = 'accent';
    } else if (lengthCondition) {
      strength = 'Débil';
      this.passwordStrengthValue = 40;
      this.passwordStrengthColor = 'warn';
    } else {
      strength = 'Muy débil';
      this.passwordStrengthValue = 10;
      this.passwordStrengthColor = 'warn';
    }

    return strength;
  }
  onPasswordChange(newPassword: string) {
    this.passwordStrength = this.checkPasswordStrength(newPassword);
  }
  // Función para verificar si la contraseña está comprometida
  validatePasswordStrength(newPassword: string): Observable<string> {
    return new Observable((observer) => {
      this.pwnedService.checkPassword(newPassword).subscribe({
        next: (data) => {
          const lines = data.split('\n');
          const passwordHashSuffix = this.pwnedService.sha1(newPassword).substring(5).toUpperCase();
          const match = lines.find(line => line.startsWith(passwordHashSuffix));

          if (match) {
            observer.next('comprometida');
          } else {
            observer.next('segura');
          }
        },
        error: () => {
          observer.next('error');
        }
      });
    });
  }
  passwordStrengthValidator(control: AbstractControl): Observable<{ [key: string]: boolean } | null> {
    return new Observable((observer) => {
      const newPassword = control.value;
      this.pwnedService.checkPassword(newPassword).subscribe({
        next: (data) => {
          const lines = data.split('\n');
          const passwordHashSuffix = this.pwnedService.sha1(newPassword).substring(5).toUpperCase();
          const match = lines.find(line => line.startsWith(passwordHashSuffix));

          if (match) {
            observer.next({ comprometida: true });
          } else {
            observer.next(null);
          }
        },
        error: () => {
          observer.next(null);
        }
      });
    });
  }
  showAlert(message: string | null) {
    if (message) {
      this.snackBar.open(message, 'Cerrar', {
        duration: 3000,
      });
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
    this.successMessage = '';
    this.errorMessage = '';
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email;
      this.authService.recu({ email }).subscribe({
        next: (response) => {
          console.log(`Enviando token a ${email}`);
          this.successMessage = 'Se ha enviado un token de recuperación a tu correo, valido por 5 minutos .';
          this.showAlert(this.successMessage);
          this.errorMessage = '';
          this.recoveryStep = 1;
        },
        error: (error) => {
          this.errorMessage = 'Error al enviar el token. Verifica tu correo e inténtalo de nuevo.';
          this.showAlert(this.errorMessage);
          this.successMessage = '';
          console.error(error);
        }
      });
    } else {
      this.errorMessage = 'Por favor, ingresa un correo válido.';
      this.showAlert(this.errorMessage);
    }
  }
  // Verificación del token
  verifyToken() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.tokenForm.valid) {
      // Combina los dígitos del OTP en una sola cadena
      const otp = this.otpArray.map(control => this.tokenForm.get(control)?.value).join('');
      const email = this.emailForm.value.email;

      this.authService.verOTP({ email, otp }).subscribe({
        next: (response) => {
          this.successMessage = 'Verificación con éxito.';
          this.showAlert(this.successMessage);
          this.errorMessage = response.message; // O ajusta según la respuesta real
          this.recoveryStep = 2;
        },
        error: (error) => {
          this.errorMessage = 'Error al verificar el OTP. Por favor, inténtalo nuevamente.';
          this.showAlert(this.errorMessage);
          this.successMessage = '';
          console.error(error);
        }
      });
    } else {
      this.errorMessage = 'Por favor, ingresa el OTP recibido en tu correo.';
      this.showAlert(this.errorMessage);
    }
  }

  updatePassword() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.value.newPassword;
      const confirmPassword = this.passwordForm.value.confirmPassword;
      const email = this.emailForm.value.email;
      if (newPassword !== confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        this.showAlert(this.errorMessage);
        return;
      }

      this.authService.resContra({ email, newPassword }).subscribe({
        next: (response) => {
          this.successMessage = 'Contraseña actualizada con éxito.';
          this.showAlert(this.successMessage);
          this.errorMessage = '';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = 'Error al actualizar la contraseña. Por favor, inténtalo de nuevo.';
          this.showAlert(this.errorMessage);
          this.successMessage = '';
          console.error(error);
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa los campos de manera válida.';
      this.showAlert(this.errorMessage);
    }
  }
}
