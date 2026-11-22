import { Component } from '@angular/core';
import { StaffApiService } from '../../core/api/staff-api.service';
import { getApiErrorMessage } from '../../core/api/api-error';
import { StaffClaimListItem } from '../../core/api/staff-api.models';

@Component({
  selector: 'app-officer-claims',
  standalone: false,
  templateUrl: './officer-claims.component.html',
  styleUrls: ['./officer-claims.component.scss']
})
export class OfficerClaimsComponent {
  marketCode = '';
  loading = false;
  errorMessage: string | null = null;
  claims: StaffClaimListItem[] = [];

  constructor(private readonly staffApi: StaffApiService) {}

  loadClaims(): void {
    const marketCode = this.marketCode.trim();
    this.errorMessage = null;
    if (!marketCode) {
      this.errorMessage = 'Enter a market code to load incoming claims.';
      return;
    }

    this.loading = true;
    this.staffApi.getIncomingClaims(marketCode).subscribe({
      next: (page) => {
        this.claims = page.items;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.errorMessage = getApiErrorMessage(error);
        this.loading = false;
      }
    });
  }
}
