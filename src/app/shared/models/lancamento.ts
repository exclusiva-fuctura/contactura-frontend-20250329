import { IDespesa } from "./despesa.interface";
import { IReceita } from "./receita.interface";

export class Lancamento {
  id?: number;
  data: string;
  descricao: string;
  ehFixo: boolean;
  ehReceita: boolean;
  mensagem?: string;
  tipo: string;
  valor: number;

  constructor(lancamento:IDespesa | IReceita, isReceita: boolean) {
    this.data = lancamento.data;
    this.descricao = lancamento.descricao;
    this.ehFixo = lancamento.ehFixo;
    this.tipo = lancamento.tipo;
    this.valor = lancamento.valor;
    this.ehReceita = isReceita;
    
    if (lancamento.id) this.id = lancamento.id;
  }

}