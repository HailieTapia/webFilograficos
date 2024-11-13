import { Component, OnInit } from '@angular/core';
import { IncidenciaService } from '../../services/incidencia.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-incidencia',
  standalone: true,
  imports: [CommonModule,MatCardModule,MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatButtonToggleModule, MatTableModule, MatInputModule, FormsModule],
  templateUrl: './incidencia.component.html',
  styleUrls: ['./incidencia.component.css', '../../estilos/spinner.css', '../../estilos/tablas.css', '../../estilos/snackbar.css']
})
export class IncidenciaComponent implements OnInit {
  config: any = {}; 
  errorMessage: string = '';
  isLoading: boolean = false;
  failedLoginAttempts: any[] = [];
  failedLoginDataSource = new MatTableDataSource<any>();
  displayedColumnsFailedLogin: string[] = ['nombre', 'email', 'estado', 'numero_intentos', 'tipo_usuario', 'fecha', 'acciones'];
  selectedPeriodo: string = 'dia';
  constructor(private incidenciaService: IncidenciaService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getConfigData();
    this.getFailedLoginAttempts(this.selectedPeriodo);
  }

  // Obtener la configuración
  getConfigData(): void {
    this.incidenciaService.getConfig().subscribe({
      next: (data) => {
        if (data && data.config) {
          this.config = data.config;
        } else {
          console.error('La respuesta no contiene la propiedad config');
        }
      },
      error: (error) => {
        console.error('Error al obtener la configuración', error);
      }
    });
  }
  // Método para actualizar 
  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.isLoading = true; 
      this.incidenciaService.updateTokenLifetime(this.config).subscribe({
        next: (response) => {
          this.isLoading = false;
          const successMessage = response?.message || 'Configuración actualizada correctamente';
          this.snackBar.open(successMessage, 'Cerrar', { duration: 3000 });
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error?.error?.message || 'Error al actualizar la configuración';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
          console.error('Error al actualizar la configuración', error);
        }
      });
    } else {
      this.snackBar.open('Formulario inválido', 'Cerrar', { duration: 3000 });
    }
  }
  // Método para desbloquear un usuario
  adminUnlockUser(userId: string): void {
    if (!userId) {
      console.error('El ID de usuario no se ha proporcionado correctamente');
      return;
    }
    const snackBarRef = this.snackBar.open('¿Estás seguro de que quieres desbloquear a este usuario?', 'Sí', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
    let actionConfirmed = false;
  
    // Suscribirse a la acción "Sí" del snackBar
    snackBarRef.onAction().subscribe(() => {
      this.incidenciaService.adminUnlockUser(userId).subscribe({
        next: (response) => {
          this.snackBar.open('Usuario desbloqueado exitosamente', 'Cerrar', {
            duration: 3000
          });
          // Aquí puedes actualizar la lista de usuarios o realizar cualquier otra acción
        },
        error: (error) => {
          this.snackBar.open('Error al desbloquear al usuario', 'Cerrar', {
            duration: 3000
          });
        }
      });
      actionConfirmed = true;
    });
  
    // Si el usuario no confirma, se muestra un mensaje de cancelación
    snackBarRef.afterDismissed().subscribe(() => {
      if (!actionConfirmed) {
        this.snackBar.open('Desbloqueo cancelado', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
  onPeriodoChange(): void {
    this.getFailedLoginAttempts(this.selectedPeriodo);
  }
  // Obtener los intentos fallidos de inicio de sesión
  getFailedLoginAttempts(periodo: string): void {
    this.isLoading = true;
    this.incidenciaService.getFailedLoginAttempts(periodo).subscribe(
      (data) => {
        const combinedData = [...data.clientes, ...data.administradores];
        this.failedLoginAttempts = combinedData;
        this.failedLoginDataSource.data = this.failedLoginAttempts;
        this.isLoading = false;
      },
      (error) => {
        const errorMessage = error?.error?.message || 'Error al obtener intentos fallidos';
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'center',
        });
        this.errorMessage = 'No se pudieron obtener los intentos fallidos';
        this.isLoading = false;
      }
    );
  }
}