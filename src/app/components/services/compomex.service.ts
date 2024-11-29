import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root', 
  })
  export class CopomexService {
    private baseUrl = 'https://api.copomex.com/query';
    private token = '546aa990-8984-4ae7-bd96-8accbb6efd4b'; 
  
    constructor(private http: HttpClient) {}
  
    getEstados(): Observable<any> {
      const url = `${this.baseUrl}/get_estados`;
      const params = new HttpParams().set('token', this.token);
      return this.http.get(url, { params });
      
    }
  
    getCpPorEstado(estado: string): Observable<any> {
      const url = `${this.baseUrl}/get_cp_por_estado/${estado}`;
      const params = new HttpParams().set('token', this.token);
      return this.http.get(url, { params });
    }
  }
  