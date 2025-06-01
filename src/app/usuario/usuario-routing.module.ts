import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditarComponent } from './editar/editar.component';
import { AlterarSenhaComponent } from './alterar-senha/alterar-senha.component';

const routes: Routes = [
  { path: 'alterar-senha', component: AlterarSenhaComponent },
  { path: 'editar', component: EditarComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
