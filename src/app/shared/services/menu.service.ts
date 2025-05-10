import { Injectable } from '@angular/core';
import { MenuTypeEnum } from '../enums/menu-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private paginaAtual = MenuTypeEnum.DASHBOARD;

  constructor() { }

  get ondeEstou(): MenuTypeEnum {
    return this.paginaAtual;
  }

  set ondeEstou(valor:MenuTypeEnum) {
    this.paginaAtual = valor;
  }
}
