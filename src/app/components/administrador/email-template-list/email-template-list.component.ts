import { Component, OnInit } from '@angular/core';
import { EmailTemplateService } from '../../services/email-template.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface EmailTemplate {
  _id?: string; // Agrega el ID si estás usando MongoDB
  nombre: string;
  tipo: string;
  asunto: string;
  contenido_html: string;
  contenido_texto: string;
  variables: string[];
}

@Component({
  selector: 'app-email-template-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-template-list.component.html',
  styleUrls: ['./email-template-list.component.css']
})
export class EmailTemplateListComponent implements OnInit {
  emailTemplates: EmailTemplate[] = []; // Especificar el tipo de datos

  constructor(private emailTemplateService: EmailTemplateService, public router: Router) {}


  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.emailTemplateService.getAllTemplates().subscribe(
      (templates) => {
        this.emailTemplates = templates;
      },
      (error) => {
        console.error('Error al obtener las plantillas de email:', error);
      }
    );
  }

  deleteTemplate(templateId?: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta plantilla?')) {
      if (templateId) { // Verifica que templateId no sea undefined
        this.emailTemplateService.deleteTemplate(templateId).subscribe(
          () => {
            this.loadTemplates();
          },
          (error) => {
            console.error('Error al eliminar la plantilla:', error);
          }
        );
      } else {
        console.error('Error: El ID de la plantilla no está definido.');
      }
    }
  }
}
