import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error400',
  standalone: true,
  imports: [],
  templateUrl: './error400.component.html',
  styleUrl: './error400.component.css'
})
export class Error400Component {

  constructor(private router: Router) {}

  // Método para redirigir al inicio
  goHome(): void {
    this.router.navigate(['/homecliente']);
  }
}