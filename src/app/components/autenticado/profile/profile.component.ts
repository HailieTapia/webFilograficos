import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any; // Para almacenar la información del usuario
  error: string | null = null; // Para manejar errores

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage

    this.http.get('/api/profile', { // Ajusta la URL según sea necesario
      headers: {
        Authorization: `Bearer ${token}` // Suponiendo que usas un token JWT
      }
    }).subscribe(
      (data: any) => {
        this.user = data; // Guardar la información del usuario en el estado
      },
      (error) => {
        this.error = error.error.message || 'Error al obtener el perfil';
      }
    );
  }
}
