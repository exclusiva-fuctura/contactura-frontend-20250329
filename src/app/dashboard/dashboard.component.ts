import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { MenuTypeEnum } from '../shared/enums/menu-type.enum';
import { MenuService } from '../shared/services/menu.service';
import { CommonModule } from '@angular/common';
import { IDespesa } from '../shared/models/despesa.interface';
import { IReceita } from '../shared/models/receita.interface';
import { MenuComponent } from '../shared/components/menu/menu.component';
import { LogoutComponent } from '../shared/components/logout/logout.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    MenuComponent,
    LogoutComponent,
    MaterialModule, 
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  dataSourceDespesas: any[] = [];
  dataSourceReceitas: any[] = [];
  displayedColumns = ['data','valor','tipo','fixo','descricao','acoes'];
  
  constructor(
    private menuService: MenuService,
  ) {
    this.menuService.ondeEstou = MenuTypeEnum.DASHBOARD;
  }

  onDeleteDespesa(despesa: IDespesa): void {

  }

  onEditDespesa(despesa: IDespesa): void {

  }

  onDeleteReceita(receita: IReceita): void {

  }

  onEditReceita(receita: IReceita): void {

  }
}
