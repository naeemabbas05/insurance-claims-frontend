import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  kind: 'success' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationSubject = new BehaviorSubject<AppNotification | null>(null);
  readonly notification$ = this.notificationSubject.asObservable();

  success(message: string): void {
    this.notificationSubject.next({ kind: 'success', message });
  }

  info(message: string): void {
    this.notificationSubject.next({ kind: 'info', message });
  }

  dismiss(): void {
    this.notificationSubject.next(null);
  }
}
