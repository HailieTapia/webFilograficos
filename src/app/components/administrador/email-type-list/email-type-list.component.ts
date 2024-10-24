import { Component, OnInit } from '@angular/core';
import { EmailTypeService, EmailType } from '../../services/email-type.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-email-type-list',
  standalone: true,
  imports: [
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './email-type-list.component.html',
  styleUrls: ['./email-type-list.component.css']
})
export class EmailTypeListComponent implements OnInit {
  emailTypes: EmailType[] = [];
  error: string = '';
  successMessage: string = '';
  selectedEmailType: EmailType | null = null;
  emailTypeForm: FormGroup;
  isEditMode: boolean = false;

  constructor(public emailTypeService: EmailTypeService, private fb: FormBuilder) {
    // Aquí se eliminará la inicialización del formulario
    this.emailTypeForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      variables_requeridas: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEmailTypes();
  }

  loadEmailTypes(): void {
    this.emailTypeService.getAllEmailTypes().subscribe({
      next: (data) => {
        console.log('API Response:', data);
        this.emailTypes = data.emailTypes || [];
      },
      error: (err) => {
        this.error = 'Error loading email types: ' + err.message;
      }
    });
  }

  editEmailType(emailType: EmailType): void {
    this.selectedEmailType = emailType;
    this.emailTypeForm.patchValue(emailType);
    this.isEditMode = true;
  }

  deleteEmailType(emailType: EmailType): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el tipo de email "${emailType.nombre}"?`)) {
      if (emailType._id) {
        this.emailTypeService.deleteEmailType(emailType._id).subscribe({
          next: () => {
            this.emailTypes = this.emailTypes.filter(type => type._id !== emailType._id);
          },
          error: (err) => {
            this.error = 'Error deleting email type: ' + err.message;
          }
        });
      } else {
        this.error = 'ID de tipo de email no válido.';
      }
    }
  }

  updateEmailType(): void {
    if (this.emailTypeForm.valid && this.selectedEmailType) {
      const updatedEmailType: EmailType = {
        ...this.selectedEmailType,
        ...this.emailTypeForm.value
      };

      if (updatedEmailType._id) {
        this.emailTypeService.updateEmailType(updatedEmailType._id, updatedEmailType).subscribe({
          next: () => {
            const index = this.emailTypes.findIndex(emailType => emailType._id === updatedEmailType._id);
            if (index !== -1) {
              this.emailTypes[index] = updatedEmailType;
            }
            this.emailTypeForm.reset();
            this.selectedEmailType = null;
            this.isEditMode = false;
            this.successMessage = 'Tipo de email actualizado correctamente.';
          },
          error: (err) => {
            this.error = 'Error updating email type: ' + err.message;
          }
        });
      } else {
        this.error = 'ID de tipo de email no válido.';
      }
    }
  }
}
