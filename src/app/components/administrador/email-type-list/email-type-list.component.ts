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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
@Component({
  selector: 'app-email-type-list',
  standalone: true,
  imports: [MatSnackBarModule,MatFormFieldModule,MatInputModule,MatTableModule,MatButtonModule,MatCardModule,MatToolbarModule,CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './email-type-list.component.html',
  styleUrls: ['./email-type-list.component.css']
})
export class EmailTypeListComponent implements OnInit {
  emailTypes: EmailType[] = [];
  error: string = '';
  successMessage: string = ''; // Mensaje de éxito
  selectedEmailType: EmailType | null = null;
  emailTypeForm: FormGroup;

  constructor(public emailTypeService: EmailTypeService, private fb: FormBuilder) {
    this.emailTypeForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      variables_requeridas: [[], Validators.required] // Suponiendo que se pueda llenar con un array
    });
  }


  ngOnInit(): void {
    this.loadEmailTypes();
  }
  updateVariablesRequeridas(event: string) {
    const variables = event.split(',').map(variable => variable.trim());
    this.emailTypeForm.patchValue({ variables_requeridas: variables });
  }
  loadEmailTypes(): void {
    this.emailTypeService.getAllEmailTypes().subscribe({
      next: (data) => {
        console.log('API Response:', data); // Log the response
        this.emailTypes = data.emailTypes || []; // Asigna el array o un array vacío si no existe
      },
      error: (err) => {
        this.error = 'Error loading email types: ' + err.message;
      }
    });
  }
  createEmailType(): void {
    if (this.emailTypeForm.valid) {
      const newEmailType: EmailType = this.emailTypeForm.value;
      this.emailTypeService.createEmailType(newEmailType).subscribe({
        next: (data) => {
          this.emailTypes.push(data);
          this.successMessage = 'Email type created successfully!';
          this.emailTypeForm.reset();
        },
        error: (err) => {
          this.error = 'Error creating email type: ' + err.message;
        }
      });
    }
  }

  editEmailType(emailType: EmailType): void {
    this.selectedEmailType = emailType;
    this.emailTypeForm.patchValue(emailType); // Rellena el formulario con los datos del tipo seleccionado
  }

  deleteEmailType(emailType: EmailType): void {
    if (emailType._id) { // Asegúrate de que _id no es undefined
      this.emailTypeService.deleteEmailType(emailType._id).subscribe({
        next: () => {
          this.emailTypes = this.emailTypes.filter(type => type._id !== emailType._id); // Filtra el tipo eliminado
        },
        error: (err) => {
          this.error = 'Error deleting email type: ' + err.message;
        }
      });
    } else {
      this.error = 'ID de tipo de email no válido.';
    }
  }

  updateEmailType(): void {
    if (this.emailTypeForm.valid && this.selectedEmailType) {
      const updatedEmailType: EmailType = {
        ...this.selectedEmailType,
        ...this.emailTypeForm.value // Combina los datos existentes con los nuevos
      };

      // Asegúrate de que _id está definido antes de usarlo
      if (updatedEmailType._id) {
        this.emailTypeService.updateEmailType(updatedEmailType._id, updatedEmailType).subscribe({
          next: () => {
            const index = this.emailTypes.findIndex(emailType => emailType._id === updatedEmailType._id);
            if (index !== -1) {
              this.emailTypes[index] = updatedEmailType; // Actualiza la lista
            }
            this.emailTypeForm.reset(); // Reinicia el formulario
            this.selectedEmailType = null; // Reinicia la selección
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
