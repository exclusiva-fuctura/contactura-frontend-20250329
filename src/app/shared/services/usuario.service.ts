import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// libs
import { Observable } from 'rxjs';
// Services
import { DaoService } from './dao.service';
// Models
import { IUsuario } from '../models/usuario.interface';
import { AppSettings } from '../../app.settings';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private daoService: DaoService,
    private stateService: StateService
  ) { }

  obterIdUsuario(): string {
    const token = this.stateService.token;
    if (token) {
      const payloadJson = atob(token.split('.')[1]);
      const payload = JSON.parse(payloadJson);
      return payload.sub || '';
    }
    return '';
  }

  cadastrar(usuario: IUsuario): Observable<HttpResponse<IUsuario>> {
    return this.daoService.post<IUsuario>(AppSettings.USUARIO_URL, usuario, DaoService.MEDIA_TYPE_APP_JSON);
  }

  alterar(usuario: IUsuario): Observable<HttpResponse<IUsuario>> {
    return this.daoService.put<IUsuario>(`${AppSettings.USUARIO_URL}/${usuario.id}`, usuario, DaoService.MEDIA_TYPE_APP_JSON);
  }

  recuperar(id: string): Observable<HttpResponse<IUsuario>> {
    return this.daoService.get<IUsuario>(`${AppSettings.USUARIO_URL}/${id}`, DaoService.MEDIA_TYPE_APP_JSON);
  }

  listar(): Observable<HttpResponse<IUsuario[]>> {
    return this.daoService.get<IUsuario[]>(AppSettings.USUARIO_URL, DaoService.MEDIA_TYPE_APP_JSON);
  }

  remover(id: string): Observable<HttpResponse<IUsuario>> {
    return this.daoService.delete<IUsuario>(`${AppSettings.USUARIO_URL}/${id}`, DaoService.MEDIA_TYPE_APP_JSON);
  }
}
