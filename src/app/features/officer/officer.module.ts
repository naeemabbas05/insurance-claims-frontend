import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeedbackModule } from '../../Shared/feedback/feedback.module';
import { DynamicFormsModule } from '../dynamic-forms/dynamic-forms.module';
import { ClaimsSharedModule } from '../shared-claims/claims-shared.module';
import { OfficerClaimsComponent } from './officer-claims.component';
import { OfficerClaimDetailsComponent } from './officer-claim-details.component';
import { OfficerDashboardComponent } from './officer-dashboard.component';
import { OfficerRoutingModule } from './officer-routing.module';

@NgModule({
  declarations: [OfficerClaimsComponent, OfficerDashboardComponent, OfficerClaimDetailsComponent],
  imports: [CommonModule, FormsModule, FeedbackModule, DynamicFormsModule, ClaimsSharedModule, OfficerRoutingModule]
})
export class OfficerModule {}
