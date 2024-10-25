import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/user.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIconModule, MatInputModule, MatCardModule, MatFormFieldModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
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
export class ProfileComponent implements OnInit {
  user: Usuario | null = null;
  updateData: Usuario = {
    nombre: '',
    email: '',
    direccion: {
      calle: '',
      ciudad: '',
      estado: '',
      codigo_postal: '',
    },
    telefono: '',
  };

  showModal: boolean = false;
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  hideCurrent: boolean = true;
  hideNew: boolean = true;
  hideConfirm: boolean = true;
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar, private router: Router) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }
  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmNewPassword')?.value
      ? null : { mismatch: true };
  }
  showAlert(message: string | null) {
    if (message) {
      this.snackBar.open(message, 'Cerrar', {
        duration: 3000,
      });
    }
  }
  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.authService.getProfile().subscribe(
      (response: Usuario) => {
        this.user = response;
        if (this.user) {
          this.updateData = {
            nombre: this.user.nombre,
            email: this.user.email,
            direccion: {
              calle: this.user.direccion?.calle || '',
              ciudad: this.user.direccion?.ciudad || '',
              estado: this.user.direccion?.estado || '',
              codigo_postal: this.user.direccion?.codigo_postal || '',
            },
            telefono: this.user.telefono,
          };
        }
      },
      (error) => {
        this.errorMessage = 'Error al cargar perfil:';
        this.showAlert(this.errorMessage);
      }
    );
  }

  updateProfile() {
    this.authService.updateProfile(this.updateData).subscribe(
      (response) => {
        this.successMessage = 'Perfil actualizado exitosamente';
        this.showAlert(this.successMessage);
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.authService.currentUserSubject.next(response);
        this.loadUserProfile();
      },
      (error) => {
        this.errorMessage = 'Error al actualizar el perfil';
        this.showAlert(this.errorMessage);
      }
    );
  }

  deleteAccount() {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta?')) {
      this.authService.deleteAccount().subscribe(
        (response) => {
          this.successMessage = 'Cuenta eliminada exitosamente';
          this.showAlert(this.successMessage);
          this.router.navigate(['/login']);
        },
        (error) => {
          this.errorMessage = 'Error al eliminar la cuenta';
          this.showAlert(this.errorMessage);
        }
      );
    }
  }

  onChangePassword(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      this.showAlert(this.errorMessage);
      return;
    }
    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe(
      () => {
        this.successMessage = 'Contraseña cambiada exitosamente.';
        this.showAlert(this.successMessage);
        this.errorMessage = null;
        this.closeModal();
      },
      () => {
        this.errorMessage = 'Error al cambiar la contraseña. Inténtalo de nuevo.';
        this.successMessage = null;
        this.showAlert(this.errorMessage);
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
    this.errorMessage = null;
    this.successMessage = null;
  }
}
