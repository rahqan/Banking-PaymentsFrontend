// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SuperAdminLayoutComponent } from './components/super-admin/super-admin-layout/super-admin-layout.component';
import { SuperAdminGuard } from './guards/super-admin.guard';
import { DashboardComponent } from './components/super-admin/dashboard/dashboard.component';
import { BankListComponent } from './components/super-admin/bank-list/bank-list.component';
import { BankFormComponent } from './components/super-admin/bank-form/bank-form.component';
import { BankUsersComponent } from './components/super-admin/bank-users/bank-users.component';
import { BankUserFormComponent } from './components/super-admin/bank-user-form/bank-user-form.component';
import { ClientComponent } from './components/client/client.component';
import { clientGuard } from './guards/client.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'bank',
    loadComponent: () =>
      import('./components/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/bank-dashboard/bank-dashboard.component').then(
            (m) => m.BankDashboardComponent
          ),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./components/client-list/client-list.component').then(
            (m) => m.ClientListComponent
          ),
      },
      {
        path: 'clients/onboard',
        loadComponent: () =>
          import('./components/customer-onboarding/customer-onboarding.component').then(
            (m) => m.CustomerOnboardingComponent
          ),
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./components/payment-approval/payment-approval.component').then(
            (m) => m.PaymentApprovalComponent
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./components/bank-reports/bank-reports.component').then(
            (m) => m.BankReportsComponent
          ),
      },
      {
        path: '*',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '*',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      }
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'client/dashboard',
    component: ClientComponent,
    canActivate: [clientGuard]
  },
  {
    path: 'admin',
    canActivate: [SuperAdminGuard],
    component: SuperAdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'banks', component: BankListComponent },
      { path: 'banks/create', component: BankFormComponent },
      { path: 'banks/edit/:id', component: BankFormComponent },
      { path: 'banks/:bankId/users/create', component: BankUserFormComponent },
      { path: 'banks/:bankId/users/edit/:userId', component: BankUserFormComponent },
      { path: 'banks/:bankId/users', component: BankUsersComponent },
      {
        path: 'reports',
        loadComponent: () =>
          import('./components/super-admin/reports/reports.component').then(
            (m) => m.AdminReportsComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];