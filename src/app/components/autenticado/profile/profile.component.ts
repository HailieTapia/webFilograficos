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
import { Observable } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PwnedService } from '../../services/pwned.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatProgressBarModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../estilos/spinner.css', '../../estilos/snackbar.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: {
      calle: '',
      ciudad: '',
      codigo_postal: '',
      estado: ''
    }
  };
  isLoading: boolean = false;
  showModal: boolean = false;
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  hideCurrent: boolean = true;
  hideNew: boolean = true;
  hideConfirm: boolean = true;

  passwordStrength: string = '';
  passwordStrengthValue: number = 0;
  passwordStrengthColor: string = 'warn';
  constructor(private pwnedService: PwnedService, private router: Router, private userService: UserService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }
  //obtener perfil
  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.userProfile = {
          nombre: data?.nombre || '',
          email: data?.email || '',
          telefono: data?.telefono || '',
          direccion: {
            calle: data?.direccion?.calle || '',
            ciudad: data?.direccion?.ciudad || '',
            codigo_postal: data?.direccion?.codigo_postal || '',
            estado: data?.direccion?.estado || ''
          }
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener el perfil del usuario:', error);
        this.isLoading = false;
      }
    });
  }

  //actualziar perfil(nombre, email, telefono)
  updateProfile(form: NgForm): void {
    this.isLoading = true;
    if (form.invalid) {
      this.snackBar.open('Por favor, completa todos los campos requeridos.', 'Cerrar', { duration: 3000 });
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.userService.updateProfile(this.userProfile).subscribe({
      next: (response) => {
        this.isLoading = false;
        const successMessage = response?.message || 'Actualización correctamente';
        this.snackBar.open(successMessage, 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error?.error?.message || 'Error al actualizar';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
      }
    });
  }
  //actualziar direccion(colonia, calle, cp)
  updateAddress(form: NgForm): void {
    if (form.invalid) {
      this.snackBar.open('Por favor, completa todos los campos requeridos en la dirección.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.userService.updateUserProfile(this.userProfile.direccion).subscribe({
      next: (response) => {
        this.isLoading = false;
        const successMessage = response?.message || 'Direccion actualizada correctamente';
        this.snackBar.open(successMessage, 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error?.error?.message || 'Error al actualizar';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
      }
    });
  }
  // Método para eliminar la cuenta del cliente autenticado
  deleteAccount(): void {
    const snackBarRef = this.snackBar.open('¿Estás seguro de que deseas eliminar tu cuenta?', 'Sí', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });

    let actionConfirmed = false;

    snackBarRef.onAction().subscribe(() => {
      this.userService.deleteMyAccount().subscribe({
        next: (response) => {
          this.snackBar.open('Cuenta eliminada correctamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          // Redirigir a la página de inicio de sesión
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar la cuenta', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      });
      actionConfirmed = true;
    });

    snackBarRef.afterDismissed().subscribe(() => {
      if (!actionConfirmed) {
        this.snackBar.open('Eliminación cancelada', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }
  //cambio contra
  onChangePassword(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', { duration: 3000 });
      this.isLoading = false;
      return;
    }
    this.userService.changePassword(this.currentPassword, this.newPassword).subscribe(
      () => {
        this.snackBar.open('Contraseña cambiada exitosamente', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
        this.closeModal();
      },
      (error) => {
        this.isLoading = false;
        const errorMessage = error?.error?.message || 'Error al cambiar la contraseña';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
      }
    );
  }
  openChangePasswordDialog(): void {
    this.showModal = true;
  }
  closeModal(): void {
    this.showModal = false;
    this.resetPasswordFields();
  }
  resetPasswordFields(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }
  onPasswordChange(newPassword: string) {
    this.passwordStrength = this.checkPasswordStrength(newPassword);
  }
  //medidor fortaleza evalua a newPass
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
}
