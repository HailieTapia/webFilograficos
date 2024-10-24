import { Component, OnInit } from '@angular/core';
import { EmailTemplateService, EmailTemplate } from '../../services/email-template.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-email-template',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './email-template.component.html',
  styleUrl: './email-template.component.css'
})
export class EmailTemplateComponent implements OnInit {

  templates: EmailTemplate[] = [];
  selectedTemplate: EmailTemplate | null = null;
  isEditing: boolean = false;

  // Form model
  newTemplate: EmailTemplate = {
    nombre: '',
    tipo: '',
    asunto: '',
    contenido_html: '',
    contenido_texto: '',
    variables: []
  };

  constructor(private emailTemplateService: EmailTemplateService) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.emailTemplateService.getAllTemplates().subscribe(
      (data) => {
        this.templates = data;
      },
      (error) => {
        console.error('Error fetching templates', error);
      }
    );
  }

  createTemplate(): void {
    this.emailTemplateService.createTemplate(this.newTemplate).subscribe(
      (response) => {
        this.templates.push(response.template);
        this.newTemplate = { nombre: '', tipo: '', asunto: '', contenido_html: '', contenido_texto: '', variables: [] }; // Reset form
      },
      (error) => {
        console.error('Error creating template', error);
      }
    );
  }

  editTemplate(template: EmailTemplate): void {
    this.selectedTemplate = { ...template }; // Clone the template for editing
    this.isEditing = true;
  }

  updateTemplate(): void {
    if (this.selectedTemplate) {
      this.emailTemplateService.updateTemplate(this.selectedTemplate._id!, this.selectedTemplate).subscribe(
        (response) => {
          const index = this.templates.findIndex(t => t._id === response.template._id);
          if (index !== -1) {
            this.templates[index] = response.template; // Update the existing template
          }
          this.cancelEdit();
        },
        (error) => {
          console.error('Error updating template', error);
        }
      );
    }
  }

  deleteTemplate(templateId: string): void {
    this.emailTemplateService.deleteTemplate(templateId).subscribe(
      () => {
        this.templates = this.templates.filter(template => template._id !== templateId); // Remove deleted template
      },
      (error) => {
        console.error('Error deleting template', error);
      }
    );
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedTemplate = null;
  }
}