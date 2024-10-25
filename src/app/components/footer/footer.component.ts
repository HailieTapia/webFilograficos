import { Component } from '@angular/core';
import { EmpresaService } from '../services/empresaService';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  companyInfo: any = null;

  constructor( private empresaService: EmpresaService) { }
  ngOnInit(): void {
    this.getCompanyInfo();
  }
  // Obtener la información de la empresa
  getCompanyInfo(): void {
    this.empresaService.getCompanyInfo().subscribe(
      (data) => {
        this.companyInfo = data.company;
      },
      (error) => {
        console.error('Error al obtener información de la empresa:', error);
      }
    );
  }
}
