import { Component, OnInit } from '@angular/core';
import { RegulatorioService } from '../../services/regulatorios.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SafeHtmlPipe } from '../../../safe-html.pipe'; 

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [SafeHtmlPipe, CommonModule, MatIconModule],
  templateUrl: './condocumento.component.html',
  styleUrls: ['./condocumento.component.css']
})
export class CondocumetoComponent implements OnInit {
  titulo: string = '';
  versionDocumento: string = '';
  fechaVigencia: string = '';
  terminosCondiciones: any;

  constructor(private regulatoriosService: RegulatorioService) {}

  ngOnInit(): void {
    this.getDocumentos();
  }

  // Obtener los documentos
  getDocumentos(): void {
    // Obtener los Términos y Condiciones
    this.regulatoriosService.getCurrentVersion('Términos y condiciones').subscribe(
      (data) => {
        this.terminosCondiciones = data.contenido;  
        this.titulo = data.titulo; 
        this.versionDocumento = data.version; 
        this.fechaVigencia = data.fecha_vigencia; 
      },
      (error) => {
        console.error('Error al obtener los Términos y Condiciones:', error);
      }
    );
  }
}
