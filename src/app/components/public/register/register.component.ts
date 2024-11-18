import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
import { Observable } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar'; 
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatProgressBarModule,MatChipsModule,MatProgressSpinnerModule,CommonModule,ReactiveFormsModule,MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatIconModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../estilos/spinner.css', '../../estilos/snackbar.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  hide: boolean = true;
  hideConfirm: boolean = true;
  isLoading: boolean = false;
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
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ\s]+$/), Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)], [this.passwordStrengthValidator.bind(this)]],
      confirmPassword: ['', [Validators.required]],
      tipo_usuario: ['cliente'],
      mfa_activado: [false],
    }, { validators: this.passwordMatchValidator });
  }

  get f() {
    return this.registerForm.controls;
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      return null;
    }
  }
  
  checkPasswordStrength(password: string): string {
    let strength = '';
    const lengthCondition = password.length >= 8;
    const hasNumber = /[0-9]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

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

  onPasswordChange(password: string) {
    this.passwordStrength = this.checkPasswordStrength(password); 
  }

  // Función para verificar si la contraseña está comprometida
  validatePasswordStrength(password: string): Observable<string> {
    return new Observable((observer) => {
      this.pwnedService.checkPassword(password).subscribe({
        next: (data) => {
          const lines = data.split('\n');
          const passwordHashSuffix = this.pwnedService.sha1(password).substring(5).toUpperCase();
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
      const password = control.value;
      this.pwnedService.checkPassword(password).subscribe({
        next: (data) => {
          const lines = data.split('\n');
          const passwordHashSuffix = this.pwnedService.sha1(password).substring(5).toUpperCase();
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
  onRegister() {
    this.isLoading = true;
  
    if (this.registerForm.invalid || this.passwordStrengthValue !== 100 || this.registerForm.hasError('mismatch')) {
      this.isLoading = false;
      return;
    }
  
    const { nombre, email, telefono, password, tipo_usuario, mfa_activado } = this.registerForm.value;
  
    this.validatePasswordStrength(password).subscribe((status) => {
      if (status === 'comprometida') {
        this.registerForm.get('password')?.setErrors({ comprometida: true });
  
        this.snackBar.open('Tu contraseña ha sido comprometida, usa una contraseña más segura.', 'Cerrar', {
          duration: 3000
        });
        this.isLoading = false;
      } else if (status === 'segura') {
        this.registerForm.get('password')?.setErrors(null);
  
        this.authService.register({ nombre, email, telefono, password, tipo_usuario, mfa_activado }).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Registro exitoso', 'Cerrar', {
              duration: 3000
            }).afterDismissed().subscribe(() => {
              this.router.navigate(['/login']);
            });
          },
          error: (error) => {
            const errorMessage = error?.error?.message || 'Error en el registro';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
            this.isLoading = false;
          }
        });
      } else {
        this.snackBar.open('Error al verificar la seguridad de la contraseña.', 'Cerrar', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }
  
}  