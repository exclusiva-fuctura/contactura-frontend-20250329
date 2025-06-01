import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// libs
import Swal from 'sweetalert2';
// import jwt_decode from 'jwt-decode';
// components
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { LogoutComponent } from '../../shared/components/logout/logout.component';
// modules
import { SharedModule } from '../../shared/shared.module';
import { StateService } from '../../shared/services/state.service';
import { MaterialModule } from '../../material/material.module';
// services
import { MenuService } from '../../shared/services/menu.service';
import { UsuarioService } from '../../shared/services/usuario.service';
// validators
import { ConfirmaSenhaValidator } from '../../shared/models/confirma-senha.validator';
// models
import { IUsuario } from '../../shared/models/usuario.interface';
// enums
import { MenuTypeEnum } from '../../shared/enums/menu-type.enum';
// directives
import { TelefoneDirective } from '../../shared/directives/telefone.directive';

@Component({
  selector: 'app-alterar-senha',
  imports: [
    CommonModule,
    MenuComponent,
    LogoutComponent,
    TelefoneDirective,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './alterar-senha.component.html',
  styleUrl: './alterar-senha.component.scss'
})
export class AlterarSenhaComponent {

  formulario!: FormGroup;
  private usuario: IUsuario | null = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private menuService: MenuService,
    private stateService: StateService,
    private usuarioService: UsuarioService
  ) {
    this.iniciarFormulario();
    this.recuperarUsuario();
    this.menuService.ondeEstou = MenuTypeEnum.ALTERAR_SENHA;
  }

  private iniciarFormulario(): void {
    this.formulario = this.formBuilder.group({
      telefone: ['', Validators.required],
      nome: [''],
      senha: ['', [Validators.required, Validators.minLength(5)]],
      confirmarSenha: ['',[
        Validators.required, 
        Validators.minLength(5), 
        ConfirmaSenhaValidator.senhasIguaisValidator()
      ]]
    });
  }

  private recuperarUsuario(): void {
    this.usuarioService.recuperar(this.usuarioService.obterIdUsuario()).subscribe({
      next: (resp) => {
        this.usuario = resp.body;       
        this.formulario.patchValue({nome: this.usuario?.nome});
      },
      error: () => {
        Swal.fire({
          title: 'Erro Interno',
          text: 'Não foi possível recuperar o usuário.',
          icon: 'error'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }

  private alterarSenha(): void {
    const form = this.formulario.value;
    if (this.usuario && this.usuario.telefone === +form.telefone.replace(/\D/g, '')) {
      this.usuario.senha = form.senha;
      this.usuarioService.alterar(this.usuario).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Senha Alterada',
            text: 'Senha alterada com sucesso. Favor logar novamente.'
          }).then(() => {
            this.router.navigate(['/login']);
            });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao Alterar Senha',
            text: err.error.mensagem || 'Ocorreu um erro ao alterar a senha.'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erro de Validação',
        text: 'O telefone informado não corresponde ao telefone do usuário.'
      });
      this.formulario.get('telefone')?.setErrors({ telefoneInvalido: true });
      this.formulario.get('telefone')?.markAsTouched();
    }
  }

  onAlterar(): void {
    this.alterarSenha();
  }

  onLimpar(): void {
    this.formulario.reset();
    this.formulario.patchValue({nome: this.usuario?.nome});
  }
  


}
