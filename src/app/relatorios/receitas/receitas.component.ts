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
import { IReceita } from '../../shared/models/receita.interface';

@Component({
  selector: 'app-receitas',
  imports: [
    CommonModule, 
    MenuComponent,
    MaterialModule, 
    LogoutComponent,
    SharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './receitas.component.html',
  styleUrl: './receitas.component.scss'
})
export class ReceitasComponent {
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
    this.menuService.ondeEstou = MenuTypeEnum.RELATORIO_RECEITA;
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
          const {data} = this.formulario.value;
          this.dataSource = lancamentos.filter(lanc => lanc.ehReceita === false && moment(data).format('YYYY-MM-DD') === lanc.data);
        }
      }
    });
  }

  private iniciarFormulario(): void {
    const hoje = moment().format();
    this.formulario = this.formBuilder.group({
      data: hoje
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
   * Método que responde a um evento para remover a receita da base
   * @param receita instancia do objeto receita
   */
  onDelete(receita: IReceita): void {
    if(receita) {
      Swal.fire({
        title: 'Remover Receita',
        text: `Deseja remover a despesa '${receita.descricao.toUpperCase()}' ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, remova!'
      }).then((resultado) => {
        if (resultado.isConfirmed) {
          const id = receita.id ? receita.id : 0;
          this.remover(id);
        }
      });
    }
  }

  /**
   * Método que responde a um evento para editar a receita
   * @param item instancia do objeto lancamento
   */
  onEdit(item: Lancamento): void {
    if(item) {
      this.lancamentoService.modoEdicao = true;
      this.lancamentoService.gravaLancamentoSelecionado(item);
      this.router.navigate(['lancamentos/receita/'+item.id]);
    }
  }

  onPequisar(): void {
    this.listarLancamentos();
  }  
}
