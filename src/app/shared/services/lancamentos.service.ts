import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// libs
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import CryptoJS from 'crypto-js';
// Services
import { DaoService } from './dao.service';
// Models
import { IDespesa } from '../models/despesa.interface';
import { Lancamento } from '../models/lancamento';
// Enums
import { OperacaoTypeEnum } from '../enums/operacao-type.enum';
// Constants
import { AppSettings } from '../../app.settings';
import { IReceita } from '../models/receita.interface';


@Injectable({
  providedIn: 'root'
})
export class LancamentosService {

  chaveStorage = 'selecionado';

  constructor(
    private daoService: DaoService
  ) { }

  get modoEdicao(): boolean {
    return (sessionStorage.getItem('modoEdicao') === OperacaoTypeEnum.EDITAR);
  }

  set modoEdicao(ehEdicao: boolean) {
    if (ehEdicao) {
      sessionStorage.setItem('modoEdicao', OperacaoTypeEnum.EDITAR);
    } else {
      sessionStorage.setItem('modoEdicao', OperacaoTypeEnum.SALVAR);
    }
  }

  /**
   * Grava no sessionStorage(banco de dados(chave/valor) do navegdor) o lancamento selecionado
   * @param lancamento instancia de um lancamento
   * @returns retorna objeto lancamento selecionada
   */
  gravaLancamentoSelecionado(lancamento: Lancamento): void {
    if (lancamento) {
      const lancamentoString = JSON.stringify(lancamento);
      sessionStorage.setItem(this.chaveStorage, lancamentoString);
    }
  }

  /**
   * Recupera o lancamento selecionado do sessionStorage(banco de dados(chave/valor) do navegdor)
   * @returns retorna objeto lancamento selecionada
   */
  recuperaLancamentoSelecionado(): Lancamento {
    const lancamentoString = sessionStorage.getItem(this.chaveStorage);
    if (!lancamentoString) {
      return null as unknown as Lancamento;
    }
    const recuperado = JSON.parse(lancamentoString);
    return recuperado as Lancamento;
  }

  private lancamnetotoDespesa(lancamento: Lancamento): IDespesa {
    return {
      id: lancamento.id,
      data: lancamento.data,
      descricao: lancamento.descricao,
      ehFixo: lancamento.ehFixo,
      tipo: lancamento.tipo,
      valor: lancamento.valor
    }
  }

  private lancamentoToReceita(lancamento: Lancamento): IReceita {
    return {
      id: lancamento.id,
      data: lancamento.data,
      descricao: lancamento.descricao,
      ehFixo: lancamento.ehFixo,
      tipo: lancamento.tipo,
      valor: lancamento.valor
    }
  }

  extractTypeLancamento(lancamento: Lancamento): IDespesa | IReceita {
    if (lancamento.ehReceita) {
      return this.lancamentoToReceita(lancamento);
    } else {
      return this.lancamnetotoDespesa(lancamento);
    }
  }

  /**
   * Converte uma receita para um lancamento
   * @param objeto instancia de um objeto receita
   * @returns retorna uma instancia de um lancamento
   */
  receitaToLancamento(objeto: IReceita): Lancamento {    
    return new Lancamento(objeto, true);
  }

  /**
   * Converte uma despesa para um lancamento
   * @param objeto instancia de um objeto despesa
   * @returns retorna uma instancia de um lancamento
   */
  despesaToLancamento(objeto: IDespesa): Lancamento {
    return new Lancamento(objeto, false);
  }

  /**
   * 
   * @returns Listar lancamentos existentes
   */
  listarLancamentos(): Observable<HttpResponse<Lancamento[]>> {
    return this.daoService.get<Lancamento[]>(AppSettings.LANCAMENTO_URL, DaoService.MEDIA_TYPE_APP_JSON);
  }

  /**
   * Criar uma nov0 lancamento
   * @param lancamento instancia de um lancamento
   * @return retorna objeto lancamento criada
   */
  criarLancamento(lancamento: Lancamento): Observable<HttpResponse<Lancamento>> {
    return this.daoService.post<Lancamento>(AppSettings.LANCAMENTO_URL, lancamento, DaoService.MEDIA_TYPE_APP_JSON);
  }

  /**
   * Atualiza um lancamento existente na base
   * @param lancamento instancia de um lancamento
   * @returns retorna objeto lancamento alterada
   */
  atualizarLancamento(lancamento: Lancamento): Observable<HttpResponse<Lancamento>> {
    return this.daoService.put<Lancamento>(`${AppSettings.LANCAMENTO_URL}/${lancamento.id}`, lancamento, DaoService.MEDIA_TYPE_APP_JSON);
  }

  /**
   * Recupera os dados de um Lancamento
   * @param id identificador do lancamento
   * @returns retorna objeto lancamento existente
   */
  obterLancamento(id:number): Observable<HttpResponse<Lancamento>>{
    return this.daoService.get<Lancamento>(`${AppSettings.LANCAMENTO_URL}/${id}`, DaoService.MEDIA_TYPE_APP_JSON);
  }

  /**
   * Remove lancamento da base
   * @param id identificador do lancamento
   * @returns retorna objeto lancamento excluido
   */
  removerLancamento(id: number): Observable<HttpResponse<Lancamento>> {
    return this.daoService.delete<Lancamento>(`${AppSettings.LANCAMENTO_URL}/${id}`, DaoService.MEDIA_TYPE_APP_JSON);
  }

}
