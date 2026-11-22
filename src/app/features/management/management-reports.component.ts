import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { getApiErrorMessage } from '../../core/api/api-error';
import { ManagementApiService, ManagementReportFilters } from '../../core/api/management-api.service';
import {
  ManagementClaimsAgingReport,
  ManagementClaimsPerformanceReport,
  ManagementClaimsReport,
  ManagementClaimsSlaReport
} from '../../core/api/management-api.models';

@Component({
  selector: 'app-management-reports',
  standalone: false,
  templateUrl: './management-reports.component.html',
  styleUrls: ['./management-reports.component.scss']
})
export class ManagementReportsComponent implements OnInit {
  loading = false;
  errorMessage: string | null = null;
  filterError: string | null = null;
  claims: ManagementClaimsReport | null = null;
  aging: ManagementClaimsAgingReport | null = null;
  performance: ManagementClaimsPerformanceReport | null = null;
  sla: ManagementClaimsSlaReport | null = null;
  marketCode = '';
  fromDate = '';
  toDate = '';

  constructor(private readonly managementApi: ManagementApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.filterError = null;
    if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
      this.filterError = 'Start date must be on or before end date.';
      return;
    }
    const filters: ManagementReportFilters = {
      marketCode: this.marketCode.trim() || undefined,
      fromDate: this.fromDate || undefined,
      toDate: this.toDate || undefined
    };
    this.loading = true;
    this.errorMessage = null;
    forkJoin({
      claims: this.managementApi.getClaimsReport(filters),
      aging: this.managementApi.getAgingReport(filters),
      performance: this.managementApi.getPerformanceReport(filters),
      sla: this.managementApi.getSlaReport(filters)
    }).subscribe({
      next: reports => {
        this.claims = reports.claims;
        this.aging = reports.aging;
        this.performance = reports.performance;
        this.sla = reports.sla;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = getApiErrorMessage(error);
        this.loading = false;
      }
    });
  }

  max(values: number[]): number {
    return Math.max(1, ...values);
  }

  get markets() { return this.claims?.claimsByMarket ?? []; }
  get categories() { return this.claims?.claimsByType ?? []; }
  get statuses() { return this.claims?.claimsByStatus ?? []; }
  get officers() { return this.claims?.workloadByOfficer ?? []; }
  get agingBuckets() { return this.aging?.aging ?? []; }
  get exposure() { return this.claims?.outstandingEstimatedExposure ?? []; }
  get approvedAmounts() { return this.claims?.approvedAmount ?? []; }
  get approvedUnpaid() { return this.claims?.approvedButUnpaidLiability ?? []; }
  get maxMarketCount(): number { return this.max(this.markets.map(item => item.count)); }
  get maxCategoryCount(): number { return this.max(this.categories.map(item => item.count)); }
  get maxStatusCount(): number { return this.max(this.statuses.map(item => item.count)); }
  get maxOfficerWorkload(): number { return this.max(this.officers.map(item => item.activeClaimCount)); }
}
