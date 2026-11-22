import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClaimSubmissionModule } from '../claimant/claim-submission.module';
import { FormBuilderFeatureRoutingModule } from './form-builder-feature-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ClaimSubmissionModule,
    FormBuilderFeatureRoutingModule
  ]
})
export class FormBuilderFeatureModule {}
