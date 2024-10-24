import { Component } from '@angular/core';
import { RegulatoryDocumentService, RegulatoryDocument } from '../../services/regulatorios.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-regulatorios',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './regulatorios.component.html',
  styleUrls: ['./regulatorios.component.css']
})
export class RegulatoriosComponent {
  documentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private regulatoryDocumentService: RegulatoryDocumentService
  ) {
    this.documentForm = this.fb.group({
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      fecha_vigencia: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.documentForm.valid) {
      const newDocument: RegulatoryDocument = {
        titulo: this.documentForm.value.titulo,
        versiones: [
          {
            version: '1.0', // Versión inicial
            contenido: this.documentForm.value.contenido,
            vigente: true,
            eliminado: false,
          }
        ],
        fecha_vigencia: this.documentForm.value.fecha_vigencia,
        version_actual: '1.0',
        eliminado: false,
      };

      this.regulatoryDocumentService.createRegulatoryDocument(newDocument).subscribe(
        response => {
          console.log('Documento creado exitosamente:', response);
          this.documentForm.reset(); // Resetea el formulario
        },
        error => {
          console.error('Error al crear el documento:', error);
        }
      );
    }
  }
}
