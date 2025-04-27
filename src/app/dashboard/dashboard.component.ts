import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { MenuTypeEnum } from '../shared/enums/menu-type.enum';

@Component({
  selector: 'app-dashboard',
  imports: [MaterialModule],
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
}
