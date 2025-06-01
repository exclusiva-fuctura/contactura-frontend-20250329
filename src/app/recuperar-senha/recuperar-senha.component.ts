import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Services
import { MenuService } from '../shared/services/menu.service';
// Enums
import { MenuTypeEnum } from '../shared/enums/menu-type.enum';
// Modules
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
// Components
import { MenuComponent } from '../shared/components/menu/menu.component';
import { LogoutComponent } from '../shared/components/logout/logout.component';
// Models
import { ISenha } from '../shared/models/senha.intarface';
// Directives
import { TelefoneDirective } from '../shared/directives/telefone.directive';
import { RecuperaSenhaService } from '../shared/services/recupera-senha.service';
import Swal from 'sweetalert2';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-senha',
  imports: [
    CommonModule,
    MenuComponent,
    TelefoneDirective,
    LogoutComponent,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.scss'
})
export class RecuperarSenhaComponent {

  formulario!: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private menuService: MenuService,
    private activeRouter: ActivatedRoute,
    private recuperaSenhaService: RecuperaSenhaService
  ) {
    this.menuService.ondeEstou = MenuTypeEnum.RECUPERAR_SENHA;

    this.iniciarFormulario();

    const email = this.activeRouter.snapshot.params['email'];
    if (email) this.formulario.get('email')?.setValue(email);
        
  }

  private iniciarFormulario(): void {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],    
      telefone: ['', Validators.required],
      senha: this.gerarSenhaAleatoria()
    });
  }

  private gerarSenhaAleatoria(): string {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let senha = '';
    for (let i = 0; i < 6; i++) {
      const index = Math.floor(Math.random() * caracteres.length);
      senha += caracteres[index];
    }
    return senha;
  }

  private criarNovaSenha(item: ISenha): void {
    this.recuperaSenhaService.recuperaSenha(item).subscribe({
      next: (res) => {
        if (res.status === HttpStatusCode.NoContent) {
          Swal.fire({
            icon: 'success',
            title: 'Gerar Senha',
            text: 'Nova senha: ' + item.senha,
          }).then(() => {
            this.router.navigate(['/login']);
          });
        }
      },
      error: (err) => {
        if (err.status === HttpStatusCode.NotFound) {
          Swal.fire({
            icon: 'warning',
            title: 'Gerar Senha',
            text: err.error.mensagem,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gerar Senha',
            text: 'Erro ao gerar nova senha',
          });
        }
      }
    });
  }

  onRecupera(): void {
    this.criarNovaSenha(this.formulario.value);
  }

  onLimpar(): void {
    this.formulario.reset();
    this.formulario.get('email')?.setValue(this.activeRouter.snapshot.params['email']);
  }
}
