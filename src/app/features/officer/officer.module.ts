import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeedbackModule } from '../../Shared/feedback/feedback.module';
import { ClaimsSharedModule } from '../shared-claims/claims-shared.module';
import { OfficerClaimsComponent } from './officer-claims.component';
import { OfficerRoutingModule } from './officer-routing.module';

@NgModule({
  declarations: [OfficerClaimsComponent],
  imports: [CommonModule, FormsModule, FeedbackModule, ClaimsSharedModule, OfficerRoutingModule]
})
export class OfficerModule {}
