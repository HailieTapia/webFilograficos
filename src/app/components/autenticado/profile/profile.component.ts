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
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule,MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule, CommonModule, FormsModule],
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
  constructor(private router: Router, private userService: UserService, private snackBar: MatSnackBar) { }

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
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.')) {
      this.userService.deleteMyAccount().subscribe({
        next: (response) => {
          alert('Cuenta eliminada correctamente');
          // Redirigir a la página de inicio de sesión o página principal
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error?.error?.message || 'Error al eliminar la cuenta';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
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
      () => {
        this.snackBar.open('Error al cambiar la contraseña', 'Cerrar', { duration: 3000 });
        this.isLoading = false;

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
}
