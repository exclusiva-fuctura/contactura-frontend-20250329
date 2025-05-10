import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { LogoutComponent } from '../../shared/components/logout/logout.component';

@Component({
  selector: 'app-receitas',
  imports: [
    MenuComponent,
    LogoutComponent,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './receitas.component.html',
  styleUrl: './receitas.component.scss'
})
export class ReceitasComponent {

  formulario!: FormGroup;
}
