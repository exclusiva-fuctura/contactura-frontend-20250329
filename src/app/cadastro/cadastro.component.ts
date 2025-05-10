import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '../shared/components/menu/menu.component';
import { LogoutComponent } from '../shared/components/logout/logout.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  imports: [
    CommonModule,
    MenuComponent,
    LogoutComponent,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {

  formulario!: FormGroup;
}
