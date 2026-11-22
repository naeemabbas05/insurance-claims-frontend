import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClaimsApiService } from '../../core/api/claims-api.service';
import { getApiErrorMessage } from '../../core/api/api-error';
import {
  ClaimDecisionResult,
  ClaimInformationRequest,
  ClaimStatusHistoryItem,
  ClaimTrackingResponse
} from '../../core/api/claims-api.models';
import { NotificationService } from '../../Shared/feedback/notification.service';

@Component({
  selector: 'app-claim-details',
  standalone: false,
  templateUrl: './claim-details.component.html',
  styleUrls: ['./claim-details.component.scss']
})
export class ClaimDetailsComponent implements OnInit {
  loading = false;
  errorMessage: string | null = null;
  tracking: ClaimTrackingResponse | null = null;
  history: ClaimStatusHistoryItem[] = [];
  informationRequests: ClaimInformationRequest[] = [];
  decision: ClaimDecisionResult | null = null;
  informationError: string | null = null;
  respondingId: string | null = null;
  responses: Record<string, string> = {};
  private claimReference = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly claimsApi: ClaimsApiService,
    private readonly notifications: NotificationService
  ) {}

  get isClaimantView(): boolean {
    return this.route.snapshot.pathFromRoot.some(route => route.routeConfig?.path === 'claimant');
  }

  ngOnInit(): void {
    const claimReference = this.route.snapshot.paramMap.get('id');
    if (!claimReference) {
      this.errorMessage = 'A claim reference is required.';
      return;
    }

    this.loading = true;
    this.claimReference = claimReference;
    forkJoin({
      tracking: this.claimsApi.getTracking(claimReference),
      history: this.claimsApi.getStatusHistory(claimReference)
    }).subscribe({
      next: (result) => {
        this.tracking = result.tracking;
        this.history = result.history;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.errorMessage = getApiErrorMessage(error);
        this.loading = false;
      }
    });

    this.claimsApi.getInformationRequests(claimReference).subscribe({
      next: requests => {
        this.informationRequests = requests;
        this.informationError = null;
      },
      error: error => this.informationError = getApiErrorMessage(error)
    });
    this.claimsApi.getDecision(claimReference).pipe(catchError(() => of(null))).subscribe(result => {
      this.decision = result;
    });
  }

  respond(request: ClaimInformationRequest): void {
    const response = (this.responses[request.requestId] ?? '').trim();
    if (!response || request.status !== 'open') {
      return;
    }
    this.respondingId = request.requestId;
    this.claimsApi.respondToInformation(this.claimReference, request.requestId, { response }).subscribe({
      next: () => {
        this.respondingId = null;
        this.responses[request.requestId] = '';
        this.notifications.success('Your additional information was submitted.');
        this.claimsApi.getInformationRequests(this.claimReference).subscribe({
          next: requests => this.informationRequests = requests,
          error: error => this.informationError = getApiErrorMessage(error)
        });
        this.claimsApi.getStatusHistory(this.claimReference).subscribe({
          next: history => this.history = history
        });
      },
      error: error => {
        this.respondingId = null;
        this.informationError = getApiErrorMessage(error);
      }
    });
  }
}
