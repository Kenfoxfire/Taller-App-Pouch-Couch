import { TallerComponent } from './pages/taller/taller.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ControlDeIngresosComponent } from './pages/control-de-ingresos/control-de-ingresos.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'control', component: ControlDeIngresosComponent },
  { path: 'taller', component: TallerComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
