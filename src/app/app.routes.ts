import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { EmployeeListComponent } from './pages/employee/employee-list.component';
import { LanguageComponent } from './pages/language/language.component';
import { CertificateComponent } from './pages/certificate/certificate.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'employees', pathMatch: 'full' },
      { path: 'employees', component: EmployeeListComponent },
      { path: 'languages', component: LanguageComponent },
      { path: 'certificates', component: CertificateComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];