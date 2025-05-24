import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Modules
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
// Services
import { MenuService } from '../shared/services/menu.service';
import { UsuarioService } from '../shared/services/usuario.service';
// Components
import { MenuComponent } from '../shared/components/menu/menu.component';
import { LogoutComponent } from '../shared/components/logout/logout.component';
// Enums
import { MenuTypeEnum } from '../shared/enums/menu-type.enum';
// Models
import { ConfirmaSenhaValidator } from '../shared/models/confirma-senha.validator';
import { IUsuario } from '../shared/models/usuario.interface';
// libs
import Swal from 'sweetalert2';
// Directives
import { MaiusculoDirective } from '../shared/directives/maiusculo.directive';
import { MinusculoDirective } from '../shared/directives/minusculo.directive';
import { TelefoneDirective } from '../shared/directives/telefone.directive';


@Component({
  selector: 'app-cadastro',
  imports: [
    CommonModule,
    MenuComponent,
    MaiusculoDirective,
    MinusculoDirective,
    TelefoneDirective,
    LogoutComponent,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {

  formulario!: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private menuService: MenuService,
    private usuarioService: UsuarioService
  ) {
    this.menuService.ondeEstou = MenuTypeEnum.CADASTRO;

    this.iniciarFormulario();
  }

  private iniciarFormulario(): void {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      telefone: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(5)]],
      confirmarSenha: ['', [
        Validators.required, 
        Validators.minLength(5), 
        ConfirmaSenhaValidator.senhasIguaisValidator()]],
    });
  }

  private cadastrar(usuario: IUsuario): void {
    this.usuarioService.cadastrar(usuario).subscribe({
      next: (resp) => {
        const usuario = resp.body;
        if (usuario) {
          Swal.fire({
            title: 'Cadastro realizado com sucesso',
            text: `O usuário ${usuario.nome} foi cadastrado com sucesso!`,
            icon: 'success'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        } else {
          Swal.fire({
            title: 'Erro ao cadastrar',
            text: 'Ocorreu um erro ao cadastrar o usuário. Tente novamente mais tarde.',
            icon: 'warning'
          });
        }
      },
      error: (err) => {
        if (err.status === HttpStatusCode.BadRequest) {
          Swal.fire({
            title: 'Erro ao cadastrar',
            text: err.error.mensagem,
            icon: 'warning'
          });
        } else {
          Swal.fire({
            title: 'Erro ao cadastrar',
            text: 'Ocorreu um erro ao cadastrar o usuário. Tente novamente mais tarde.',
            icon: 'error'
          });
        }
      }
    });
  }

  onCadastrar(): void {    
    const usuario: IUsuario = this.formulario.value;
    this.cadastrar(usuario);
  }

  onLimpar(): void {
    this.formulario.reset();
  }
}
