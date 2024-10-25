import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresaService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [MatInputModule,MatFormFieldModule,CommonModule, ReactiveFormsModule],
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {
  company: any = null;
  successMessage: string = '';
  errorMessage: string = '';
  companyForm: FormGroup;

  constructor(private fb: FormBuilder, private empresaService: EmpresaService) {
    this.companyForm = this.createFormGroup();
  }

  ngOnInit(): void {
    this.getCompanyInfo(); // Obtener información de la empresa al iniciar
  }

  // Crear el grupo de formularios
  private createFormGroup(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      slogan: [''],
      logo: [''],
      titulo_pagina: [''],
      email: ['', [Validators.required, Validators.email]],
      direccion: this.fb.group({
        calle: ['', Validators.required],
        ciudad: ['', Validators.required],
        estado: ['', Validators.required],
        codigo_postal: ['', Validators.required],
        pais: ['', Validators.required]
      }),
      telefono: this.fb.group({
        numero: ['', Validators.required],
        extension: ['']
      }),
      redes_sociales: this.fb.group({
        facebook: [''],
        twitter: [''],
        linkedin: [''],
        instagram: ['']
      })
    });
  }

  // Obtener la información de la empresa
  getCompanyInfo(): void {
    this.empresaService.getCompanyInfo().subscribe(
      (data) => {
        console.log('Datos obtenidos:', data);
        this.company = data.company;
        this.companyForm.patchValue(this.company); // Rellenar el formulario
      },
      (error) => {
        console.error('Error al obtener información de la empresa:', error);
        this.errorMessage = 'Error al obtener la información de la empresa: ' + (error?.message || 'Intenta de nuevo.');
      }
    );
  }

  // Actualizar la información de la empresa
  updateCompanyInfo(): void {
    if (this.companyForm.valid) {
      const updatedData = this.companyForm.value; // Obtener los datos del formulario
  
      // Validación del objeto antes de enviar
      console.log('Datos a enviar:', updatedData); // Para verificar estructura en consola
  
      this.empresaService.updateCompanyInfo(updatedData).subscribe(
        (response) => {
          console.log('Actualización exitosa', response);
          this.successMessage = 'Información de la empresa actualizada correctamente.';
          this.getCompanyInfo(); // Actualizar información después de la modificación
        },
        (error) => {
          console.error('Error al actualizar la información de la empresa:', error);
          this.errorMessage = 'Error al actualizar la información: ' + (error?.message || 'Intenta de nuevo.');
        }
      );
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
    }
  }
  
  //
  deleteSocialMediaLink(platform: string): void {
    const confirmation = confirm(`¿Estás seguro de que deseas eliminar el enlace de ${platform}?`);
    if (confirmation) {
      const linksToDelete = [platform]; // Solo eliminar el enlace específico
      this.empresaService.deleteSocialMediaLinks(linksToDelete).subscribe(
        (response) => {
          alert(`Enlace de ${platform} eliminado correctamente.`);
          this.getCompanyInfo(); // Actualizar información después de la eliminación
        },
        (error) => {
          this.errorMessage = 'Error al eliminar el enlace de redes sociales: ' + (error?.message || 'Intenta de nuevo.');
        }
      );
    }
  }
  
}
