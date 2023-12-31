import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ActivatedRoute,Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import Recipe from '../../interfaces/recipe';
import Ingredient from 'src/app/interfaces/ingredient';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})


export class updateComponent implements OnInit {
    pais:string = '';
    nombreReceta : string = '';
    receta: Recipe = {} as Recipe;
    submitted: boolean = false;
    formUpdate: FormGroup = new FormGroup({
      nombre: new FormControl('', Validators.required),
      descripcion: new FormArray([], [Validators.required]),
      imagen: new FormControl(''),
      ingredientes: new FormArray<FormGroup>([], [Validators.required]),
      preparacion: new FormArray([], [Validators.required]),
      consejos: new FormArray([])
    })

    constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private location: Location,
      private http: HttpClient) {}
    
    ngOnInit(): void {
      this.pais = this.route.snapshot.params["pais"];       //Obtengo el pais de la ruta
      this.nombreReceta = this.route.snapshot.params["receta"];   //Obtengo la receta de la ruta

      this.apiService.getReceta(this.pais, this.nombreReceta).subscribe( (response: Recipe) => {
        this.receta = response;
        this.formUpdate.patchValue({
          nombre: this.receta.nombre
        });
        this.receta.descripcion.forEach(parrafo => this.descripcion.push(new FormControl(parrafo, Validators.required)))
        this.receta.ingredientes.forEach(ingrediente => this.ingredientes.push(new FormGroup({nombre: new FormControl(ingrediente.nombre), cantidad: new FormControl(ingrediente.cantidad), opcional: new FormControl(ingrediente.opcional)})))
        this.receta.preparacion.forEach(parrafo => this.preparacion.push(new FormControl(parrafo, Validators.required)))
        this.receta.consejos.forEach(parrafo => this.consejos.push(new FormControl(parrafo, Validators.required)))
      })
    }

    // Getters de los array del form

    get descripcion(){
      return this.formUpdate.get('descripcion') as FormArray;
    }

    get ingredientes(){
      return this.formUpdate.get('ingredientes') as FormArray<FormGroup>;
    }

    get preparacion(){
      return this.formUpdate.get('preparacion') as FormArray;
    }

    get consejos(){
      return this.formUpdate.get('consejos') as FormArray;
    }

    // Creacion y eliminacion de parrafos e Ingredientes

    crearParrafo(atributo: string){
      if (atributo === "descripcion"){
        this.descripcion.push(new FormControl('', Validators.required));
      } else if (atributo === "preparacion"){
        this.preparacion.push(new FormControl('', Validators.required));
      } else {
        this.consejos.push(new FormControl('', Validators.required));
      }
    }

    eliminarParrafo(atributo: string): void{
      if (atributo === "descripcion"){
        this.descripcion.removeAt(this.descripcion.length-1);
      } else if (atributo === "preparacion"){
        this.preparacion.removeAt(this.preparacion.length-1);
      } else {
        this.consejos.removeAt(this.consejos.length-1);
      }
    }

    crearIngr(){
      const nuevoIngrediente = new FormGroup({nombre: new FormControl(''), cantidad: new FormControl(''), opcional: new FormControl(true)}); 
      this.ingredientes.push(nuevoIngrediente);
    }

    eliminarIngr(){
      this.ingredientes.removeAt(this.ingredientes.length-1);
    }

    // Metodos auxiliares

    comparacionDeTextos(arrayOriginal: string[], arrayForm: FormArray): boolean{
      if (arrayForm.length !== arrayOriginal.length){
        return true;
      }
      let i: number = 0;
      let cambio: boolean = false;
      while(i < arrayForm.length && ! cambio){
        if (arrayForm.at(i)['value'] !== arrayOriginal[i]){
          cambio = true;
        }
        i++;
      }
      return cambio;
    }

    compararIngredientes(): boolean{
      if (this.ingredientes.length !== this.receta.ingredientes.length){
        return true;
      }
      let i: number = 0;
      let cambio: boolean = false;
      while(i < this.ingredientes.length && ! cambio){
        if(this.ingredientes.at(i)['value'].nombre !== this.receta.ingredientes[i].nombre ||
          this.ingredientes.at(i)['value'].cantidad !== this.receta.ingredientes[i].cantidad ||
          this.ingredientes.at(i)['value'].opcional !== this.receta.ingredientes[i].opcional) {
            cambio = true;
        }
        i++;
      }
      return cambio;
    }

    verifyURLImagen(url: string): Promise<boolean>{
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    }

    // Funcion submit del formulario

    async actualizar(){
      if (this.formUpdate.valid){
        console.log('pase')
        let act : {
          nombre?: string,
          descripcion? : string[],
          imagen? : string,
          ingredientes? : Ingredient[],
          preparacion? : string[],
          consejos? : string[]
        } = {};
        let redireccion: string = this.nombreReceta
        let modificar:boolean = false;
        if (this.formUpdate.get('nombre')?.value !== this.receta.nombre){
          act.nombre = this.formUpdate.get('nombre')?.value;
          redireccion =  this.formUpdate.get('nombre')?.value;
          modificar = true; 
        }
        if (this.comparacionDeTextos(this.receta.descripcion, this.descripcion)){
          act.descripcion = this.formUpdate.get('descripcion')?.value;
          modificar = true;
        }
        if (this.compararIngredientes()){
          act.ingredientes = this.formUpdate.get('ingredientes')?.value;
          modificar = true;
        }
        if (this.formUpdate.get('imagen')?.value.length > 0){
          await this.verifyURLImagen(this.formUpdate.get('imagen')?.value).then((isValid) => {
            if (isValid){
              act.imagen = this.formUpdate.get('imagen')?.value;
              modificar = true;
            } else {
              return;
            }
          })
        }
        if (this.comparacionDeTextos(this.receta.preparacion, this.preparacion)){
          act.preparacion = this.formUpdate.get('preparacion')?.value;
          modificar = true;
        }
        if (this.comparacionDeTextos(this.receta.consejos, this.consejos)){
          act.consejos = this.formUpdate.get('consejos')?.value;
          modificar = true;
        }
        if (modificar) {
          this.apiService.updateReceta(this.pais, this.nombreReceta, act).subscribe((): void => {
              this.router.navigate(['/'+this.pais+'/'+redireccion]);
          });
        }
      } else {
        this.submitted = true;
      }
    }

    // Funcion volver

    goBack(){
      this.location.back();
    }
}