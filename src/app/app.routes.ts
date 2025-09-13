import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DespesasComponent } from './relatorios/despesas/despesas.component';
import { ReceitasComponent } from './relatorios/receitas/receitas.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { AlterarSenhaComponent } from './usuario/alterar-senha/alterar-senha.component';
import { BalanceteComponent } from './relatorios/balancete/balancete.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'recupera-senha/:email', component: RecuperarSenhaComponent },
    { path: 'relatorio-despesa', component: DespesasComponent },
    { path: 'relatorio-receita', component: ReceitasComponent },
    { path: 'relatorio-balancete', component: BalanceteComponent },    
    { path: 'lancamentos', loadChildren: () => import('./lancamentos/lancamentos.module').then(m =>
    m.LancamentosModule)},
    { path: '**', component: PageNotFoundComponent },
];
