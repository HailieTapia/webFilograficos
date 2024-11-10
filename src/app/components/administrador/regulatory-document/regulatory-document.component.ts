import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RegulatorioService } from '../../services/regulatorios.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-regulatory-document',
  standalone: true,
  imports: [MatTooltipModule,MatDialogModule, MatButtonModule, MatIconModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatIconModule, FormsModule, CommonModule, MatTableModule],
  templateUrl: './regulatory-document.component.html',
  styleUrls: ['./regulatory-document.component.css']
})
export class RegulatoryDocumentComponent implements OnInit {
  @ViewChild('updateModal', { static: true }) updateModal!: TemplateRef<any>;  

  displayedColumns: string[] = ['titulo','fecha_vigencia', 'contenido', 'version',  'acciones'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading: boolean = false;
  errorMessage: string = '';
  newDocument = {
    titulo: '',
    contenido: '',
    fecha_vigencia: new Date()
  };
  modalRef: any;

  constructor(
    private documentService: RegulatorioService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  openCreateModal(templateRef: TemplateRef<any>): void {
    this.modalRef = this.dialog.open(templateRef);
  }

  openUpdateModal(document: any): void {
    this.newDocument.titulo = document.titulo;
    this.newDocument.contenido = document.contenido;
    this.newDocument.fecha_vigencia = new Date(document.fecha_vigencia);
    this.modalRef = this.dialog.open(this.updateModal, { data: document });
  }

  ngOnInit(): void {
    this.fetchAllDocuments();
  }

  // Método para actualizar un documento
  updateDocument(documentId: string): void {
    const updatedContent = {
      nuevo_contenido: this.newDocument.contenido,
      nueva_fecha_vigencia: this.newDocument.fecha_vigencia.toISOString()
    };

    this.isLoading = true;
    this.documentService.updateDocument(documentId, updatedContent).subscribe({
      next: (response) => {
        this.snackBar.open('Documento actualizado correctamente', 'Cerrar', {
          duration: 3000, 
          panelClass: ['success-snackbar'], 
          horizontalPosition: 'center', 
        });
        this.fetchAllDocuments();
        this.isLoading = false;
        this.resetForm();
        this.closeModal();
      },
      error: (error) => {
        this.snackBar.open('Error al actualizar el documento', 'Cerrar', {
          duration: 3000, 
          panelClass: ['error-snackbar'], 
          horizontalPosition: 'center', 
        });
        this.isLoading = false;
      }
    });
  }

  // Crear un documento regulatorio
  createDocument(): void {
    this.isLoading = true;
    this.documentService.createDocument(this.newDocument).subscribe({
      next: (response) => {
        this.snackBar.open('Documento creado exitosamente','Cerrar', {
          duration: 3000, 
          panelClass: ['success-snackbar'], 
          horizontalPosition: 'center', 
        });
        this.fetchAllDocuments();
        this.isLoading = false;
        this.resetForm();
        this.closeModal();
      },
      error: (error) => {
        this.snackBar.open('Error al crear el documento', 'Cerrar', {
          duration: 3000, 
          panelClass: ['error-snackbar'], 
          horizontalPosition: 'center', 
        });
        this.isLoading = false;
      }
    });
  }

  // Limpiar el formulario
  resetForm(): void {
    this.newDocument = {
      titulo: '',
      contenido: '',
      fecha_vigencia: new Date()
    };
  }

  // Método para cerrar el modal
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
  
  // Obtener todos los documentos
  fetchAllDocuments(): void {
    this.isLoading = true;
    this.documentService.getAllDocuments().subscribe({
      next: (response) => {
        this.dataSource.data = response.versiones_vigentes;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al obtener los documentos', 'Cerrar', {
          duration: 3000, 
          panelClass: ['error-snackbar'], 
          horizontalPosition: 'center', 
        });
        this.isLoading = false;
      }
    });
  }

  // Obtener la versión vigente de un documento
  fetchCurrentVersion(titulo: string): void {
    this.isLoading = true;
    this.documentService.getCurrentVersion(titulo).subscribe({
      next: (response) => {
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al obtener los documentos', 'Cerrar', {
          duration: 3000, 
          panelClass: ['error-snackbar'], 
          horizontalPosition: 'center', 
        });
        this.isLoading = false;
      }
    });
  }

  // Eliminar un documento
  deleteDocument(documentId: string): void {
    const snackBarRef = this.snackBar.open('¿Estás seguro de que quieres eliminar este documento?', 'Sí', {
      duration: 4000, 
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  
    snackBarRef.onAction().subscribe(() => {
      this.isLoading = true;
      this.documentService.deleteDocument(documentId).subscribe({
        next: (response) => {
          this.snackBar.open('Documento eliminado exitosamente', 'Cerrar', {
            duration: 3000, 
            panelClass: ['error-snackbar'], 
            horizontalPosition: 'center', 
          });
          this.fetchAllDocuments();
          this.isLoading = false;
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar los documentos', 'Cerrar', {
            duration: 3000, 
            panelClass: ['error-snackbar'], 
            horizontalPosition: 'center', 
          });
          this.isLoading = false;
        }
      });
    });
  
    snackBarRef.afterDismissed().subscribe(() => {
      console.log('Eliminación cancelada');
    });
  }
}