import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
// services
import { DaoService } from './services/dao.service';
import { MenuService } from './services/menu.service';
import { StateService } from './services/state.service';
import { LancamentosService } from './services/lancamentos.service';
import { AutenticadorService } from './services/autenticador.service';
import { UsuarioService } from './services/usuario.service';

registerLocaleData(localePt, 'pt');

@NgModule({
  declarations: [    
  ],
  imports: [
    CommonModule,
  ],
  exports: [    
  ],
  providers: [
    DaoService,
    MenuService,
    StateService,
    LancamentosService,
    UsuarioService,
    AutenticadorService,
    { provide: LOCALE_ID, useValue: 'pt-BR' }, // Define o locale padrão como pt-BR
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' } // Define o código da moeda padrão como BRL
  ]
})
export class SharedModule { }
