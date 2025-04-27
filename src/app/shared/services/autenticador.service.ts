import { Injectable } from '@angular/core';
import { DaoService } from './dao.service';
import { IAutenticador } from '../../login/autenticador.interface';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { AppSettings } from '../../app.settings';

@Injectable({
  providedIn: 'root'
})
export class AutenticadorService {

  constructor(
    private daoService: DaoService,
  ) { }

  login(login:IAutenticador) : Observable<HttpResponse<IAutenticador>> {
    return this.daoService.post<IAutenticador>(AppSettings.AUTENTICADOR_URL,login, DaoService.MEDIA_TYPE_APP_JSON);
  }
}
