// // src/app/modules/super-admin/super-admin-routing.module.ts
// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { SuperAdminGuard } from '../../guards/super-admin.guard';
// import { DashboardComponent } from '../../components/super-admin/dashboard/dashboard.component';
// import { BankListComponent } from '../../components/super-admin/bank-list/bank-list.component';
// import { BankFormComponent } from '../../components/super-admin/bank-form/bank-form.component';
// import { BankUsersComponent } from '../../components/super-admin/bank-users/bank-users.component';
// import { BankUserFormComponent } from '../../components/super-admin/bank-user-form/bank-user-form.component';
// import { SuperAdminLayoutComponent } from './super-admin-layout/super-admin-layout.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: SuperAdminLayoutComponent,
//     canActivate: [SuperAdminGuard],
//     children: [
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//       { path: 'dashboard', component: DashboardComponent },
//       { path: 'banks', component: BankListComponent },
//       { path: 'banks/create', component: BankFormComponent },
//       { path: 'banks/edit/:id', component: BankFormComponent },
//       { path: 'banks/:bankId/users', component: BankUsersComponent },
//       { path: 'banks/:bankId/users/create', component: BankUserFormComponent },
//       { path: 'banks/:bankId/users/edit/:userId', component: BankUserFormComponent }
//     ]
//   }
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class SuperAdminRoutingModule { }