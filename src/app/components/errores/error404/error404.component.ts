import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error404',
  standalone: true,
  imports: [],
  templateUrl: './error404.component.html',
  styleUrl: './error404.component.css'
})
export class Error404Component {
  constructor(private router: Router) {}

  // Método para redirigir al inicio
  goHome(): void {
    this.router.navigate(['/homecliente']);
  }
}
