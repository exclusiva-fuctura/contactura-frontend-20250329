import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { LogoutComponent } from '../../shared/components/logout/logout.component';

import { ActivatedRoute } from '@angular/router';
import { MenuTypeEnum } from '../../shared/enums/menu-type.enum';
import { MenuService } from '../../shared/services/menu.service';
import { LancamentosService } from '../../shared/services/lancamentos.service';
import { IDespesa } from '../../shared/models/despesa.interface';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { DinheiroDirective } from '../../shared/directives/dinheiro.directive';
import { MaiusculoDirective } from '../../shared/directives/maiusculo.directive';
import Swal from 'sweetalert2';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { Lancamento } from '../../shared/models/lancamento';
import { Subscription } from 'rxjs';
import { padLeft } from '../../shared/functions/pad-left.function';

@Component({
  selector: 'app-despesas',
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
  templateUrl: './despesas.component.html',
  styleUrl: './despesas.component.scss'
})
export class DespesasComponent implements OnDestroy {
  private idEdicao = 0;
  
  private dataSubscription: Subscription | undefined;

  formulario!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private menuService: MenuService,
    private lancamentosService: LancamentosService,
    private activeRouter: ActivatedRoute
  ){
    this.menuService.ondeEstou = MenuTypeEnum.LANCAMENTO_DESPESA;
    this.iniciarFormulario();

    const id = this.activeRouter.snapshot.params['id'];
    if (id) {
      this.idEdicao = id;
      this.verificarModoEdicao();
    } else {
      this.lancamentosService.modoEdicao = false;
    }
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  get buttonLabel(): string {
    return this.lancamentosService.modoEdicao ? 'Editar' : 'Salvar';
  }

  get tipos(): string[] {
    return ['Alimentação', 'Habitação', 'Transporte', 'Educação', 'Lazer', 'Viagem'];
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
   * Carregar o formulario com os dados da despesa
   * @param despesa instacia da despesa
   */
  private carregarFormulario(despesa: Lancamento): void {
    if (despesa) {
      const valor = new Intl.NumberFormat('pt-BR', {minimumFractionDigits: 2}).format(despesa.valor);
      this.formulario.patchValue({
        tipo: despesa.tipo,
        data: despesa.data,
        ehFixo: despesa.ehFixo,
        descricao: despesa.descricao,
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
   * Salvar a instancia da despesa
   * @param despesa objeto instanciado
   */
  private salvar(despesa: IDespesa): void {
    this.lancamentosService.criarLancamento(new Lancamento(despesa, false)).subscribe({
      next: (response) => {
        const lancamentoGravado = response.body;
        Swal.fire({
          title: "SUCESSO: Criar Despesa",
          text: "Despesa criada com sucesso. Código: " + lancamentoGravado?.id,
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
          title: "ALERTA: Criar Despesa",
          text: err.error.mensagem ? err.error.mensagem : 'Ocorreu um erro inesperadao. [' + msg + ']',
          icon: "warning"
        });
      }
    });
  }

  /**
   * Atualiza a instância da despesa
   * @param despesa objeto instanciado
   */
  private atualizar(despesa: IDespesa): void {
    despesa.id = +this.idEdicao;
    this.lancamentosService.atualizarLancamento(new Lancamento(despesa, false)).subscribe({
      next: (response) => {
        const lancamentoGravado = response.body;
        Swal.fire({
          title: "SUCESSO: Editar Despesa",
          text: "Despesa criada com sucesso. Código: " + lancamentoGravado?.id,
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
          title: "ALERTA: Editar Despesa",
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
    const despesa: IDespesa = this.formulario.value;
    // remove as virgulas e epontos
    despesa.valor = +(despesa.valor.toString().replace('.','').replace(',', ''));
    // formata o valor para 9 digitos com 2 casas decimais
    // exe: 0000000.00
    despesa.valor = +padLeft(despesa.valor.toString(),9,'0').replace(/(\d{7})(\d{2})/g,"\$1.\$2");
    despesa.data = moment(despesa.data).format('YYYY-MM-DD');

    if (this.lancamentosService.modoEdicao) {
      this.atualizar(despesa);
    } else {
      this.salvar(despesa);
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
