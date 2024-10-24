import { Component, OnInit } from '@angular/core';
import { IncidenciaService } from '../../services/incidencia.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incidencia',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './incidencia.component.html', // Corregido: Sin corchetes
  styleUrls: ['./incidencia.component.css']
})
export class IncidenciaComponent implements OnInit {
  incidencias: any[] = [];
  errorMessage: string = '';
  newIncidencia: any = {}; // Para almacenar la nueva incidencia

  constructor(private incidenciaService: IncidenciaService) {}

  ngOnInit(): void {
    this.loadUsers();
  }
//imprimio
  loadUsers(): void {
    this.incidenciaService.getAllUsersWithSessions().subscribe(
      users => {
        this.incidencias = users; // Asigna la lista de usuarios recibida a incidencias
        console.log(this.incidencias);
      },
      error => {
        console.error('Error loading users', error);
      }
    );
  }
  
  eliminarUsuario(id: string): void {
    this.incidenciaService.deleteCustomer(id).subscribe(
      response => {
        console.log('Usuario eliminado con éxito:', response);
        this.loadUsers(); // Volver a cargar los usuarios después de eliminar
      },
      error => {
        this.errorMessage = 'Error al eliminar el usuario.';
        console.error(error);
      }
    );
  }

  desbloquearUsuario(id: string): void {
    this.incidenciaService.unlockUser(id).subscribe(
      response => {
        console.log('Usuario desbloqueado con éxito:', response);
        this.loadUsers(); // Volver a cargar los usuarios después de desbloquear
      },
      error => {
        this.errorMessage = 'Error al desbloquear el usuario.';
        console.error(error);
      }
    );
  }

  agregarIncidencia(): void {
    // Implementa la lógica para agregar una nueva incidencia aquí
    console.log('Nueva incidencia:', this.newIncidencia);
  }

}