import { Component, OnInit } from '@angular/core';
import { IncidenciaService } from '../../services/incidencia.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-incidencia',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './incidencia.component.html',
  styleUrls: ['./incidencia.component.css'], // Cambiado a styleUrls
})
export class IncidenciaComponent implements OnInit {
  incidencias: any[] = [];
  errorMessage: string = '';
  newIncidencia: any = {}; // Para almacenar la nueva incidencia

  constructor(private incidenciaService: IncidenciaService) { }

  ngOnInit(): void {
    this.getIncidencias();
  }

  // Obtener todas las incidencias
  getIncidencias(): void {
    this.incidenciaService.getIncidencias().subscribe(
      (data) => {
        this.incidencias = data; // Asignar las incidencias obtenidas
      },
      (error) => {
        this.errorMessage = 'Error al obtener las incidencias.';
      }
    );
  }

  // Crear nueva incidencia
  createIncidencia(): void {
    this.incidenciaService.createIncidencia(this.newIncidencia).subscribe(
      (response) => {
        this.getIncidencias(); // Actualizar la lista después de crear
        this.newIncidencia = {}; // Limpiar el formulario
      },
      (error) => {
        this.errorMessage = 'Error al crear la incidencia.';
      }
    );
  }

  // Actualizar incidencia
  updateIncidencia(id: string, updatedData: any): void {
    this.incidenciaService.updateIncidencia(id, updatedData).subscribe(
      (response) => {
        this.getIncidencias(); // Actualizar la lista después de actualizar
      },
      (error) => {
        this.errorMessage = 'Error al actualizar la incidencia.';
      }
    );
  }

  // Eliminar incidencia
  deleteIncidencia(id: string): void {
    this.incidenciaService.deleteIncidencia(id).subscribe(
      (response) => {
        this.getIncidencias(); // Actualizar la lista después de eliminar
      },
      (error) => {
        this.errorMessage = 'Error al eliminar la incidencia.';
      }
    );
  }
}
