import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeedbackModule } from '../../Shared/feedback/feedback.module';
import { ClaimsSharedModule } from '../shared-claims/claims-shared.module';
import { ClaimSubmissionModule } from './claim-submission.module';
import { ClaimantRoutingModule } from './claimant-routing.module';
import { ClaimantDashboardComponent } from './claimant-dashboard.component';
import { MyClaimsComponent } from './my-claims.component';

@NgModule({
  declarations: [ClaimantDashboardComponent, MyClaimsComponent],
  imports: [
    CommonModule,
    FormsModule,
    FeedbackModule,
    ClaimSubmissionModule,
    ClaimsSharedModule,
    ClaimantRoutingModule
  ]
})
export class ClaimantModule {}
