import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { getApiErrorMessage } from '../../core/api/api-error';
import { StaffApiService } from '../../core/api/staff-api.service';
import { OfficerWorkloadResult } from '../../core/api/staff-api.models';

@Component({
  selector: 'app-officer-dashboard',
  standalone: false,
  templateUrl: './officer-dashboard.component.html',
  styleUrls: ['./officer-dashboard.component.scss']
})
export class OfficerDashboardComponent {
  marketCode = '';
  officerId = '';
  loading = false;
  errorMessage: string | null = null;
  workload: OfficerWorkloadResult | null = null;
  incomingCount: number | null = null;
  unassignedCount: number | null = null;

  constructor(private readonly staffApi: StaffApiService) {}

  load(): void {
    const market = this.marketCode.trim();
    const officer = this.officerId.trim();
    if (!market) {
      this.errorMessage = 'Enter a market code to load officer queue totals.';
      return;
    }
    this.loading = true;
    this.errorMessage = null;
    forkJoin({
      incoming: this.staffApi.getIncomingClaims(market, 1, 1),
      unassigned: this.staffApi.getUnassignedClaims(market, 1, 1),
      workload: officer ? this.staffApi.getOfficerWorkload(officer, market) : Promise.resolve(null)
    }).subscribe({
      next: result => {
        this.incomingCount = result.incoming.totalCount;
        this.unassignedCount = result.unassigned.totalCount;
        this.workload = result.workload;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = getApiErrorMessage(error);
        this.loading = false;
      }
    });
  }
}
