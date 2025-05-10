import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MenuService } from '../../shared/services/menu.service';
import { MenuTypeEnum } from '../../shared/enums/menu-type.enum';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { LogoutComponent } from '../../shared/components/logout/logout.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-receitas',
  imports: [
    MaterialModule, 
    CommonModule, 
    MenuComponent,
    ReactiveFormsModule,
    LogoutComponent],
  templateUrl: './receitas.component.html',
  styleUrl: './receitas.component.scss'
})
export class ReceitasComponent {
  dataSource: any[] = [];
  displayedColumns = ['data','valor','tipo','fixo','descricao','acoes'];

  formulario!: FormGroup;

  constructor(
    private menuService: MenuService
  ) {
    // notificar ao menu em qual componente estou
    this.menuService.ondeEstou = MenuTypeEnum.RELATORIO_RECEITA;
   }
}
