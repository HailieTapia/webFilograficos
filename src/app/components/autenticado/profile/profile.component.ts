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
import { Observable } from 'rxjs';
import { AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatProgressBarModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule, CommonModule, FormsModule],
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
  constructor(private pwnedService: PwnedService, private router: Router, private userService: UserService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getProfile();
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
            ciudad: data?.direccion?.ciudad || '',
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
    const updatedData = {
      nombre: this.profile.nombre,
      email: this.profile.email,
      telefono: this.profile.telefono,
    };

    this.userService.updateProfile(updatedData).subscribe({
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
  // Método para actualizar la dirección del usuario
  updateUserDireccion(): void {
    this.isLoading = true;
    const updatedDireccion = {
      calle: this.profile.direccion.calle,
      ciudad: this.profile.direccion.ciudad,
      estado: this.profile.direccion.estado,
      codigo_postal: this.profile.direccion.codigo_postal,
    };

    this.userService.updateUserProfile(updatedDireccion).subscribe({
      next: (updatedDireccion) => {
        this.isLoading = false;
        this.profile.direccion = updatedDireccion;
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
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  // Método para cambiar la contraseña
  changePassword(): void {
    this.userService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (response) => {
        this.snackBar.open('Contraseña cambiada con éxito', 'Cerrar', { duration: 3000 });
        this.closeModal();
      },
      error: (error) => {
        const errorMessage = error?.error?.message || 'Error al cambiar la contraseña';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
      }
    });
  }
  //Barra progreso
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
}
