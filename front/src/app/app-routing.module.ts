import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent, AccueilComponent, UtilisateurComponent, ConfirmComponent, RegisterComponent, LoginComponent, ErrorComponent, DetailComponent} from "./pages";
import { AdminGuard } from  './admin.guard';

const appRoutes: Routes = [
  { path: 'utilisateurs', component: UtilisateurComponent, canActivate: [AdminGuard]},
  { path: 'accueil', component: AccueilComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'detail', component: DetailComponent},
  { path: 'detail/:dossier_id', component: DetailComponent},
  { path: 'error', component: ErrorComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup',component: RegisterComponent},
  { path: 'confirm/:token',component: ConfirmComponent},
  { path: '', redirectTo: 'accueil', pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }