import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimantSubmitComponent } from '../claimant/claimant-submit.component';

const routes: Routes = [
  {
    path: '',
    component: ClaimantSubmitComponent,
    data: { allowedRoles: ['Claimant', 'ClaimsOfficer', 'Manager'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormBuilderFeatureRoutingModule {}
