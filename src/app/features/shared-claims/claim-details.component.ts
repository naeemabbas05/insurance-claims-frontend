import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClaimsApiService } from '../../core/api/claims-api.service';
import { getApiErrorMessage } from '../../core/api/api-error';
import { ClaimStatusHistoryItem, ClaimTrackingResponse } from '../../core/api/claims-api.models';

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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly claimsApi: ClaimsApiService
  ) {}

  ngOnInit(): void {
    const claimReference = this.route.snapshot.paramMap.get('id');
    if (!claimReference) {
      this.errorMessage = 'A claim reference is required.';
      return;
    }

    this.loading = true;
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
  }
}
