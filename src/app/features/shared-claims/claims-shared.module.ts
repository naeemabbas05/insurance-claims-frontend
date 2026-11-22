import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FeedbackModule } from '../../Shared/feedback/feedback.module';
import { ClaimDetailsComponent } from './claim-details.component';

@NgModule({
  declarations: [ClaimDetailsComponent],
  imports: [CommonModule, FormsModule, RouterModule, FeedbackModule],
  exports: [ClaimDetailsComponent]
})
export class ClaimsSharedModule {}
