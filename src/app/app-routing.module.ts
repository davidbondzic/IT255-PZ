import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component'; 
import { RegistracijaComponent } from './registracija/registracija.component'; 
import { PregledComponent } from './pregled/pregled.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { UserPanelComponent } from './user-panel/user-panel.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'registracija', component: RegistracijaComponent },
  { path: 'pregled', component: PregledComponent },
  { path: 'user-panel', component: UserPanelComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
