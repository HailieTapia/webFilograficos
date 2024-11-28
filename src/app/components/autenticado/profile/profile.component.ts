import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PwnedService } from '../../services/pwned.service';
import { Observable, of, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import { noXSSValidator } from '../../shared/validators';
import { CopomexService } from '../../services/compomex.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatOptionModule, MatSelectModule, MatProgressBarModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule, MatProgressSpinnerModule, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../estilos/spinner.css', '../../estilos/snackbar.css']
})
export class ProfileComponent implements OnInit {
  profile: any;
  isLoading = true;
  errorMessage: string | null = null;

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showModal: boolean = false;
  hideCurrentPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  passwordStrength: string = '';
  passwordStrengthValue: number = 0;
  passwordStrengthColor: string = 'warn';

  PerfilForm: FormGroup;
  addressForm: FormGroup;
  passwordForm: FormGroup;

  estados: any[] = [];
  cp: string[] = [];
  selectedEstado: string = '';
  selectedCp: string = '';

  constructor(private copomexService: CopomexService,
    private fb: FormBuilder,
    private userService: UserService,
    private pwnedService: PwnedService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.PerfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^(?! )[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ]+)*$/), Validators.minLength(3), Validators.maxLength(50), noXSSValidator()]],
      email: [''],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/), noXSSValidator()]],
    });
    this.addressForm = this.fb.group({
      calle: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ0-9,.:]+( [a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ0-9,.:]+)*$/), Validators.minLength(3), Validators.maxLength(100), noXSSValidator()]],
      codigo_postal: ['',[Validators.required]],
      estado: ['',[Validators.required]],
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8), noXSSValidator()]],
      newPassword: ['', [Validators.required, this.passwordStrengthValidator.bind(this), noXSSValidator()], [this.checkPasswordCompromised.bind(this)]],
      confirmPassword: ['', [Validators.required, noXSSValidator()]],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.getProfile();
    this.loadEstados();
    this.loadCpPorEstado(this.selectedEstado);
  }
  // Cargar los códigos postales según el estado seleccionado
  loadCpPorEstado(estado: string): void {
    if (!estado) {
      this.cp = [];
      return;
    }

    this.copomexService.getCpPorEstado(estado).subscribe({
      next: (response) => {
        this.cp = response.response.cp;
      },
      error: (err) => {
        console.error('Error al cargar códigos postales:', err);
      },
    });
  }
  // Cargar la lista de estados desde el servicio
  loadEstados(): void {
    this.copomexService.getEstados().subscribe({
      next: (response) => {
        this.estados = response.response.estado;
      },
      error: (err) => {
        console.error('Error al cargar estados:', err);
      },
    });
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

  // Método para cambiar la contraseña
  changePassword(): void {
    if (this.passwordForm.valid) {
      const currentPassword = this.passwordForm.value.currentPassword;
      const newPassword = this.passwordForm.value.newPassword;

      const credentials = { currentPassword, newPassword };
      this.userService.changePassword(credentials).subscribe({
        next: (response) => {
          this.snackBar.open('Contraseña cambiada con éxito', 'Cerrar', { duration: 3000 });
          this.closeModal();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.resetPasswordFields();
          const errorMessage = error?.error?.message || 'Error al cambiar la contraseña';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  // Llama al servicio para obtener el perfil
  getProfile(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.profile = {
          nombre: data?.nombre || '',
          email: data?.email || '',
          telefono: data?.telefono || '',
          direccion: {
            calle: data?.direccion?.calle || '',
            estado: data?.direccion?.estado || '',
            codigo_postal: data?.direccion?.codigo_postal || '',
          },
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener el perfil';
        this.isLoading = false;
        console.error(error);
      },
    });
  }
  // Método para actualizar el perfil
  updateUserProfile(): void {
    this.isLoading = true;
    if (this.PerfilForm.valid) {
      const nombre = this.PerfilForm.value.nombre;
      const email = this.PerfilForm.value.email;
      const telefono = this.PerfilForm.value.telefono;

      const credentials = { nombre, email, telefono };
      this.userService.updateProfile(credentials).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Perfil actualizado con éxito', 'Cerrar', { duration: 3000 });
          this.getProfile();
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error?.error?.message || 'Error al actualizar el perfil';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
  // Método para actualizar la dirección del usuario
  updateUserDireccion(): void {
    this.isLoading = true;
    if (this.addressForm.valid) {
      const calle = this.addressForm.value.calle;
      const codigo_postal = this.addressForm.value.codigo_postal;
      const estado = this.addressForm.value.estado;

      const credentials = { calle, codigo_postal, estado };
      this.userService.updateUserProfile(credentials).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Dirección actualizada con éxito', 'Cerrar', { duration: 3000 });
          this.getProfile();
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error?.error?.message || 'Error al actualizar la dirección';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
  // Método para eliminar la cuenta del usuario
  deleteAccount(): void {
    const snackBarRef = this.snackBar.open('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.', 'Sí', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });

    let actionConfirmed = false;
    snackBarRef.onAction().subscribe(() => {
      this.userService.deleteMyAccount().subscribe({
        next: () => {
          this.snackBar.open('Cuenta eliminada con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'Error al eliminar la cuenta';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
        }
      });
      actionConfirmed = true;
    });
    snackBarRef.afterDismissed().subscribe(() => {
      if (!actionConfirmed) {
        this.snackBar.open('Eliminación cancelada', 'Cerrar', { duration: 3000 });
      }
    });
  }
  //modal
  openChangePasswordDialog(): void {
    this.showModal = true;
  }
  closeModal(): void {
    this.showModal = false;
    this.resetPasswordFields();
  }
  resetPasswordFields(): void {
    this.passwordForm.reset();
    this.passwordStrength = '';
    this.passwordStrengthValue = 0;
    this.passwordStrengthColor = 'warn';
  }
}
