import { Component, OnInit } from '@angular/core';
import { RegulatorioService } from '../../services/regulatorios.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SafeHtmlPipe } from '../../../safe-html.pipe';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [SafeHtmlPipe, CommonModule, MatIconModule],
  templateUrl: './privdocumento.component.html',
  styleUrls: ['./privdocumento.component.css']
})
export class privdocumentosComponent implements OnInit {
  avisoPrivacidad: any;
  titulo: string = '';
  versionDocumento: string = '';
  fechaVigencia: string = '';

  constructor(private regulatoriosService: RegulatorioService) { }

  ngOnInit(): void {
    this.getDocumentos();
  }

  // Obtener los documentos
  getDocumentos(): void {
    // Obtener el Aviso de Privacidad
    this.regulatoriosService.getCurrentVersion('Política de privacidad').subscribe(
      (data) => {
        this.avisoPrivacidad = data.contenido;
        this.titulo = data.titulo; 
        this.versionDocumento = data.version; 
        this.fechaVigencia = data.fecha_vigencia; 
      },
      (error) => {
        console.error('Error al obtener el Aviso de Privacidad:', error);
      }
    );
  }
}
