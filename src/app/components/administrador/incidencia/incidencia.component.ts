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
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-incidencia',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatButtonToggleModule, MatTableModule, MatInputModule, FormsModule],
  templateUrl: './incidencia.component.html',
  styleUrls: ['./incidencia.component.css', '../../estilos/spinner.css', '../../estilos/tablas.css', '../../estilos/snackbar.css']
})
export class IncidenciaComponent implements OnInit {
  config: any = {};
  isLoading: boolean = false;

  errorMessage: string = '';
  failedLoginAttempts: any[] = [];
  failedLoginDataSource = new MatTableDataSource<any>();
  displayedColumnsFailedLogin: string[] = ['nombre', 'email', 'estado', 'numero_intentos', 'tipo_usuario', 'fecha', 'acciones'];
  selectedPeriodo: string = 'dia';
  configForm: FormGroup;

  constructor(private fb: FormBuilder, private incidenciaService: IncidenciaService, private snackBar: MatSnackBar
  ) {
    this.configForm = this.fb.group({
      jwt_lifetime: ['', [Validators.required, Validators.min(300), Validators.max(2592000)]],
      verificacion_correo_lifetime: ['', [Validators.required, Validators.min(300), Validators.max(2592000)]],
      otp_lifetime: ['', [Validators.required, Validators.min(60), Validators.max(1800)]],
      sesion_lifetime: ['', [Validators.required, Validators.min(300), Validators.max(2592000)]],
      cookie_lifetime: ['', [Validators.required, Validators.min(300), Validators.max(2592000)]],
      dias_periodo_de_bloqueo: ['', [Validators.required, Validators.min(1), Validators.max(365)]],
      maximo_bloqueos_en_n_dias: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      maximo_intentos_fallidos_login: ['', [Validators.required, Validators.min(3), Validators.max(10)]],
      expirationThreshold_lifetime: ['', [Validators.required, Validators.min(60), Validators.max(1800)]],
    });
  }

  ngOnInit(): void {
    this.getConfigData();
    this.getFailedLoginAttempts(this.selectedPeriodo);
  }
//obtener los datos 
  getConfigData(): void {
    this.incidenciaService.getConfig().subscribe({
      next: (data) => {
        if (data && data.config) {
          this.config = data.config;
        } else {
          this.snackBar.open('Error al obtener la configuración');
        }
      },
      error: (error) => {
        const errorMessage = error?.error?.message || 'Error al obtener la configuración';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Método para actualizar 
  updateConfig(): void {
    if (this.configForm.valid) {
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
          this.getFailedLoginAttempts(this.selectedPeriodo);
        },
        error: (error) => {
          this.snackBar.open('Error al desbloquear al usuario', 'Cerrar', {
            duration: 3000
          });
        }
      });
      actionConfirmed = true;
    });

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