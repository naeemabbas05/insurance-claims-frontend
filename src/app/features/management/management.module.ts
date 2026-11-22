import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeedbackModule } from '../../Shared/feedback/feedback.module';
import { ManagementDashboardComponent } from './management-dashboard.component';
import { ManagementReportsComponent } from './management-reports.component';
import { ManagementRoutingModule } from './management-routing.module';

@NgModule({
  declarations: [ManagementDashboardComponent, ManagementReportsComponent],
  imports: [CommonModule, FeedbackModule, ManagementRoutingModule]
})
export class ManagementModule {}
