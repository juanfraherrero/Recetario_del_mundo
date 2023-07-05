import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) { }

  getDatos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recipes`);
  }

  // getRecetasPais(pais:string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/recipes/${pais}`);
  // }

  // postDatos(datos: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/datos`, datos);
  // }
}