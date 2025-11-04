// import { Routes } from '@angular/router';
// import { AuthGuard } from './guards/auth.guard';

// export const routes: Routes = [
//   {
//     path: 'login',
//     loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
//   },
//   {
//     path: 'bank',
//     canActivate: [AuthGuard],
//     children: [
//       {
//         path: 'dashboard',
//         loadComponent: () => import('./components/bank-dashboard/bank-dashboard.component')
//           .then(m => m.BankDashboardComponent)
//       },
//       {
//         path: 'clients',
//         loadComponent: () => import('./components/client-list/client-list.component')
//           .then(m => m.ClientListComponent)
//       },
//       {
//         path: 'clients/onboard',
//         loadComponent: () => import('./components/customer-onboarding/customer-onboarding.component')
//           .then(m => m.CustomerOnboardingComponent)
//       },
//       {
//         path: 'payments',
//         loadComponent: () => import('./components/payment-approval/payment-approval.component')
//           .then(m => m.PaymentApprovalComponent)
//       },
//       {
//         path: '',
//         redirectTo: 'dashboard',
//         pathMatch: 'full'
//       }
//     ]
//   },
//   {
//     path: '',
//     redirectTo: '/bank/dashboard',
//     pathMatch: 'full'
//   }
// ];


import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'bank',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/bank-dashboard/bank-dashboard.component')
          .then(m => m.BankDashboardComponent)
      },
      {
        path: 'clients',
        loadComponent: () => import('./components/client-list/client-list.component')
          .then(m => m.ClientListComponent)
      },
      {
        path: 'clients/onboard',
        loadComponent: () => import('./components/customer-onboarding/customer-onboarding.component')
          .then(m => m.CustomerOnboardingComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./components/payment-approval/payment-approval.component')
          .then(m => m.PaymentApprovalComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/bank/dashboard',
    pathMatch: 'full'
  }
];