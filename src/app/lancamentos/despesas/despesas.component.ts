import { Component } from '@angular/core';
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

  private carregarFormulario(despesa: IDespesa): void {
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

  private verificarModoEdicao(): void {
    if(this.lancamentosService.modoEdicao) {
      const despesa = this.lancamentosService.despesaSelecionada;
      this.carregarFormulario(despesa);
    }
  }

  private salvar(despesa: IDespesa): void {
    this.lancamentosService.criarDespesa(despesa).subscribe({
      next: (response) => {
        const despesaGravada = response.body;
        Swal.fire({
          title: "SUCESSO: Criar Despesa",
          text: "Despesa criada com sucesso. Código: " + despesaGravada?.id,
          icon: "success"
        });
      },
      error: (err: HttpErrorResponse) => {
        let msg = err.error.error;
        if (err.status === HttpStatusCode.BadRequest && msg.includes('Bad Request')) {
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

  private atualizar(despesa: IDespesa): void {

  }

  onSalvar(): void {
    const despesa: IDespesa = this.formulario.value;
    despesa.valor = +(despesa.valor.toString().replace('.','').replace(',', '.'));
    despesa.data = moment(despesa.data).format('YYYY-MM-DD');

    if (this.lancamentosService.modoEdicao) {
      this.atualizar(despesa);
    } else {
      this.salvar(despesa);
    }
  }

  onLimpar(): void {
    this.formulario.reset();
    this.formulario.patchValue({
      data: moment().format(),
      ehFixo: false
    });
  }

}
