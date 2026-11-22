import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { getApiErrorMessage } from '../../core/api/api-error';
import { ManagementApiService, ManagementReportFilters } from '../../core/api/management-api.service';
import { ManagementClaimsAgingReport, ManagementClaimsReport } from '../../core/api/management-api.models';

@Component({
  selector: 'app-management-dashboard',
  standalone: false,
  templateUrl: './management-dashboard.component.html',
  styleUrls: ['./management-dashboard.component.scss']
})
export class ManagementDashboardComponent implements OnInit {
  loading = false;
  errorMessage: string | null = null;
  report: ManagementClaimsReport | null = null;
  aging: ManagementClaimsAgingReport | null = null;
  marketCode = '';
  fromDate = '';
  toDate = '';
  filterError: string | null = null;

  constructor(private readonly managementApi: ManagementApiService) {}

  ngOnInit(): void {
    this.load();
  }

  get outstandingByCurrency() {
    return this.report?.outstandingEstimatedExposure ?? [];
  }

  count(status: string): number | null {
    if (!this.report) return null;
    return this.report.claimsByStatus?.find(item => item.status === status)?.count ?? 0;
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
      report: this.managementApi.getClaimsReport(filters),
      aging: this.managementApi.getAgingReport(filters)
    }).subscribe({
      next: result => {
        this.report = result.report;
        this.aging = result.aging;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = getApiErrorMessage(error);
        this.loading = false;
      }
    });
  }
}
