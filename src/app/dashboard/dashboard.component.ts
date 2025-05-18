import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
// Services
import { MenuService } from '../shared/services/menu.service';
import { LancamentosService } from '../shared/services/lancamentos.service';
// Enums
import { MenuTypeEnum } from '../shared/enums/menu-type.enum';
// Models
import { IDespesa } from '../shared/models/despesa.interface';
import { IReceita } from '../shared/models/receita.interface';
import { Lancamento } from '../shared/models/lancamento';
// Components
import { MenuComponent } from '../shared/components/menu/menu.component';
import { LogoutComponent } from '../shared/components/logout/logout.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


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

  dataSourceDespesas: Lancamento[] = [];
  dataSourceReceitas: Lancamento[] = [];
  displayedColumns = ['data','valor','tipo','fixo','descricao','acoes'];
  
  constructor(
    private router: Router,
    private menuService: MenuService,
    private lancamentoService: LancamentosService
  ) {
    this.menuService.ondeEstou = MenuTypeEnum.DASHBOARD;
    this.listarLancamentos();
  }

  /** 
   * carregar as lista de lancamentos (Recitas e Despesas)
   */
  private listarLancamentos(): void {
    this.lancamentoService.listarLancamentos().subscribe({
      next: (response) => {
        if (response.status === HttpStatusCode.Ok) {
          const lancamentos = response.body ? response.body : [];
          // despesas
          this.dataSourceDespesas = lancamentos.filter(lanc => lanc.ehReceita === false).slice(0,5);
          // receitas
          this.dataSourceReceitas = lancamentos.filter(lanc => lanc.ehReceita === true).slice(0,5);
        }
      }
    });
  }

  private removerDespesa(id: number): void {    
    this.lancamentoService.removerLancamento(id).subscribe({
      next: (response) => {
        if (response.status === HttpStatusCode.Ok) {
          Swal.fire(
            'SUCESSO: Remover Despesa',
            'Despesa removida com sucesso',
            'success'
          )
        }
      },
      error: (err) => {
        Swal.fire(
          'ALERTA: Remover Despesa',
          err.error.mensagem ? err.error.mensagem : 'Ocorrer um erro inesperado. ['+ err.error.error +']',
          'warning'
        )
      }
    });
  }

  /**
   * Método que responde a um evento para remover a despesa da base
   * @param despesa instancia do objeto despesa
   */
  onDeleteDespesa(despesa: IDespesa): void {
    if(despesa) {
      Swal.fire({
        title: 'Remover Despesa',
        text: `Deseja remover a despesa '${despesa.descricao.toUpperCase()}' ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, remova!'
      }).then((resultado) => {
        if (resultado.isConfirmed) {
          const id = despesa.id ? despesa.id : 0;
          this.removerDespesa(id);
        }
      });
    }
  }

  /**
   * Método que responde a um evento para editar a despesa
   * @param item instancia do objeto lancamento
   */
  onEditDespesa(item: Lancamento): void {
    if(item) {
      this.lancamentoService.modoEdicao = true;
      // this.lancamentoService.sendSelecionada(lancamento);
      this.lancamentoService.gravaLancamentoSelecionado(item);
      this.router.navigate(['lancamentos/despesa/'+item.id]);
    }
  }

  /**
   * Método que responde a um evento para remover a receita
   * @param despesa instancia do objeto receita
   */
  onDeleteReceita(receita: IReceita): void {

  }

  /**
   * Método que responde a um evento para editar a receita
   * @param despesa instancia do objeto receita
   */  
  onEditReceita(receita: IReceita): void {

  }
}
