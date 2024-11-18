import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../services/empresaService';
import { EmpresaStateService } from '../services/EmpresaStateService';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  companyInfo: any = null;

  constructor(
    private empresaStateService: EmpresaStateService,
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
    this.empresaStateService.getCompanyInfo().subscribe({
      next: (company) => {
        this.companyInfo = company;
      },
      error: (error) => {
        console.error('Error al obtener información de la empresa:', error);
      }
    });
    this.getCompanyInfo();
  }
  // Obtener la información de la empresa 
  getCompanyInfo(): void {
    this.empresaService.getCompanyInfo().subscribe({
      next: (data) => {
        this.empresaStateService.setCompanyInfo(data.company);
      },
      error: (error) => {
        console.error('Error al obtener información de la empresa:', error);
      }
    });
  }
}
