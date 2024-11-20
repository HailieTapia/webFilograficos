import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl,ValidationErrors,FormControl,ReactiveFormsModule } from '@angular/forms';
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
import { Observable, of,catchError } from 'rxjs';
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
      nombre: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ])[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ\s]*$/), Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator.bind(this)], [this.checkPasswordCompromised.bind(this)]],
      confirmPassword: ['', [Validators.required]],
      tipo_usuario: ['cliente'],
      mfa_activado: [false],
    }, { validators: this.passwordMatchValidator });    
  }
  // Validador asincrónico para verificar si la contraseña está comprometida
checkPasswordCompromised(control: AbstractControl): Observable<ValidationErrors | null> {
  const password = control.value;
  if (!password) {
    return of(null); // No hay error si el campo está vacío
  }

  return this.validatePasswordStrength(password).pipe(
    map((status: string) => {
      if (status === 'comprometida') {
        control.setErrors({ compromised: true });
        return { compromised: true };
      }
      return null;
    }),
    catchError(() => {
      control.setErrors({ compromisedError: true }); // Manejo de errores
      return of(null);
    })
  );
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

  // Validador personalizado para la fortaleza de la contraseña
  passwordStrengthValidator(control: FormControl): { [key: string]: any } | null {
    const password = control.value || '';
    this.checkPasswordStrength(password); 

    if (this.passwordStrengthValue < 100) {
      return { weakPassword: true }; 
    }
    return null;
  }
  //Barra progreso
  checkPasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 'Muy débil';
      this.passwordStrengthValue = 0;
      this.passwordStrengthColor = 'warn';
      return;
    }
  
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
  
    this.passwordStrength = strength;
  }
  
  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value || '';
    const confirmPassword = form.get('confirmPassword')?.value || '';

    if (!confirmPassword) {
      form.get('confirmPassword')?.setErrors({ required: true });
      return { required: true };
    }

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  // Método para manejar el registro
  onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const userData = this.registerForm.value;

      this.authService.register(userData).subscribe({
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
      this.snackBar.open('Por favor completa todos los campos correctamente.', 'Cerrar', {
        duration: 3000
      });
      this.isLoading = false;
    }
  }
}

