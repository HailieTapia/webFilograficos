import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresaService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [MatTooltipModule,MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatInputModule, MatFormFieldModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css','../../estilos/tablas.css',  '../../estilos/botonesIcon.css','../../estilos/spinner.css', '../../estilos/snackbar.css']
})
export class EmpresaComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  company: any = {
    direccion: {
      calle: '',
      ciudad: '',
      estado: '',
      codigo_postal: '',
      pais: ''
    },
    telefono: {
      numero: '',
      extension: ''
    },
    redes_sociales: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: ''
    },
    nombre: '',
    email: '',
    slogan: '',
    logo: ''
  };
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private empresaService: EmpresaService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getCompanyInfo();
  }
  // Obtener la información de la empresa
  getCompanyInfo(): void {
    this.isLoading = true;
    this.empresaService.getCompanyInfo().subscribe({
      next: (data) => {
        if (data && data.company) {
          this.company = data.company;
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error?.error?.message || 'Error al actualizar';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
  // Método para actualizar 
  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.isLoading = true;
      this.empresaService.updateCompanyInfo(this.company).subscribe({
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
    } else {
      this.snackBar.open('Formulario inválido', 'Cerrar', { duration: 3000 });
    }
  }
  // Método para eliminar enlaces de redes sociales
  deleteSocialMediaLink(redSocial: string): void {
    this.isLoading = true;
    const redesSocialesToDelete = {
      [redSocial]: true
    };
    this.empresaService.deleteSocialMediaLinks(redesSocialesToDelete).subscribe({
      next: (response) => {
        this.snackBar.open('Enlace de red social eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.company.redes_sociales[redSocial] = '';
        this.isLoading = false;
      },
      error: (error) => {
        const errorMessage = error?.error?.message || 'Error al eliminar el enlace';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}