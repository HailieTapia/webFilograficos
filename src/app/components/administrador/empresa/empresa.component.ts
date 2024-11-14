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
  imports: [MatTooltipModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatInputModule, MatFormFieldModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css', '../../estilos/tablas.css', '../../estilos/botonesIcon.css', '../../estilos/spinner.css', '../../estilos/snackbar.css']
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

  // Nueva propiedad para almacenar el archivo seleccionado
  selectedLogoFile: File | null = null;
  logoPreview: string | ArrayBuffer | null = null; // Para vista previa

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
          // Si ya hay un logo, establecer la vista previa
          if (this.company.logo) {
            this.logoPreview = this.company.logo; // Asumiendo que 'logo' es una URL
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error?.error?.message || 'Error al obteneción de datos';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Método para simular el clic en el input de archivo
  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }
  
  // Método para manejar la selección del archivo
  onLogoSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validar el tamaño (2MB máximo)
      const maxSizeInMB = 2;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        this.snackBar.open(`El archivo excede el tamaño máximo de ${maxSizeInMB}MB.`, 'Cerrar', { duration: 3000 });
        return;
      }

      // Validar el tipo de archivo (imagen)
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        this.snackBar.open('Solo se permiten archivos de imagen (JPEG, PNG, GIF).', 'Cerrar', { duration: 3000 });
        return;
      }

      this.selectedLogoFile = file;

      // Mostrar una vista previa del logo
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para actualizar la información de la empresa
  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.isLoading = true;

      const formData = new FormData();

      // Añadir todos los campos de la empresa al FormData
      formData.append('nombre', this.company.nombre);
      formData.append('email', this.company.email);
      formData.append('slogan', this.company.slogan);
      
      // Dirección
      formData.append('direccion[calle]', this.company.direccion.calle);
      formData.append('direccion[ciudad]', this.company.direccion.ciudad);
      formData.append('direccion[estado]', this.company.direccion.estado);
      formData.append('direccion[codigo_postal]', this.company.direccion.codigo_postal);
      formData.append('direccion[pais]', this.company.direccion.pais);
      
      // Teléfono
      formData.append('telefono[numero]', this.company.telefono.numero);
      formData.append('telefono[extension]', this.company.telefono.extension || '');

      // Redes Sociales
      formData.append('redes_sociales[facebook]', this.company.redes_sociales.facebook || '');
      formData.append('redes_sociales[instagram]', this.company.redes_sociales.instagram || '');
      formData.append('redes_sociales[linkedin]', this.company.redes_sociales.linkedin || '');
      formData.append('redes_sociales[twitter]', this.company.redes_sociales.twitter || '');

      // Añadir el logo si se ha seleccionado
      if (this.selectedLogoFile) {
        formData.append('logo', this.selectedLogoFile);
      }

      this.empresaService.updateCompanyInfo(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          const successMessage = response?.message || 'Actualización correctamente';
          this.snackBar.open(successMessage, 'Cerrar', { duration: 3000 });
          // Opcional: Actualizar la vista previa con el nuevo logo
          if (response.company && response.company.logo) {
            this.logoPreview = response.company.logo;
          }
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
