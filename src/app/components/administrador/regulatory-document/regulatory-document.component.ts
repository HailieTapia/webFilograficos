import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RegulatorioService } from '../../services/regulatorios.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
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
  imports: [MatTooltipModule, MatDialogModule, MatButtonModule, MatIconModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatIconModule, FormsModule, CommonModule, MatTableModule, MatSortModule, MatInputModule, MatFormFieldModule],
  templateUrl: './regulatory-document.component.html',
  styleUrls: ['./regulatory-document.component.css', '../../estilos/spinner.css', '../../estilos/tablas.css', '../../estilos/snackbar.css', '../../estilos/botonesIcon.css']
})
export class RegulatoryDocumentComponent implements OnInit {
  @ViewChild('updateModal', { static: true }) updateModal!: TemplateRef<any>;
  @ViewChild('versionHistoryModal', { static: true }) versionHistoryModal!: TemplateRef<any>;
  today: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  versionHistory: any[] = [];
  displayedColumnsH: string[] = ['version', 'contenido'];

  displayedColumns: string[] = ['titulo', 'fecha_vigencia', 'contenido', 'version', 'acciones'];
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
  openVersionHistoryModal(document: any): void {
    this.fetchVersionHistory(document.titulo).then(() => {
      this.modalRef = this.dialog.open(this.versionHistoryModal, {
        data: { versions: this.versionHistory, documentTitle: document.titulo },
      });
    });
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

    this.documentService.updateDocument(documentId, updatedContent).subscribe({
      next: (response) => {
        this.snackBar.open('Documento actualizado correctamente', 'Cerrar', {
          duration: 3000
        });
        this.fetchAllDocuments();
        this.resetForm();
        this.closeModal();
      },
      error: (error) => {
        const errorMessage = error?.error?.message || 'Error al actualizar el documento';
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  // Crear un documento regulatorio
  createDocument(): void {
    this.documentService.createDocument(this.newDocument).subscribe({
      next: (response) => {
        this.snackBar.open('Documento creado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'center',
        });
        this.fetchAllDocuments();
        this.resetForm();
        this.closeModal();
      },
      error: (error) => {
        const errorMessage = error?.error?.message || 'Error al crear el documento';
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000,
        });
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

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      
    }
  }
  //obtenet historial de doc
  fetchVersionHistory(titulo: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.documentService.getVersionHistory(titulo).subscribe({
        next: (response) => {
          this.versionHistory = response.historial || [];
          resolve(response);
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'Error al obtener el historial de versiones';
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 3000
          });
          reject(error);
        },
      });
    });
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
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }
  // Obtener la versión vigente de un documento
  fetchCurrentVersion(titulo: string): void {
    this.documentService.getCurrentVersion(titulo).subscribe({
      next: (response) => {
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al obtener los documentos', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  // Eliminar un documento
  deleteDocument(documentId: string): void {
    const snackBarRef = this.snackBar.open('¿Estás seguro de que quieres eliminar este documento (Incluye todas las versiones)?', 'Sí', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
    let actionConfirmed = false;

    snackBarRef.onAction().subscribe(() => {
      this.documentService.deleteDocument(documentId).subscribe({
        next: (response) => {
          this.snackBar.open('Documento eliminado exitosamente', 'Cerrar', {
            duration: 3000
          });
          this.fetchAllDocuments();
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar los documentos', 'Cerrar', {
            duration: 3000
          });
        }
      });
      actionConfirmed = true;
    });
    snackBarRef.afterDismissed().subscribe(() => {
      if (!actionConfirmed) {
        this.snackBar.open('Eliminación cancelada', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
  // Eliminar una versión de un documento
  deleteDocumentVersion(documentId: string, version: string): void {
    const snackBarRef = this.snackBar.open(
      `¿Estás seguro de que quieres eliminar la versión ${version} de este documento?`, 
      'Sí', 
      {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      }
    );

    let actionConfirmed = false;

    snackBarRef.onAction().subscribe(() => {
      this.documentService.deleteDocumentVersion(documentId, version).subscribe({
        next: (response) => {
          this.snackBar.open('Versión eliminada exitosamente', 'Cerrar', {
            duration: 3000,
          });
          this.fetchAllDocuments(); // Actualiza la lista de documentos
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar la versión', 'Cerrar', {
            duration: 3000,
          });
        },
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
}