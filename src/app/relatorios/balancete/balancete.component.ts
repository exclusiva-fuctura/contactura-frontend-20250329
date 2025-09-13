import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
// libs
import moment from 'moment';
// Modules
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material/material.module';
// Services
import { MenuService } from '../../shared/services/menu.service';
import { LancamentosService } from '../../shared/services/lancamentos.service';
// Enums
import { MenuTypeEnum } from '../../shared/enums/menu-type.enum';
// Components
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { LogoutComponent } from '../../shared/components/logout/logout.component';
// Models
import { Lancamento } from '../../shared/models/lancamento';  
import { HttpStatusCode } from '@angular/common/http';
// Components
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';



@Component({
  selector: 'app-balancete',
  imports: [
    CommonModule, 
    MenuComponent,
    LogoutComponent,
    PaginatorComponent,
    MaterialModule, 
    SharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './balancete.component.html',
  styleUrl: './balancete.component.scss'
})
export class BalanceteComponent {

  dataSource: any[] = [];
  displayedColumns = ['qualificador','data','valor','tipo','fixo','descricao'];

  formulario!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private menuService: MenuService,
    private lancamentoService: LancamentosService
  ) {
    // notificar ao menu em qual componente estou
    this.menuService.ondeEstou = MenuTypeEnum.RELATORIO_BALANCETE;
    this.listarLancamentos();
    this.iniciarFormulario();
  }

  // obertem o valor total das despesas
  get valorTotal(): number {
    return this.dataSource.reduce((total: number, lancamento: Lancamento) => {
      const receita = lancamento.ehReceita ? lancamento.valor : 0;
      const despesa = !lancamento.ehReceita ? lancamento.valor : 0
      return total + (receita - despesa);
    }
    , 0);
  }

  /** 
   * carregar as lista de lancamentos (Recitas e Despesas)
   */
  private listarLancamentos(): void {
    this.lancamentoService.listarLancamentos().subscribe({
      next: (response) => {
        if (response.status === HttpStatusCode.Ok) {
          const lancamentos = response.body ? response.body : [];
          const {dataInicial, dataFinal} = this.formulario.value;
          this.dataSource = lancamentos.filter(lanc => 
            ( moment(lanc.data,'YYYY-MM-DD').isAfter(moment(dataInicial,'YYYY-MM-DD')) &&
              moment(lanc.data,'YYYY-MM-DD').isBefore(moment(dataFinal,'YYYY-MM-DD')) ) ||
            ( moment(lanc.data,'YYYY-MM-DD').isSame(moment(dataInicial,'YYYY-MM-DD')) ||
              moment(lanc.data,'YYYY-MM-DD').isSame(moment(dataFinal,'YYYY-MM-DD')) )              
          );
        }
      }
    });
  }

  private iniciarFormulario(): void {
    const finalMes = moment().endOf('month').format();
    const inicioMes = moment().startOf('month').format();
    this.formulario = this.formBuilder.group({
      dataInicial: inicioMes,
      dataFinal: finalMes
    });
  }  

  onPequisar(): void {
    this.listarLancamentos();
  }
}
