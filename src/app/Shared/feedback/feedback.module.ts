import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ErrorMessageComponent } from './error-message.component';
import { LoadingComponent } from './loading.component';
import { NotificationComponent } from './notification.component';

@NgModule({
  declarations: [ErrorMessageComponent, LoadingComponent, NotificationComponent],
  imports: [CommonModule],
  exports: [ErrorMessageComponent, LoadingComponent, NotificationComponent]
})
export class FeedbackModule {}
