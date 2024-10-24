import { Component, OnInit } from '@angular/core';
import { EmailTemplateService, EmailTemplate } from '../../services/email-template.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatListModule } from '@angular/material/list'; 

@Component({
  selector: 'app-email-template',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatListModule],
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.css'],
})
export class EmailTemplateComponent implements OnInit {
  templates: EmailTemplate[] = [];
  isEditing: boolean = false;

  currentTemplate: EmailTemplate = this.initializeTemplate();

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

  editTemplateDetails(template: EmailTemplate): void {
    this.isEditing = true;
    this.currentTemplate = { ...template };
  }

  updateTemplate(): void {
    this.emailTemplateService.updateTemplate(this.currentTemplate._id!, this.currentTemplate).subscribe(
      (response) => {
        const index = this.templates.findIndex(t => t._id === response._id);
        if (index !== -1) {
          this.templates[index] = response;
        }
        this.cancelEdit();
      },
      (error) => {
        console.error('Error updating template', error);
      }
    );
  }

  deleteTemplate(templateId: string): void {
    this.emailTemplateService.deleteTemplate(templateId).subscribe(
      () => {
        this.templates = this.templates.filter(template => template._id !== templateId);
      },
      (error) => {
        console.error('Error deleting template', error);
      }
    );
  }

  initializeTemplate(): EmailTemplate {
    return {
      nombre: '',
      tipo: '',
      asunto: '',
      contenido_html: '',
      contenido_texto: '',
      variables: [],
    };
  }

  resetForm(): void {
    this.currentTemplate = this.initializeTemplate();
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.resetForm();
  }
}
