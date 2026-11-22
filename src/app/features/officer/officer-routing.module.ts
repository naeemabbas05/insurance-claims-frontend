import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficerClaimDetailsComponent } from './officer-claim-details.component';
import { OfficerDashboardComponent } from './officer-dashboard.component';
import { OfficerClaimsComponent } from './officer-claims.component';

const routes: Routes = [
  { path: 'dashboard', component: OfficerDashboardComponent, data: { allowedRoles: ['ClaimsOfficer'] } },
  { path: 'claims', component: OfficerClaimsComponent, data: { allowedRoles: ['ClaimsOfficer'] } },
  { path: 'claims/:id', component: OfficerClaimDetailsComponent, data: { allowedRoles: ['ClaimsOfficer', 'Manager'] } },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficerRoutingModule {}
