import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControlDeIngresosComponent } from './pages/control-de-ingresos/control-de-ingresos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { TallerComponent } from './pages/taller/taller.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { ModalComponent } from './shared/modal/modal.component';
@NgModule({
  declarations: [
    AppComponent,
    ControlDeIngresosComponent,
    PerfilComponent,
    TallerComponent,
    SidebarComponent,
    FooterComponent,
    LoginComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
