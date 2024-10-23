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
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatInputModule, MatCardModule,MatFormFieldModule,MatButtonModule,CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: Usuario | null = null; // Usar la interfaz Usuario
  updateData: Usuario = {
    nombre: '',
    email: '', // Agregar email aquí
    direccion: {
      calle: '',
      ciudad: '',
      estado: '',
      codigo_postal: '',
    },
    telefono: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.authService.getProfile().subscribe(
      (response: Usuario) => {
        this.user = response;

        // Asegúrate de inicializar updateData solo si user tiene un valor
        if (this.user) {
          this.updateData = {
            nombre: this.user.nombre,
            email: this.user.email, // Asegúrate de incluir el email
            direccion: {
              calle: this.user.direccion?.calle || '', // Manejo seguro
              ciudad: this.user.direccion?.ciudad || '',
              estado: this.user.direccion?.estado || '',
              codigo_postal: this.user.direccion?.codigo_postal || '',
            },
            telefono: this.user.telefono,
          };
        }
      },
      (error) => {
        console.error('Error al cargar el perfil:', error);
      }
    );
  }
  
  updateProfile() {
    this.authService.updateProfile(this.updateData).subscribe(
      (response) => {
        alert('Perfil actualizado exitosamente');
        this.loadUserProfile(); // Recargar el perfil actualizado
      },
      (error) => {
        console.error('Error al actualizar el perfil:', error);
      }
    );
  }

  deleteAccount() {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta?')) {
      this.authService.deleteAccount().subscribe(
        (response) => {
          alert('Cuenta eliminada exitosamente');
          // Redirigir o realizar otra acción
          this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
        },
        (error) => {
          console.error('Error al eliminar la cuenta:', error);
        }
      );
    }
  }
}
