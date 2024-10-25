import { Component, OnInit } from '@angular/core';
import { IncidenciaService } from '../../services/incidencia.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table'; // Import MatTableDataSource
interface Usuario {
  email: string;
  is_resolved: boolean;
  nombre: string;
  numero_intentos: number;
  tipo_usuario: string; // Esto se añadirá al combinar los datos
  _id: string;
}

interface IntentosFallidosResponse {
  administradores: Usuario[];
  clientes: Usuario[];
}

@Component({
  selector: 'app-incidencia',
  standalone: true,
  imports: [MatTableModule,MatInputModule,MatListModule,FormsModule, CommonModule],
  templateUrl: './incidencia.component.html', 
  styleUrls: ['./incidencia.component.css']
})
export class IncidenciaComponent implements OnInit {
  configDataSource: { parametro: string, valor: any }[] = []; // Para la configuración
  dataSource = new MatTableDataSource(); // Initialize the data source

  constructor(private incidenciaService: IncidenciaService) { }

  ngOnInit(): void {
    this.obtenerIntentosFallidos('dia');
    this.getConfig(); // Obtener configuración existente al iniciar
  }

  obtenerIntentosFallidos(periodo: string): void {
    this.incidenciaService.getFailedLoginAttempts(periodo).subscribe({
      next: (response: IntentosFallidosResponse) => {
        console.log('Intentos fallidos:', response);
  
        // Combinar administradores y clientes en un solo array
        const combinedData: Usuario[] = [
          ...response.administradores.map((admin: Usuario) => ({
            ...admin,
            tipo_usuario: 'administrador'  // Agregar tipo de usuario
          })),
          ...response.clientes.map((cliente: Usuario) => ({
            ...cliente,
            tipo_usuario: 'cliente'  // Agregar tipo de usuario
          }))
        ];
  
        // Asignar los datos combinados a dataSource
        this.dataSource.data = combinedData;
      },
      error: (error) => {
        console.error('Error al obtener intentos fallidos:', error);
      }
    });
  }
  
  
  // Método para actualizar el máximo de intentos fallidos de inicio de sesión
  updateMaxFailedLoginAttempts(maxAttempts: number): void {
    this.incidenciaService.updateMaxFailedLoginAttempts(maxAttempts).subscribe({
      next: (response) => {
        console.log('Máximo de intentos fallidos actualizado:', response);
      },
      error: (error) => {
        console.error('Error al actualizar el máximo de intentos fallidos:', error);
      }
    });
  }
  // Método para actualizar los tiempos de vida de tokens y códigos
  updateTokenLifetime(config: any): void {
    this.incidenciaService.updateTokenLifetime(config).subscribe({
      next: (response) => {
        console.log('Configuración de tiempos de vida actualizada:', response);
      },
      error: (error) => {
        console.error('Error al actualizar tiempos de vida:', error);
      }
    });
  }
  // Método para desbloquear un usuario
  adminUnlockUser(userId: string): void {
    this.incidenciaService.adminUnlockUser(userId).subscribe({
      next: (response) => {
        console.log('Usuario desbloqueado:', response);
      },
      error: (error) => {
        console.error('Error al desbloquear usuario:', error);
      }
    });
  }
  // Método para obtener la configuración existente
  getConfig(): void {
    this.incidenciaService.getConfig().subscribe({
      next: (response) => {
        console.log('Configuración actual:', response.config);
        const config = response.config; // Asegúrate de acceder a la propiedad correcta
        this.configDataSource = [
          { parametro: 'Tiempo de vida del JWT', valor: config.jwt_lifetime },
          { parametro: 'Verificación de correo', valor: config.verificacion_correo_lifetime },
          { parametro: 'Tiempo de vida del OTP', valor: config.otp_lifetime },
          { parametro: 'Tiempo de vida de la sesión', valor: config.sesion_lifetime },
          { parametro: 'Tiempo de vida de cookies', valor: config.cookie_lifetime },
          { parametro: 'Umbral de expiración', valor: config.expirationThreshold_lifetime },
          { parametro: 'Máximo intentos fallidos', valor: config.maximo_intentos_fallidos_login },
          { parametro: 'Máximo bloqueos en días', valor: config.maximo_bloqueos_en_n_dias },
          { parametro: 'Días de bloqueo', valor: config.dias_periodo_de_bloqueo }
        ];
      },
      error: (error) => {
        console.error('Error al obtener configuración:', error);
      }
    });}
}