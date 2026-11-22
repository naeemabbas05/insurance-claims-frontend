import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FeedbackModule } from '../../Shared/feedback/feedback.module';
import { ClaimsSharedModule } from '../shared-claims/claims-shared.module';
import { ClaimantRoutingModule } from './claimant-routing.module';
import { ClaimantDashboardComponent } from './claimant-dashboard.component';
import { ClaimantSubmitComponent } from './claimant-submit.component';
import { MyClaimsComponent } from './my-claims.component';

@NgModule({
  declarations: [ClaimantDashboardComponent, ClaimantSubmitComponent, MyClaimsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FeedbackModule,
    ClaimsSharedModule,
    ClaimantRoutingModule
  ]
})
export class ClaimantModule {}
