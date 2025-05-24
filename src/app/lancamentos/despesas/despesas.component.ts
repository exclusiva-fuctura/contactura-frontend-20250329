import { Component} from '@angular/core';
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
import { IDespesa } from '../../shared/models/despesa.interface';
import { Lancamento } from '../../shared/models/lancamento';
// Directives
import { DinheiroDirective } from '../../shared/directives/dinheiro.directive';
import { MaiusculoDirective } from '../../shared/directives/maiusculo.directive';
// Functions
import convertToValueDB from '../../shared/functions/convert-value-db.function';
import convertToDateDB from '../../shared/functions/convert-date-db.function';

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
export class DespesasComponent {
  private idEdicao = 0;
  
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
    // formata o valor para 9 digitos com 2 casas decimais
    // exe: 0000000.00
    despesa.valor = convertToValueDB(despesa.valor);
    // converte a data para o formato do banco de dados
    // exe: 2023-10-01
    despesa.data = convertToDateDB(despesa.data);

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
