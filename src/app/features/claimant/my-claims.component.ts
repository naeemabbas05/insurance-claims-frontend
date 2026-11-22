import { Component } from '@angular/core';
import { ClaimsApiService } from '../../core/api/claims-api.service';
import { getApiErrorMessage } from '../../core/api/api-error';
import { ClaimTrackingResponse } from '../../core/api/claims-api.models';

@Component({
  selector: 'app-my-claims',
  standalone: false,
  templateUrl: './my-claims.component.html',
  styleUrls: ['./my-claims.component.scss']
})
export class MyClaimsComponent {
  reference = '';
  loading = false;
  errorMessage: string | null = null;
  claim: ClaimTrackingResponse | null = null;

  constructor(private readonly claimsApi: ClaimsApiService) {}

  search(): void {
    const reference = this.reference.trim();
    if (!reference) {
      this.errorMessage = 'Enter a claim reference.';
      this.claim = null;
      return;
    }
    this.loading = true;
    this.errorMessage = null;
    this.claim = null;
    this.claimsApi.getTracking(reference).subscribe({
      next: result => {
        this.claim = result;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = getApiErrorMessage(error);
        this.loading = false;
      }
    });
  }
}
