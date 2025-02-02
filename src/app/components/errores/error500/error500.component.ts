import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error500',
  standalone: true,
  imports: [],
  templateUrl: './error500.component.html',
  styleUrl: './error500.component.css'
})
export class Error500Component {
  constructor(private router: Router) {}

  // Método para redirigir al inicio
  goHome(): void {
    this.router.navigate(['/homecliente']);
  }
}
