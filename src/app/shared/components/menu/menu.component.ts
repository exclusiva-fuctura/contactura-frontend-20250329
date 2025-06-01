import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { MenuTypeEnum } from '../../enums/menu-type.enum';
import { SharedModule } from '../../shared.module';
import { MaterialModule } from '../../../material/material.module';


@Component({
  selector: 'app-menu',
  imports: [MaterialModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  constructor(
    private router: Router,
    private menuService: MenuService
  ) {}

  get estouDashboard(): boolean {
    return this.menuService.ondeEstou === MenuTypeEnum.DASHBOARD;
  }

  get estouRelatorioReceita(): boolean {
    return this.menuService.ondeEstou === MenuTypeEnum.RELATORIO_RECEITA;
  }

  get estouRelatorioDespesa(): boolean {
    return this.menuService.ondeEstou === MenuTypeEnum.RELATORIO_DESPESA;
  }

  get estouLancamentoReceita(): boolean {
    return this.menuService.ondeEstou === MenuTypeEnum.LANCAMENTO_RECEITA;
  }

  get estouLancamentoDespesa(): boolean {
    return this.menuService.ondeEstou === MenuTypeEnum.LANCAMENTO_DESPESA;
  }

  get estouAlterarSenha(): boolean {
    return this.menuService.ondeEstou === MenuTypeEnum.ALTERAR_SENHA;
  }

  get estouEditarUsuario(): boolean {
    return this.menuService.ondeEstou === MenuTypeEnum.EDITAR_USUARIO;
  }
  
  onNavigate(valor: string): void {
    this.router.navigate([valor]);
  }
}
