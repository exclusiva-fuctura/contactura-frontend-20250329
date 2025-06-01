import { Injectable } from '@angular/core';
import { DaoService } from './dao.service';
import { ISenha } from '../models/senha.intarface';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecuperaSenhaService {

  constructor(
    private daoService: DaoService
  ) { }

  recuperaSenha(senha: ISenha): Observable<HttpResponse<ISenha>> {
    return this.daoService.put('/api/senha/'+senha.email, senha, DaoService.MEDIA_TYPE_APP_JSON);
  }
}
