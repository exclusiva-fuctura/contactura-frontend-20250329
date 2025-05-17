import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaoService } from './services/dao.service';
import { AutenticadorService } from './services/autenticador.service';
import { AppState } from '../app.state';
import { MenuService } from './services/menu.service';
import { LancamentosService } from './services/lancamentos.service';


@NgModule({
  declarations: [    
  ],
  imports: [
    CommonModule,
  ],
  exports: [    
  ],
  providers: [
    AppState,
    DaoService,
    MenuService,
    LancamentosService,
    AutenticadorService,
  ]
})
export class SharedModule { }
