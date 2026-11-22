import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimDetailsComponent } from '../shared-claims/claim-details.component';
import { OfficerClaimsComponent } from './officer-claims.component';

const routes: Routes = [
  { path: 'dashboard', component: OfficerClaimsComponent, data: { allowedRoles: ['ClaimsOfficer'] } },
  { path: 'claims', component: OfficerClaimsComponent, data: { allowedRoles: ['ClaimsOfficer'] } },
  { path: 'claims/:id', component: ClaimDetailsComponent, data: { allowedRoles: ['ClaimsOfficer', 'Manager'] } },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficerRoutingModule {}
