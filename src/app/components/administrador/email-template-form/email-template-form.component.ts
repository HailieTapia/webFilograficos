// email-template-form.component.ts
import { Component, OnInit } from '@angular/core';
import { EmailTemplate, EmailTemplateService } from '../../services/email-template.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-email-template-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './email-template-form.component.html',
  styleUrls: ['./email-template-form.component.css']
})
export class EmailTemplateFormComponent implements OnInit {
  emailTemplateForm: FormGroup;
  emailTemplate: EmailTemplate = {
    nombre: '',
    tipo: '',
    asunto: '',
    contenido_html: '',
    contenido_texto: '',
    variables: []
  };
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private emailTemplateService: EmailTemplateService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.emailTemplateForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      asunto: ['', Validators.required],
      contenido_html: ['', Validators.required],
      contenido_texto: ['', Validators.required],
      variables: ['']
    });
  }

  ngOnInit(): void {
    const templateId = this.route.snapshot.paramMap.get('id');
    if (templateId) {
      this.isEditMode = true;
      this.loadTemplate(templateId);
    }
  }

  loadTemplate(templateId: string): void {
    this.emailTemplateService.getTemplateById(templateId).subscribe(
      (template) => {
        this.emailTemplate = template;
        this.emailTemplateForm.patchValue(template); // Cargar valores en el formulario
      },
      (error) => {
        console.error('Error fetching template:', error);
      }
    );
  }

  saveTemplate(): void {
    if (this.emailTemplateForm.valid) {
      const formValues = {
        ...this.emailTemplateForm.value,
        variables: this.emailTemplateForm.value.variables.split(',').map((v: string) => v.trim()) // Añadir el tipo explícito aquí
      };

      if (this.isEditMode) {
        if (this.emailTemplate._id) {
          this.emailTemplateService.updateTemplate(this.emailTemplate._id, formValues).subscribe(
            () => {
              this.router.navigate(['/email-templates']);
            },
            (error) => {
              console.error('Error updating template:', error);
            }
          );
        } else {
          console.error('Error: El ID de la plantilla no está definido.');
        }
      } else {
        this.emailTemplateService.createTemplate(formValues).subscribe(
          () => {
            this.router.navigate(['/email-templates']);
          },
          (error) => {
            console.error('Error creating template:', error);
          }
        );
      }
    } else {
      console.error('Formulario inválido. Verifica todos los campos.');
    }
  }
}
