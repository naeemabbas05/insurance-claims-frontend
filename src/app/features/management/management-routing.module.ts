import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementDashboardComponent } from './management-dashboard.component';
import { ManagementReportsComponent } from './management-reports.component';

const routes: Routes = [
  { path: 'dashboard', component: ManagementDashboardComponent, data: { allowedRoles: ['Manager'] } },
  { path: 'reports', component: ManagementReportsComponent, data: { allowedRoles: ['Manager'] } },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {}
