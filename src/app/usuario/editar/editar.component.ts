import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// modules
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material/material.module';
// services
import { MenuService } from '../../shared/services/menu.service';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../shared/services/usuario.service';
// enums
import { MenuTypeEnum } from '../../shared/enums/menu-type.enum';
// libs
import Swal from 'sweetalert2';
// models
import { IUsuario } from '../../shared/models/usuario.interface';
// directives
import { TelefoneDirective } from '../../shared/directives/telefone.directive';
// components
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { LogoutComponent } from '../../shared/components/logout/logout.component';
// functions
import { padLeft } from '../../shared/functions/pad-left.function';

@Component({
  selector: 'app-editar',
  imports: [
    TelefoneDirective,
    MenuComponent,
    LogoutComponent,
    CommonModule,
    SharedModule,
    MaterialModule, 
    ReactiveFormsModule
  ],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.scss'
})
export class EditarComponent {

  formulario!: FormGroup;
  private usuario: IUsuario | null = null;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService) 
  {
    this.iniciarFormulario();
    this.recuperarUsuario();
    this.menuService.ondeEstou = MenuTypeEnum.EDITAR_USUARIO;
  }
  
  private iniciarFormulario(): void {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      telefone: ['', Validators.required]
    });
  }

  private carregarFormulario(): void {
    if (this.usuario) {
      let telefone = this.usuario.telefone.toString();
      if (telefone.length < 11) {
        telefone = padLeft(telefone,10,'0').replace(/(\d{2})(\d{4})(\d{4})/g,"(\$1) \$2-\$3");
      } else {
        telefone = padLeft(telefone,11,'0').replace(/(\d{2})(\d{5})(\d{4})/g,"(\$1) \$2-\$3");
      }
      this.formulario.patchValue({
        email: this.usuario.email,
        nome: this.usuario.nome,
        telefone: telefone
      });    
    }
  }

  private recuperarUsuario(): void {
    this.usuarioService.recuperar(this.usuarioService.obterIdUsuario()).subscribe({
      next: (usuario) => {
        this.usuario = usuario.body;
        if (this.usuario) {
          this.carregarFormulario();
        }
      },
      error: (error) => {
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

  public salvar(): void {
    const usuario = this.formulario.value;
    if (!this.usuario) {
      Swal.fire({
        title: 'Erro',
        text: 'Usuário não encontrado.',
        icon: 'error'
      });
      return;
    }
    this.usuario.email = usuario.email;
    this.usuario.nome = usuario.nome;
    this.usuario.telefone = +usuario.telefone.replace(/\D/g, ''); // Remove non-numeric characters
    this.usuarioService.alterar(this.usuario).subscribe({
      next: () => {
        Swal.fire({
          title: 'Editar Usuário',
          text: 'Usuário atualizado com sucesso.',
          icon: 'success'
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Editar Usuário',
          text: error.error?.mensagem || 'Erro ao atualizar usuário.',
          icon: 'warning'
        });
      }
    });

  }

  onSalvar(): void {
    this.salvar();;
  }

  onLimpar(): void {
    this.formulario.reset();
    this.carregarFormulario();
  }
}
