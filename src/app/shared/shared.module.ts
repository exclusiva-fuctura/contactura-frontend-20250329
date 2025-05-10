import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaoService } from './services/dao.service';
import { AutenticadorService } from './services/autenticador.service';
import { AppState } from '../app.state';
import { MenuService } from './services/menu.service';
import { MaterialModule } from '../material/material.module';
import { MenuComponent } from './components/menu/menu.component';


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
    AutenticadorService,
  ]
})
export class SharedModule { }
