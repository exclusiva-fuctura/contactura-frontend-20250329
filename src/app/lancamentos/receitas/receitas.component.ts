import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
// libs
import moment from 'moment';
import Swal from 'sweetalert2';
// MOdule
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material/material.module';
// Components
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { LogoutComponent } from '../../shared/components/logout/logout.component';
// Enuns
import { MenuTypeEnum } from '../../shared/enums/menu-type.enum';
// Services
import { MenuService } from '../../shared/services/menu.service';
import { LancamentosService } from '../../shared/services/lancamentos.service';
// Models
import { IReceita } from '../../shared/models/receita.interface';
import { Lancamento } from '../../shared/models/lancamento';
// Directives
import { DinheiroDirective } from '../../shared/directives/dinheiro.directive';
import { MaiusculoDirective } from '../../shared/directives/maiusculo.directive';
// Functions
import convertToValueDB from '../../shared/functions/convert-value-db.function';
import convertToDateDB from '../../shared/functions/convert-date-db.function';

@Component({
  selector: 'app-receitas',
  imports: [
    MenuComponent,
    LogoutComponent,
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    MaiusculoDirective,
    DinheiroDirective,
    SharedModule
  ],
  templateUrl: './receitas.component.html',
  styleUrl: './receitas.component.scss'
})
export class ReceitasComponent {
  private idEdicao = 0;
  formulario!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private menuService: MenuService,
    private lancamentosService: LancamentosService,
    private activeRouter: ActivatedRoute
  ){
    this.menuService.ondeEstou = MenuTypeEnum.LANCAMENTO_RECEITA;
    this.iniciarFormulario();

    const id = this.activeRouter.snapshot.params['id'];
    if (id) {
      this.idEdicao = id;
      this.verificarModoEdicao();
    } else {
      this.lancamentosService.modoEdicao = false;
    }
  }

  get buttonLabel(): string {
    return this.lancamentosService.modoEdicao ? 'Editar' : 'Salvar';
  }

  get tipos(): string[] {
    return ['Salário', 'Benifícios', 'Prestação de Serviço', 'Vendas', 'Investimento', 'Doação', 'Aluguel', 'Emprestimos', 'Outros'];
  }

  /**
   * Iniciar criação do formulario
   */
  private iniciarFormulario(): void {
    const hoje = moment().format();
    this.formulario = this.formBuilder.group({
      tipo: ['', Validators.required],
      data: hoje,
      ehFixo: false,
      descricao: ['', Validators.required],
      valor: ['', Validators.required]
    });
  }

  /**
   * Carregar o formulario com os dados da receita
   * @param receita instacia da receita
   */
  private carregarFormulario(receita: Lancamento): void {
    if (receita) {
      const valor = new Intl.NumberFormat('pt-BR', {minimumFractionDigits: 2}).format(receita.valor);
      this.formulario.patchValue({
        tipo: receita.tipo,
        data: receita.data,
        ehFixo: receita.ehFixo,
        descricao: receita.descricao,
        valor: valor
      });
    }
  }

  /**
   * Verifica se está no modo edição
   */
  private verificarModoEdicao(): void {
    if(this.lancamentosService.modoEdicao) {
     
      this.carregarFormulario(this.lancamentosService.recuperaLancamentoSelecionado());
    }
  }

  /**
   * Salvar a instancia da receita
   * @param receita objeto instanciado
   */
  private salvar(receita: IReceita): void {
    this.lancamentosService.criarLancamento(new Lancamento(receita, true)).subscribe({
      next: (response) => {
        const lancamentoGravado = response.body;
        Swal.fire({
          title: "SUCESSO: Criar Receita",
          text: "Receita criada com sucesso. Código: " + lancamentoGravado?.id,
          icon: "success"
        });
        this.onLimpar();
      },
      error: (err: HttpErrorResponse) => {
        let msg = err.error.error;
        if (err.status === HttpStatusCode.BadRequest && msg?.includes('Bad Request')) {
          msg = 'Usuário não autenticado';
        }
        Swal.fire({
          title: "ALERTA: Criar Receita",
          text: err.error.mensagem ? err.error.mensagem : 'Ocorreu um erro inesperadao. [' + msg + ']',
          icon: "warning"
        });
      }
    });
  }

  /**
   * Atualiza a instância da despesa
   * @param receita objeto instanciado
   */
  private atualizar(receita: IReceita): void {
    receita.id = +this.idEdicao;
    this.lancamentosService.atualizarLancamento(new Lancamento(receita, true)).subscribe({
      next: (response) => {
        const lancamentoGravado = response.body;
        Swal.fire({
          title: "SUCESSO: Editar Receita",
          text: "Receita criada com sucesso. Código: " + lancamentoGravado?.id,
          icon: "success"
        });
        this.onLimpar();
      },
      error: (err: HttpErrorResponse) => {
        let msg = err.error.error;
        if (err.status === HttpStatusCode.BadRequest && msg?.includes('Bad Request')) {
          msg = 'Usuário não autenticado';
        }
        Swal.fire({
          title: "ALERTA: Editar Receita",
          text: err.error.mensagem ? err.error.mensagem : 'Ocorreu um erro inesperadao. [' + msg + ']',
          icon: "warning"
        });
      }
    });
  }

  /**
   * Metodo que respode ao evento para salvar
   */
  onSalvar(): void {
    const receita: IReceita = this.formulario.value;
    // formata o valor para 9 digitos com 2 casas decimais
    // exe: 0000000.00
    receita.valor = convertToValueDB(receita.valor);
    // converte a data para o formato do banco de dados
    // exe: 2023-10-01
    receita.data = convertToDateDB(receita.data);

    if (this.lancamentosService.modoEdicao) {
      this.atualizar(receita);
    } else {
      this.salvar(receita);
    }
  }

  /**
   * Método que responde ao evento de limpar
   */
  onLimpar(): void {
    this.formulario.reset();
    this.formulario.patchValue({
      data: moment().format(),
      ehFixo: false
    });
    // sair do módo edicao e limpar a despesa selecionada
    this.lancamentosService.modoEdicao = false;
    this.lancamentosService.limparLancamentoSelecionado();
  }  
}
