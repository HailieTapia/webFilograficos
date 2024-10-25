import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegulatorioService } from '../../services/regulatorios.service'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-regulatory-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './regulatory-document.component.html',
  styleUrls: ['./regulatory-document.component.css']
})
export class RegulatoryDocumentComponent {
  documentForm: FormGroup;
  submissionStatus: string = '';

  constructor(
    private fb: FormBuilder,
    private regulatorioService: RegulatorioService
  ) {
    this.documentForm = this.fb.group({
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      fecha_vigencia: [null, Validators.required] // Solo necesario si es requerido
    });
  }

  createDocument(): void {
    if (this.documentForm.valid) {
      const documentData = {
        titulo: this.documentForm.value.titulo,
        contenido: this.documentForm.value.contenido,
        fecha_vigencia: this.documentForm.value.fecha_vigencia
      };

      this.regulatorioService.createDocument(documentData).subscribe({
        next: (response) => {
          this.submissionStatus = 'Documento creado con éxito!';
          this.documentForm.reset();
        },
        error: (error) => {
          console.error('Error al crear el documento:', error);
          this.submissionStatus = error.error.message || 'Hubo un error al crear el documento.';
        }
      });
    } else {
      this.submissionStatus = 'Por favor, complete todos los campos requeridos.';
    }
  }
}
