import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresaService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {
  company: any = null;
  successMessage: string = '';
  errorMessage: string = '';
  companyForm: FormGroup;

  constructor(private fb: FormBuilder, private empresaService: EmpresaService) {
    this.companyForm = this.fb.group({
      nombre: ['', Validators.required],
      slogan: [''],
      logo: [''],
      titulo_pagina: [''],
      email: ['', [Validators.required, Validators.email]],
      direccion: this.fb.group({
        calle: ['', ],
        ciudad: ['', ],
        estado: ['', ],
        codigo_postal: ['', ],
        pais: ['', ]
      }),
      telefono: this.fb.group({
        numero: ['', ],
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

  ngOnInit(): void {
    this.getCompanyInfo(); // Llamar al método para obtener información de la empresa al iniciar
  }

  // Obtener la información de la empresa
  getCompanyInfo(): void {
    this.empresaService.getCompanyInfo().subscribe(
      (data) => {
        this.company = data.company;
        this.companyForm.patchValue(this.company); // Rellenar el formulario con la información existente
      },
      (error) => {
        this.errorMessage = 'Error al obtener la información de la empresa. ' + (error?.message || '');
      }
    );
  }

  // Actualizar la información de la empresa
  updateCompanyInfo(): void {
    if (this.companyForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios correctamente.';
      return;
    }

    const updatedData = this.companyForm.value;
    console.log('Datos a enviar:', updatedData); // Imprimir datos para depuración

    this.empresaService.updateCompanyInfo(updatedData).subscribe(
      (response) => {
        console.log('Información actualizada con éxito', response);
        this.successMessage = 'Información actualizada correctamente.'; // Mensaje de éxito
        this.errorMessage = ''; // Limpiar mensajes de error
      },
      (error) => {
        this.errorMessage = 'Error al actualizar la información de la empresa. ' + (error?.message || '');
        console.error('Error detallado:', error); // Imprimir error para depuración
        
      }
    );
  }

  // Eliminar enlaces de redes sociales
  deleteSocialMediaLinks(): void {
    const linksToDelete = ['facebook', 'twitter']; // Especifica los enlaces que deseas eliminar

    this.empresaService.deleteSocialMediaLinks(linksToDelete).subscribe(
      (response) => {
        alert('Enlaces de redes sociales eliminados correctamente.');
        this.getCompanyInfo(); // Actualiza la información después de la eliminación
      },
      (error) => {
        this.errorMessage = 'Error al eliminar los enlaces de redes sociales. ' + (error?.message || '');
      }
    );
  }
}
