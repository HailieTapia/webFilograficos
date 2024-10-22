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
import { UserService } from '../services/user.service'; // Importa el servicio

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule,RouterModule,MatToolbarModule,MatButtonModule,MatSidenavModule,MatIconModule,MatListModule,MatSlideToggleModule, ]
})
export class HeaderComponent implements OnInit {
  tipoUsuario: string | null = null;  
  isDarkTheme = false; 

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.tipoUsuario$.subscribe(tipoUsuario => {
      this.tipoUsuario = tipoUsuario;
    });
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

  logout(): void {
    this.userService.clearTipoUsuario();
    this.router.navigate(['/login']);
  }
 }
