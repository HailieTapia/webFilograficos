import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EmailTemplateService, EmailTemplate } from '../../services/email-template.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { MatTableModule } from '@angular/material/table';
import { EmailTypeService, EmailType } from '../../services/email-type.service';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { noXSSValidator } from '../../shared/validators';

@Component({
  selector: 'app-email-template',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTooltipModule, MatIconModule, MatSelectModule, ReactiveFormsModule, MatTableModule, CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.css', '../../estilos/spinner.css', '../../estilos/tablas.css', '../../estilos/snackbar.css', '../../estilos/botonesIcon.css'],
})
export class EmailTemplateComponent implements OnInit {
  @ViewChild('createOrUpdateModal', { static: true }) createOrUpdateModal!: TemplateRef<any>;
  emailTemplateForm: FormGroup;
  emailTemplates: EmailTemplate[] = [];
  editingEmailTemplateId: string | null | undefined = null;
  emailTypes: EmailType[] = [];
  isLoading: boolean = false;
  modalRef: MatDialogRef<any> | null = null;
  originalEmailTemplateValues: any = null;
  constructor(
    private fb: FormBuilder,
    private emailTemplateService: EmailTemplateService,
    private authService: AuthService,
    private emailTypeService: EmailTypeService,
    private snackBar: MatSnackBar, private dialog: MatDialog
  ) {
    this.emailTemplateForm = this.fb.group({
      nombre: ['', [Validators.required,noXSSValidator()]],
      tipo: ['', [Validators.required, noXSSValidator()]],
      asunto: ['', [Validators.required, noXSSValidator()]],
      contenido_html: ['', [Validators.required, noXSSValidator()]],
      contenido_texto: ['', [Validators.required, noXSSValidator()]],
      variables: [[], [Validators.required, noXSSValidator()]],
    });
  }
  ngOnInit(): void {
    this.loadEmailTemplates();
    this.loadEmailTypes();
  }
  openModal(template: EmailTemplate | null = null): void {
    if (template) {
      this.editingEmailTemplateId = template._id;
      this.emailTemplateForm.patchValue({
        nombre: template.nombre,
        tipo: template.tipo,
        asunto: template.asunto,
        contenido_html: template.contenido_html,
        contenido_texto: template.contenido_texto,
        variables: template.variables.join(', ')
      });
      this.originalEmailTemplateValues = this.emailTemplateForm.getRawValue();
    } else {
      this.resetForm();
    }
    this.modalRef = this.dialog.open(this.createOrUpdateModal);
  }
  //cargar plantillas email
  private loadEmailTemplates(): void {
    this.isLoading = true;
    this.emailTemplateService.getAllTemplates().subscribe(
      response => {
        this.emailTemplates = response.filter(template => template.activo);
        this.isLoading = false;
      },
      (error) => {
        const errorMessage = error?.error?.message || 'Error al obtener plantillas de email';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  private loadEmailTypes(): void {
    this.isLoading = true;
    this.emailTypeService.getAllEmailTypes().subscribe(
      response => {
        this.emailTypes = response.emailTypes;
        this.isLoading = false;
      },
      (error) => {
        const errorMessage = error?.error?.message || 'Error al obtener tipos de email';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    );
  };
  onSubmit(): void {
    if (this.emailTemplateForm.valid) {
      const currentValues = this.emailTemplateForm.getRawValue();
      const isChanged = JSON.stringify(currentValues) !== JSON.stringify(this.originalEmailTemplateValues);
      if (!isChanged) {
        this.closeModal();
        return;
      }
      const formValues = this.emailTemplateForm.value;
      const variables = formValues.variables.split(',').map((item: string) => item.trim()).filter((item: string) => item.length > 0);
      const userId = this.authService.getId();
      if (!userId) return;

      const emailTemplate: EmailTemplate = {
        nombre: formValues.nombre,
        tipo: formValues.tipo,
        asunto: formValues.asunto,
        contenido_html: formValues.contenido_html,
        contenido_texto: formValues.contenido_texto,
        variables: variables,
        creado_por: userId
      };

      if (this.editingEmailTemplateId) {
        this.emailTemplateService.updateTemplate(this.editingEmailTemplateId, emailTemplate).subscribe(
          () => {
            this.snackBar.open('Plantilla actualizada', 'Cerrar', {
              duration: 3000
            });
            this.loadEmailTemplates();
            this.resetForm();
            this.closeModal();
          },
          (error) => {
            const errorMessage = error?.error?.message || 'Error al actualizar plantillas de email';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
            this.isLoading = false;
          }
        );
      } else {
        this.emailTemplateService.createTemplate(emailTemplate).subscribe(
          () => {
            this.snackBar.open('Plantilla creada', 'Cerrar', {
              duration: 3000
            });
            this.loadEmailTemplates();
            this.resetForm();
            this.closeModal();
          },
          (error) => {
            const errorMessage = error?.error?.message || 'Error al crear plantillas de email';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
            this.isLoading = false;
          }
        );
      }
    }
  }
  // eliminar plantilla email
  deleteEmailTemplate(id: string): void {
    const snackBarRef = this.snackBar.open('¿Estás seguro de que quieres eliminar esta plantilla?', 'Sí', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
    let actionConfirmed = false;
    snackBarRef.onAction().subscribe(() => {
      this.emailTemplateService.deleteTemplate(id).subscribe({
        next: () => {
          this.snackBar.open('Plantilla eliminada exitosamente', 'Cerrar', {
            duration: 3000
          });
          this.loadEmailTemplates();
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'Error al eliminar plantillas de email';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
          this.isLoading = false;
        }
      });
      actionConfirmed = true;
    });
    snackBarRef.afterDismissed().subscribe(() => {
      if (!actionConfirmed) {
        this.snackBar.open('Eliminación cancelada', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
  //editar plantila email
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

  resetForm(): void {
    this.editingEmailTemplateId = null;
    this.emailTemplateForm.reset();
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
