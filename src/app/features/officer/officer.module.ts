import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeedbackModule } from '../../Shared/feedback/feedback.module';
import { DynamicFormsModule } from '../dynamic-forms/dynamic-forms.module';
import { ClaimsSharedModule } from '../shared-claims/claims-shared.module';
import { OfficerClaimsComponent } from './officer-claims.component';
import { OfficerRoutingModule } from './officer-routing.module';

@NgModule({
  declarations: [OfficerClaimsComponent],
  imports: [CommonModule, FeedbackModule, DynamicFormsModule, ClaimsSharedModule, OfficerRoutingModule]
})
export class OfficerModule {}
