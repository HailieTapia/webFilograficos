import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import SHA1 from 'jssha'; // Importación corregida

@Injectable({
  providedIn: 'root'
})
export class PwnedService {

  private apiUrl = 'https://api.pwnedpasswords.com/range/';

  constructor(private http: HttpClient) {}

  checkPassword(password: string): Observable<string> {
    const sha1Hash = this.sha1(password);
    const prefix = sha1Hash.substring(0, 5); // Los primeros 5 caracteres del hash
    const suffix = sha1Hash.substring(5).toUpperCase(); // El resto del hash

    return this.http.get(`${this.apiUrl}${prefix}`, {
      headers: new HttpHeaders({
        'User-Agent': 'Angular-App'
      }),
      responseType: 'text' // API devuelve texto
    });
  }

  // Método para calcular SHA-1 usando jsSHA correctamente
  public sha1(value: string): string {
    const shaObj = new SHA1('SHA-1', 'TEXT'); // Crear instancia con 'SHA-1' como tipo de algoritmo
    shaObj.update(value); // Actualizamos con el valor a hashear
    return shaObj.getHash('HEX'); // Obtener el hash en formato hexadecimal
  }
}
