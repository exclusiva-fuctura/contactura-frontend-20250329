import { Component } from '@angular/core';
import { AutenticadorService } from '../shared/services/autenticador.service';
import { MaterialModule } from '../material/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

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
    private formBuilder: FormBuilder
  ){
    this.init();
  }

  init(): void {
    this.formulario = this.formBuilder.group({
      email: '',
      senha: ''
    });
  }

  login(): void {
    let login = {email:'aluno@fuctura.com.br', senha: 'senha'};
    this.autenticadorService.login(login).subscribe({
      next: (resp)=>{
        console.log(resp.status);
        console.log(resp.headers.get('authorization'));
      },
      error: (err)=>{
        console.error(err)
      }
    });
    console.log('fim do metodo')
  }

}
