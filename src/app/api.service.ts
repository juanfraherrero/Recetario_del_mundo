import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


import Country from './interfaces/country';
import Recipe from './interfaces/recipe';
import resAPIRest from './interfaces/resAPIRest';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/recipes'; //definimos la url de la API

  private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        // Authorization: 'my-auth-token'
      })
    };

  constructor(private http: HttpClient) { }

  // devuelve los paises con direcciones a sus banderas
  getPaises(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/`)
  }

  // devuelve las recetas de un pais
  getRecetasPais(pais:string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/${pais}`)
  }

  // devuelve una receta de un pais
  getReceta(pais:string, receta:string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${pais}/${receta}`)
  }

  // elmimina una receta de el pais
  deleteReceta(pais:string, receta:string): Observable<resAPIRest> {
    return this.http.delete<resAPIRest>(`${this.apiUrl}/${pais}/${receta}`)
  }

  updateReceta(pais:string, receta:string, modificaciones: any): Observable<resAPIRest> {
    return this.http.put<resAPIRest>(`${this.apiUrl}/${pais}/${receta}`, modificaciones)
  }

  insertPais(pais: Country): Observable<resAPIRest> {
    return this.http.post<resAPIRest>(`${this.apiUrl}/`, pais);
  }

  insertReceta(pais: string, receta: Recipe): Observable<resAPIRest>{
    return this.http.post<resAPIRest>(`${this.apiUrl}/${pais}`, receta);
  }

}
