import { Component, OnInit } from '@angular/core';
import { EmailTypeService, EmailType, EmailTypeResponse } from '../../services/email-type.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-email-type-list',
  standalone: true,
  imports: [MatDivider,MatSnackBarModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, MatCardModule, MatToolbarModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './email-type-list.component.html',
  styleUrls: ['./email-type-list.component.css']
})
export class EmailTypeListComponent implements OnInit {
  emailTypeForm: FormGroup;
  emailTypes: EmailType[] = [];
  editingEmailTypeId: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private emailTypeService: EmailTypeService,
    private authService: AuthService 
  ) {
    this.emailTypeForm = this.fb.group({
      codigo: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      variables_requeridas: [[], [Validators.required]],
    });
  }
  
  ngOnInit(): void {
    this.loadEmailTypes();
  }
  
  loadEmailTypes(): void {
    this.emailTypeService.getAllEmailTypes().subscribe(
      (response: EmailTypeResponse) => {
        this.emailTypes = response.emailTypes;
      },
      (error) => {
        console.error('Error al obtener tipos de email:', error);
      }
    );
  }

  onSubmit() {
    if (this.emailTypeForm.valid) {
      const formValues = this.emailTypeForm.value;
      const variablesRequeridas = formValues.variables_requeridas.split(',').map((item: string) => item.trim());

      const userId = this.authService.getId();
      if (!userId) {
        console.error('No se pudo obtener el ID del usuario.');
        return; 
      }

      const emailType: EmailType = {
        codigo: formValues.codigo,
        nombre: formValues.nombre,
        descripcion: formValues.descripcion,
        variables_requeridas: variablesRequeridas,
        creado_por: userId, 
      };
      if (this.editingEmailTypeId) {
        this.emailTypeService.updateEmailType(this.editingEmailTypeId, emailType).subscribe(
          response => {
            console.log('Tipo de email actualizado:', response);
            this.loadEmailTypes(); 
            this.resetForm();
          },
          error => {
            console.error('Error al actualizar el tipo de email:', error);
          }
        );
      } else {
        this.emailTypeService.createEmailType(emailType).subscribe(
          response => {
            console.log('Tipo de email creado:', response);
            this.loadEmailTypes(); 
            this.resetForm();
          },
          error => {
            console.error('Error al crear el tipo de email:', error);
          }
        );
      }
    } else {
      console.error('Formulario no válido');
    }
  }

  deleteEmailType(id: string): void {
    this.emailTypeService.deleteEmailType(id).subscribe(
      response => {
        console.log('Tipo de email eliminado:', response);
        this.loadEmailTypes(); 
      },
      error => {
        console.error('Error al eliminar el tipo de email:', error);
      }
    );
  }

  editEmailType(emailType: EmailType): void {
    this.editingEmailTypeId = emailType._id || null;
    this.emailTypeForm.patchValue({
      codigo: emailType.codigo,
      nombre: emailType.nombre,
      descripcion: emailType.descripcion,
      variables_requeridas: emailType.variables_requeridas.join(', '), 
    });
  }

  resetForm() {
    this.editingEmailTypeId = null; 
    this.emailTypeForm.reset(); 
  }
}
