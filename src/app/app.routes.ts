import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DespesasComponent } from './relatorios/despesas/despesas.component';
import { ReceitasComponent } from './relatorios/receitas/receitas.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'relatorio-despesa', component: DespesasComponent },
    { path: 'relatorio-receita', component: ReceitasComponent },
    { path: 'lancamentos', loadChildren: () => import('./lancamentos/lancamentos.module').then(m =>
    m.LancamentosModule)},
    { path: '**', component: PageNotFoundComponent },
];
