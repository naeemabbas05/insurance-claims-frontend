import { Component, OnInit } from '@angular/core';
import { ClaimantNotificationsApiService } from '../../core/api/claimant-notifications-api.service';
import { getApiErrorMessage } from '../../core/api/api-error';
import { ClaimantNotification } from '../../core/api/claims-api.models';

@Component({
  selector: 'app-claimant-dashboard',
  standalone: false,
  templateUrl: './claimant-dashboard.component.html',
  styleUrls: ['./claimant-dashboard.component.scss']
})
export class ClaimantDashboardComponent implements OnInit {
  loading = false;
  errorMessage: string | null = null;
  notifications: ClaimantNotification[] = [];

  constructor(private readonly notificationsApi: ClaimantNotificationsApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.notificationsApi.getNotifications(1, 5).subscribe({
      next: (page) => {
        this.notifications = page.items;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.errorMessage = getApiErrorMessage(error);
        this.loading = false;
      }
    });
  }
}
