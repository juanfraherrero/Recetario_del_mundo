import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/main/app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaisComponent } from './components/pais/pais.component';
import { AppRoutingModule } from './app-routing.module';
import { RecetaComponent } from './components/receta/receta.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { updateComponent } from './components/update/update.component';
import { FooterComponent } from './components/footer/footer.component';
import { PaisesComponent } from './components/paises/paises.component';
import { RecetasComponent } from './components/recetas/recetas.component';
import { InfoRecetaComponent } from './components/info-receta/info-receta.component';
import { HttpErrorInteceptor } from './error.interceptor';
import { SelectRecetaComponent } from './components/selectReceta/selectReceta.component';
import { WorldBgComponent } from './components/world-bg/world-bg.component';
import { PersonaComponent } from './components/footer/persona/persona.component';
import { infoIngrComponent } from './components/info-ingr/info-ingr.component';
import { AutoResizeDirective } from './autoResizeTextarea'

@NgModule({
  declarations: [
    AppComponent,
    PaisComponent,
    RecetaComponent,
    HeaderBarComponent,
    updateComponent,
    FooterComponent,
    PaisesComponent,
    RecetasComponent,
    InfoRecetaComponent,
    WorldBgComponent,
    PersonaComponent,
    SelectRecetaComponent,
    infoIngrComponent,
    AutoResizeDirective
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInteceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
