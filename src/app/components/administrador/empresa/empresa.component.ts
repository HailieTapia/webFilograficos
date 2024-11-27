import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresaService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmpresaStateService } from '../../services/EmpresaStateService';
import { noXSSValidator } from '../../shared/validators';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [MatTooltipModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatInputModule, MatFormFieldModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css', '../../estilos/botonesIcon.css', '../../estilos/spinner.css', '../../estilos/snackbar.css']
})
export class EmpresaComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  companyForm: FormGroup;
  isLoading: boolean = false;
  selectedLogoFile: File | null = null;
  logoPreview: string | ArrayBuffer | null = null;
  company: any = {};
  constructor(
    private empresaStateService: EmpresaStateService,
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private snackBar: MatSnackBar
  ) {
    this.companyForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100),noXSSValidator()]],
      email: ['', [Validators.email,noXSSValidator()]],
      slogan: ['', [Validators.maxLength(100),noXSSValidator()]],
      direccion: this.fb.group({
        calle: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ0-9,.:]+( [a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ0-9,.:]+)*$/), Validators.minLength(3), Validators.maxLength(100),noXSSValidator()]],
        ciudad: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ ]+$/), Validators.minLength(2), Validators.maxLength(50),noXSSValidator()]],
        codigo_postal: ['', [Validators.pattern(/^\d{5}$/),noXSSValidator()]],
        estado: ['', [Validators.pattern(/^(?! )[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ]+)*$/), Validators.minLength(2), Validators.maxLength(50),noXSSValidator()]],
        pais: ['', [Validators.pattern(/^(?! )[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜ]+)*$/), Validators.minLength(2), Validators.maxLength(50),noXSSValidator()]],
      }),
      telefono: this.fb.group({
        numero: ['', [Validators.pattern(/^\d{10}$/),noXSSValidator()]],
      }),
      redes_sociales: this.fb.group({
        facebook: ['', [Validators.pattern('https?://.*'),noXSSValidator()]],
        instagram: ['', [Validators.pattern('https?://.*'),noXSSValidator()]],
        linkedin: ['', [Validators.pattern('https?://.*'),noXSSValidator()]],
        twitter: ['', [Validators.pattern('https?://.*'),noXSSValidator()]],
      }),
      logo: ['',noXSSValidator()],
    });
  }

  ngOnInit(): void {
    this.getCompanyInfo();
  }
  // Obtener la información de la empresa
  getCompanyInfo(): void {
    this.isLoading = true;
    this.empresaService.getCompanyInfo().subscribe({
      next: (data) => {
        if (data && data.company) {
          this.companyForm.patchValue(data.company);
          this.empresaStateService.setCompanyInfo(data.company);
          this.isLoading = false;
          if (data.company.logo) {
            this.logoPreview = data.company.logo;
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error?.error?.message || 'Error al obtener datos';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Método para simular el clic en el input de archivo
  triggerFileInput(fileInput: HTMLInputElement): void {
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
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para actualizar la información de la empresa
  actualizar(): void {
    if (this.companyForm.valid) {
      this.isLoading = true;
      const formData = new FormData();

      // Añadir todos los campos de la empresa al FormData
      Object.keys(this.companyForm.controls).forEach((key) => {
        const control = this.companyForm.get(key);
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach((subKey) => {
            const value = control.get(subKey)?.value;
            if (value) {
              formData.append(`${key}[${subKey}]`, value);
            }
          });
        } else {
          const value = control?.value;
          if (value) {
            formData.append(key, value);
          }
        }
      });
      if (this.selectedLogoFile) {
        formData.append('logo', this.selectedLogoFile);
      }

      this.empresaService.updateCompanyInfo(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          const successMessage = response?.message || 'Actualización correctamente';
          this.snackBar.open(successMessage, 'Cerrar', { duration: 3000 });
          if (response.company && response.company.logo) {
            this.logoPreview = response.company.logo;
            this.empresaStateService.setCompanyInfo(response.company);
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
  //eliminar enlaces
  onDeleteSocialMediaLink(socialMedia: string): void {
    const redesSociales: any = {
      [socialMedia]: true
    };
    this.isLoading = true;

    this.empresaService.deleteSocialMediaLinks(redesSociales).subscribe({
      next: (response) => {
        this.isLoading = false;
        const successMessage = response?.message || 'Red social eliminada correctamente';
        this.snackBar.open(successMessage, 'Cerrar', { duration: 3000 });

        this.companyForm.get(`redes_sociales.${socialMedia}`)?.reset();
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error?.error?.message || 'Error al eliminar la red social';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
      }
    });
  }
}

