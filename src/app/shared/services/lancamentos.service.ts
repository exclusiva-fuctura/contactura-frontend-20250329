import { Injectable } from '@angular/core';
import { IDespesa } from '../models/despesa.interface';
import { OperacaoTypeEnum } from '../enums/operacao-type.enum';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { DaoService } from './dao.service';
import { AppSettings } from '../../app.settings';
import { Lancamento } from '../models/lancamento';

@Injectable({
  providedIn: 'root'
})
export class LancamentosService {

  private _modoEdicao = OperacaoTypeEnum.SALVAR;
  private _despesaSelecionada!: IDespesa;

  constructor(
    private daoService: DaoService
  ) { }

  get modoEdicao(): boolean {
    return this._modoEdicao === OperacaoTypeEnum.EDITAR;
  }

  set modoEdicao(ehEdicao: boolean) {
    if (ehEdicao) {
      this._modoEdicao = OperacaoTypeEnum.EDITAR;
    } else {
      this._modoEdicao = OperacaoTypeEnum.SALVAR;
    }
  }

  get despesaSelecionada(): IDespesa {
    return this._despesaSelecionada;
  }

  set despesaSelecionada(value: IDespesa) {
    this._despesaSelecionada = value;
  }

  criarDespesa(despesa: IDespesa): Observable<HttpResponse<Lancamento>> {
    return this.daoService.post<Lancamento>(AppSettings.LANCAMENTO_URL,despesa,DaoService.MEDIA_TYPE_APP_JSON);
  }

  atualizarDespesa(despesa: IDespesa): Observable<HttpResponse<Lancamento>> {
    return this.daoService.put<Lancamento>(`${AppSettings.LANCAMENTO_URL}/${despesa.id}`, despesa, DaoService.MEDIA_TYPE_APP_JSON);
  }

}
