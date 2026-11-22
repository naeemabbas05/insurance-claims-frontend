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
  allClaims: StaffClaimListItem[] = [];
  queue: 'incoming' | 'unassigned' = 'incoming';
  marketCode = '';
  page = 1;
  readonly pageSize = 20;
  totalCount = 0;
  searchText = '';
  statusFilter = '';
  categoryFilter = '';
  sortBy: 'reportedAtUtc' | 'incidentAtUtc' | 'claimReference' = 'reportedAtUtc';

  constructor(private readonly staffApi: StaffApiService) {}

  loadClaims(values: Record<string, unknown>): void {
    const rawMarketCode = values['marketCode'];
    const marketCode = typeof rawMarketCode === 'string' ? rawMarketCode.trim() : '';
    if (!marketCode) {
      this.errorMessage = 'Enter a market code to load claims.';
      return;
    }
    this.marketCode = marketCode;
    this.page = 1;
    this.fetchClaims();
  }

  setQueue(queue: 'incoming' | 'unassigned'): void {
    this.queue = queue;
    this.page = 1;
    if (this.marketCode) this.fetchClaims();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.pageCount || page === this.page) return;
    this.page = page;
    this.fetchClaims();
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  get filteredClaims(): StaffClaimListItem[] {
    const search = this.searchText.trim().toLocaleLowerCase();
    return this.allClaims
      .filter(claim => !search || (claim.claimReference ?? '').toLocaleLowerCase().includes(search) || (claim.policyNumber ?? '').toLocaleLowerCase().includes(search))
      .filter(claim => !this.statusFilter || claim.status === this.statusFilter)
      .filter(claim => !this.categoryFilter || claim.claimType === this.categoryFilter)
      .sort((a, b) => String(a[this.sortBy]).localeCompare(String(b[this.sortBy])));
  }

  private fetchClaims(): void {
    this.errorMessage = null;
    this.loading = true;
    const request = this.queue === 'incoming'
      ? this.staffApi.getIncomingClaims(this.marketCode, this.page, this.pageSize)
      : this.staffApi.getUnassignedClaims(this.marketCode, this.page, this.pageSize);
    request.subscribe({
      next: result => {
        this.allClaims = result.items ?? [];
        this.totalCount = result.totalCount;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = getApiErrorMessage(error);
        this.loading = false;
      }
    });
  }
}
