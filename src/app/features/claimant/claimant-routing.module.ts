import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimDetailsComponent } from '../shared-claims/claim-details.component';
import { ClaimantDashboardComponent } from './claimant-dashboard.component';
import { ClaimantSubmitComponent } from './claimant-submit.component';
import { MyClaimsComponent } from './my-claims.component';

const routes: Routes = [
  { path: 'dashboard', component: ClaimantDashboardComponent, data: { allowedRoles: ['Claimant'] } },
  { path: 'submit-claim', component: ClaimantSubmitComponent, data: { allowedRoles: ['Claimant'] } },
  { path: 'my-claims', component: MyClaimsComponent, data: { allowedRoles: ['Claimant'] } },
  { path: 'claims/:id', component: ClaimDetailsComponent, data: { allowedRoles: ['Claimant'] } },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimantRoutingModule {}
