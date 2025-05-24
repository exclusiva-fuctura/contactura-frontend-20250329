import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// libs
import Swal from 'sweetalert2';
// Services
import { StateService } from '../shared/services/state.service';
import { AutenticadorService } from '../shared/services/autenticador.service';
// Modules
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { HttpStatusCode } from '@angular/common/http';


@Component({
  selector: 'app-login',
  imports: [MaterialModule,ReactiveFormsModule, SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  formulario!: FormGroup;

  constructor(
    private autenticadorService: AutenticadorService,
    private formBuilder: FormBuilder,
    private router: Router,
    private state: StateService
  ){
    this.iniciarFormulario();
  }

  /**
   * Metodo que ira iniciar o formulario
   */
  private iniciarFormulario(): void {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  /**
   * Metodo que irá processar a autenticação
   */
  private login(): void {
    let login = this.formulario.value;
    this.autenticadorService.login(login).subscribe({
      next: (resp)=>{
        if(resp.status === HttpStatusCode.Created) {
          this.state.token = resp.headers.get('authorization') || '';   
          this.router.navigate(['/dashboard']);     
        }
      },
      error: (err)=>{
        Swal.fire({
          title: "Acesso Negado",
          text: err.error.mensagem,
          icon: "error"
        });
      }
    });
    console.log('fim do metodo')
  }

  /**
   * Metodo que será chamado pelo evento click do template(html)
   */
  onLogon(): void {
    this.login();
  }

  onCadastro(): void {
    this.router.navigate(['/cadastro']);
  }

  onEsqueciSenha(): void {
    if (this.formulario.value.email === '' || this.formulario.controls['email'].invalid) {
      Swal.fire({
        title: 'Atenção',
        text: 'Informe um e-mail válido para recuperação de senha',
        icon: 'warning'
      });
      return;
    }
    this.router.navigate(['/recupera-senha/' + this.formulario.value.email]);
  }

}
