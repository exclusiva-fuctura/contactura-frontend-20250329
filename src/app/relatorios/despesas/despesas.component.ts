import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
// libs
import moment from 'moment';
import Swal from 'sweetalert2';
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
import { IDespesa } from '../../shared/models/despesa.interface';

@Component({
  selector: 'app-despesas',
  imports: [
    CommonModule, 
    MenuComponent,
    MaterialModule, 
    LogoutComponent,
    SharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './despesas.component.html',
  styleUrl: './despesas.component.scss'
})
export class DespesasComponent {

  dataSource: any[] = [];
  displayedColumns = ['data','valor','tipo','fixo','descricao','acoes'];

  formulario!: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private menuService: MenuService,
    private lancamentoService: LancamentosService
  ) {
    // notificar ao menu em qual componente estou
    this.menuService.ondeEstou = MenuTypeEnum.RELATORIO_DESPESA;
    this.listarLancamentos();
    this.iniciarFormulario();
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
          this.dataSource = lancamentos.filter(lanc => lanc.ehReceita === false && (
            ( moment(lanc.data,'YYYY-MM-DD').isBefore(moment(dataInicial,'YYYY-MM-DD')) &&
              moment(lanc.data,'YYYY-MM-DD').isAfter(moment(dataFinal,'YYYY-MM-DD')) ) ||
            ( moment(lanc.data,'YYYY-MM-DD').isSame(moment(dataInicial,'YYYY-MM-DD')) ||
              moment(lanc.data,'YYYY-MM-DD').isSame(moment(dataFinal,'YYYY-MM-DD')) )
            )  
          );
        }
      }
    });
  }

  private iniciarFormulario(): void {
    const hoje = moment().format();
    this.formulario = this.formBuilder.group({
      dataInicial: hoje,
      dataFinal: hoje
    });
  }

  // obertem o valor total das despesas
  get valorTotal(): number {
    return this.dataSource.reduce((total: number, lancamento: Lancamento) => {
      return total + lancamento.valor;
    }
    , 0);
  }

  private remover(id: number): void {    
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
  onDelete(despesa: IDespesa): void {
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
          this.remover(id);
        }
      });
    }
  }

  /**
   * Método que responde a um evento para editar a despesa
   * @param item instancia do objeto lancamento
   */
  onEdit(item: Lancamento): void {
    if(item) {
      this.lancamentoService.modoEdicao = true;
      // this.lancamentoService.sendSelecionada(lancamento);
      this.lancamentoService.gravaLancamentoSelecionado(item);
      this.router.navigate(['lancamentos/despesa/'+item.id]);
    }
  }

  onPequisar(): void {
    this.listarLancamentos();
  }
}
