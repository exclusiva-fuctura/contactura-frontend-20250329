import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaoService } from './services/dao.service';
import { AutenticadorService } from './services/autenticador.service';
import { AppState } from '../app.state';


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
    AutenticadorService,
  ]
})
export class SharedModule { }
