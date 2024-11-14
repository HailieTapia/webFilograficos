import { Component, OnInit } from '@angular/core';
import { RegulatorioService } from '../../services/regulatorios.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SafeHtmlPipe } from '../../../safe-html.pipe'; 

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [SafeHtmlPipe, CommonModule, MatIconModule],
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {
  deslindeLegal: any;
  titulo: string = '';
  versionDocumento: string = '';
  fechaVigencia: string = '';
  constructor(private regulatoriosService: RegulatorioService) {}

  ngOnInit(): void {
    this.getDocumentos();
  }

  // Obtener los documentos
  getDocumentos(): void {
    // Obtener el Deslinde Legal
    this.regulatoriosService.getCurrentVersion('Deslinde legal').subscribe(
      (data) => {
        this.deslindeLegal = data.contenido; 
        this.titulo = data.titulo; 
        this.versionDocumento = data.version; 
        this.fechaVigencia = data.fecha_vigencia; 
      },
      (error) => {
        console.error('Error al obtener el Deslinde Legal:', error);
      }
    );
  }
}
