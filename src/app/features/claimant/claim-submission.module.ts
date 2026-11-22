import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeedbackModule } from '../../Shared/feedback/feedback.module';
import { DynamicFormsModule } from '../dynamic-forms/dynamic-forms.module';
import { ClaimantSubmitComponent } from './claimant-submit.component';

@NgModule({
  declarations: [ClaimantSubmitComponent],
  imports: [CommonModule, RouterModule, DynamicFormsModule, FeedbackModule],
  exports: [ClaimantSubmitComponent]
})
export class ClaimSubmissionModule {}
