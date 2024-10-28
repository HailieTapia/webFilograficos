import { Component, OnInit } from '@angular/core';
import { EmailTemplateService, EmailTemplate } from '../../services/email-template.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatListModule } from '@angular/material/list'; 
import { AuthService } from '../../services/auth.service';
import { MatTableModule } from '@angular/material/table';
import { EmailTypeService, EmailType } from '../../services/email-type.service'; 
import { MatSelectModule } from '@angular/material/select'; // Importar MatSelectModule

@Component({
  selector: 'app-email-template',
  standalone: true,
  imports: [MatSelectModule,ReactiveFormsModule, MatTableModule, CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatListModule],
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.css'],
})
export class EmailTemplateComponent implements OnInit {
  emailTemplateForm: FormGroup;
  emailTemplates: EmailTemplate[] = [];
  editingEmailTemplateId: string | null = null; 
  emailTypes: EmailType[] = []; 

  constructor(
    private fb: FormBuilder,
    private emailTemplateService: EmailTemplateService,
    private authService: AuthService,
    private emailTypeService: EmailTypeService
  ) {
    this.emailTemplateForm = this.fb.group({
      nombre: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      asunto: ['', [Validators.required]],
      contenido_html: ['', [Validators.required]],
      contenido_texto: ['', [Validators.required]],
      variables: [[], [Validators.required]],
    });
  } 

  ngOnInit(): void {
    this.loadEmailTemplates();
    this.loadEmailTypes(); 
  }
  
  loadEmailTemplates(): void {
    this.emailTemplateService.getAllTemplates().subscribe(
      (response) => {
        console.log('API Response:', response); 
        this.emailTemplates = response; 
        const activeTemplates = this.emailTemplates.filter(template => template.activo);
        console.log('Active Email Templates:', activeTemplates); 
      },
      (error) => {
        console.error('Error al obtener plantillas de email:', error);
      }
    );
  }

  loadEmailTypes(): void {
    this.emailTypeService.getAllEmailTypes().subscribe(
      (response) => {
        this.emailTypes = response.emailTypes; // Ensure response has the correct structure
        console.log('Tipos de Email Cargados:', this.emailTypes);
      },
      (error) => {
        console.error('Error al cargar tipos de email:', error);
      }
    );
  }
  onSubmit() {
    if (this.emailTemplateForm.valid) {
      const formValues = this.emailTemplateForm.value;
    
      const variables: string[] = formValues.variables
        ? formValues.variables.split(',')
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0)
        : [];
    
      const userId = this.authService.getId();
      if (!userId) {
        console.error('No se pudo obtener el ID del usuario.');
        return; 
      }
    
      const emailTemplate: EmailTemplate = {
        nombre: formValues.nombre,
        tipo: formValues.tipo,
        asunto: formValues.asunto,
        contenido_html: formValues.contenido_html,
        contenido_texto: formValues.contenido_texto,
        variables: variables,
        creado_por: userId,
      };
    
      // Verificar si estamos editando una plantilla existente
      if (this.editingEmailTemplateId) {
        this.emailTemplateService.updateTemplate(this.editingEmailTemplateId, emailTemplate).subscribe(
          response => {
            console.log('Plantilla de email actualizada:', response);
            this.loadEmailTemplates();
            this.resetForm();
          },
          error => {
            console.error('Error al actualizar plantilla de email:', error);
          }
        );
      } else {
        // Crear una nueva plantilla
        this.emailTemplateService.createTemplate(emailTemplate).subscribe(
          response => {
            console.log('Plantilla de email creada:', response);
            this.loadEmailTemplates();
            this.resetForm();
          },
          error => {
            console.error('Error al crear plantilla de email:', error);
          }
        );
      }
    } else {
      console.error('Formulario no válido');
    }
  }
  
  
  deleteEmailTemplate(id: string): void {
    this.emailTemplateService.deleteTemplate(id).subscribe(
      response => {
        console.log('Plantilla de email eliminada:', response);
        this.loadEmailTemplates(); 
      },
      error => {
        console.error('Error al eliminar plantilla de email:', error);
      }
    );
  }

  editEmailTemplate(emailTemplate: EmailTemplate): void {
    this.editingEmailTemplateId = emailTemplate._id || null;
    this.emailTemplateForm.patchValue({
      nombre: emailTemplate.nombre,
      tipo: emailTemplate.tipo,
      asunto: emailTemplate.asunto,
      contenido_html: emailTemplate.contenido_html,
      contenido_texto: emailTemplate.contenido_texto,
      variables: emailTemplate.variables.join(', '), 
    });
  }
  
  resetForm() {
    this.editingEmailTemplateId = null; 
    this.emailTemplateForm.reset(); 
  }
}
