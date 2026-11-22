import { Component, inject } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  private readonly notificationService = inject(NotificationService);
  readonly notification$ = this.notificationService.notification$;

  dismiss(): void {
    this.notificationService.dismiss();
  }
}
