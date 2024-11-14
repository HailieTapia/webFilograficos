import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EmpresaService } from '../services/empresaService';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [MatMenuModule, CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatSlideToggleModule,]
})
export class HeaderComponent implements OnInit {
  tipoUsuario: string | null = null;
  isDarkTheme = false;
  companyInfo: any = null;
  isMenuOpen = false;
  logoPreview: string | ArrayBuffer | null = null;
  constructor(private authService: AuthService, private router: Router, private empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.getCompanyInfo();
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.tipoUsuario = user.tipo;
      } else {
        this.tipoUsuario = null;
      }
    });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    const body = document.body;
    if (this.isDarkTheme) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }
  // Obtener la información de la empresa
  getCompanyInfo(): void {
    this.empresaService.getCompanyInfo().subscribe(
      (data) => {
        this.companyInfo = data.company;
        // Si ya hay un logo, establecer la vista previa
        if (this.companyInfo.logo) {
          this.logoPreview = this.companyInfo.logo; // Asumiendo que 'logo' es una URL
        }
      },
      (error) => {
        console.error('Error al obtener información de la empresa:', error);
      }
    );
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Sesión cerrada exitosamente');
        // Redirige al usuario a la página de inicio o login
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      },
    });
  }
}