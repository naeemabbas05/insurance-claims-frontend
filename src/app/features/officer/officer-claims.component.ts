import { Component } from '@angular/core';
import { StaffApiService } from '../../core/api/staff-api.service';
import { getApiErrorMessage } from '../../core/api/api-error';
import { StaffClaimListItem } from '../../core/api/staff-api.models';
import { DynamicFormSchema } from '../../core/forms/form-schema.models';
import { createMarketFilterSchema } from './market-filter-schema';

@Component({
  selector: 'app-officer-claims',
  standalone: false,
  templateUrl: './officer-claims.component.html',
  styleUrls: ['./officer-claims.component.scss']
})
export class OfficerClaimsComponent {
  readonly marketFilterSchema: DynamicFormSchema = createMarketFilterSchema();
  loading = false;
  errorMessage: string | null = null;
  claims: StaffClaimListItem[] = [];

  constructor(private readonly staffApi: StaffApiService) {}

  loadClaims(values: Record<string, unknown>): void {
    const rawMarketCode = values['marketCode'];
    const marketCode = typeof rawMarketCode === 'string' ? rawMarketCode.trim() : '';
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
