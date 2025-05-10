import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { LogoutComponent } from '../../shared/components/logout/logout.component';

@Component({
  selector: 'app-despesas',
  imports: [
    MenuComponent,
    LogoutComponent,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './despesas.component.html',
  styleUrl: './despesas.component.scss'
})
export class DespesasComponent {

  formulario!: FormGroup;
}
