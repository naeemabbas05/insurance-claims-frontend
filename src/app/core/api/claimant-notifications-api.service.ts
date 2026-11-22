import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { ClaimantNotification, ClaimantNotificationPage } from './claims-api.models';

@Injectable({ providedIn: 'root' })
export class ClaimantNotificationsApiService {
  private readonly notificationsUrl = `${API_BASE_URL}/claimant/notifications`;

  constructor(private readonly http: HttpClient) {}

  getNotifications(page = 1, pageSize = 20, unreadOnly = false): Observable<ClaimantNotificationPage> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('unreadOnly', unreadOnly);
    return this.http.get<ClaimantNotificationPage>(this.notificationsUrl, { params });
  }

  markNotificationRead(notificationId: string): Observable<ClaimantNotification> {
    return this.http.put<ClaimantNotification>(
      `${this.notificationsUrl}/${encodeURIComponent(notificationId)}/read`,
      {}
    );
  }
}
