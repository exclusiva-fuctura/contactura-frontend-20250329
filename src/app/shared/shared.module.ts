import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaoService } from './services/dao.service';
import { DinheiroDirective } from './directives/dinheiro.directive';
import { MaiusculoDirective } from './directives/maiusculo.directive';
import { MenuTypeEnum } from './enums/menu-type.enum';
import { OperacaoTypeEnum } from './enums/operacao-type.enum';

export const declarations = [
  DinheiroDirective,
  MaiusculoDirective,
  MenuTypeEnum,
  OperacaoTypeEnum
]

@NgModule({
  declarations: [
    declarations
  ],
  imports: [
    CommonModule
  ],
  exports: [
    declarations
  ],
  providers: [
    DaoService
  ]
})
export class SharedModule { }
