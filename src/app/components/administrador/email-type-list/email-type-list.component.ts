import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EmailTypeService, EmailType, EmailTypeResponse } from '../../services/email-type.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-email-type-list',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatIconModule, MatTooltipModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, MatToolbarModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './email-type-list.component.html',
  styleUrls: ['./email-type-list.component.css', '../../estilos/spinner.css', '../../estilos/tablas.css', '../../estilos/snackbar.css', '../../estilos/botonesIcon.css']
})
export class EmailTypeListComponent implements OnInit {
  @ViewChild('createOrUpdateModal', { static: true }) createOrUpdateModal!: TemplateRef<any>;
  emailTypeForm: FormGroup;
  isLoading: boolean = false;
  emailTypes: EmailType[] = [];
  modalRef: MatDialogRef<any> | null = null;
  editingEmailTypeId: string | null | undefined = null;
  originalEmailTypeValues: any = null;
  constructor(
    private fb: FormBuilder,
    private emailTypeService: EmailTypeService,
    private authService: AuthService,
    private dialog: MatDialog, private snackBar: MatSnackBar
  ) {
    this.emailTypeForm = this.fb.group({
      codigo: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      variables_requeridas: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadEmailTypes();
  }
  openModal(emailType: EmailType | null = null): void {
    if (emailType) {
      this.editingEmailTypeId = emailType._id;
      this.emailTypeForm.patchValue({
        codigo: emailType.codigo,
        nombre: emailType.nombre,
        descripcion: emailType.descripcion,
        variables_requeridas: emailType.variables_requeridas.join(', '),
      });

      // Guardar los valores originales
      this.originalEmailTypeValues = this.emailTypeForm.getRawValue();
    } else {
      this.resetForm();
    }
    this.modalRef = this.dialog.open(this.createOrUpdateModal);
  }
  //cargar tipo email
  loadEmailTypes(): void {
    this.isLoading = true;
    this.emailTypeService.getAllEmailTypes().subscribe(
      (response: EmailTypeResponse) => {
        this.emailTypes = response.emailTypes;
        this.isLoading = false;
      },
      (error) => {
        const errorMessage = error?.error?.message || 'Error al obtener los tipos de email';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }
    //crear-actualziar tipo email
    onSubmit(): void {
      if (this.emailTypeForm.valid) {
        const currentValues = this.emailTypeForm.getRawValue();
        const isChanged = JSON.stringify(currentValues) !== JSON.stringify(this.originalEmailTypeValues);
        if (!isChanged) {
          this.closeModal();
          return;
        }
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
            () => {
              this.snackBar.open('Tipo actualizado con éxito', 'Cerrar', {
                duration: 3000
              });
              this.loadEmailTypes();
              this.resetForm();
              this.closeModal();
            },
            (error) => {
              const errorMessage = error?.error?.message || 'Error al actualizar el tipo de email';
              this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
              this.isLoading = false;
            }
          );
        } else {
          this.emailTypeService.createEmailType(emailType).subscribe(
            () => {
              this.snackBar.open('Tipo creado con éxito', 'Cerrar', {
                duration: 3000
              });
              this.loadEmailTypes();
              this.resetForm();
              this.closeModal();
            },
            (error) => {
              const errorMessage = error?.error?.message || 'Error al crear el tipo de email';
              this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
              this.isLoading = false;
            }
          );
        }
      }
    }
  
  //eliminar tipo email
  deleteEmailType(id: string): void {
    const snackBarRef = this.snackBar.open('¿Estás seguro de que quieres eliminar este tipo?', 'Sí', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
    let actionConfirmed = false;
    snackBarRef.onAction().subscribe(() => {
      this.emailTypeService.deleteEmailType(id).subscribe({
        next: () => {
          this.snackBar.open('Tipo eliminado exitosamente', 'Cerrar', {
            duration: 3000
          });
          this.loadEmailTypes();
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'Error al eliminar el tipo de email';
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
  //editar tipo email
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
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
