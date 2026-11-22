import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ManagementApiService } from '../../core/api/management-api.service';
import { getApiErrorMessage } from '../../core/api/api-error';
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
  claims: ManagementClaimsReport | null = null;
  aging: ManagementClaimsAgingReport | null = null;
  performance: ManagementClaimsPerformanceReport | null = null;
  sla: ManagementClaimsSlaReport | null = null;

  constructor(private readonly managementApi: ManagementApiService) {}

  ngOnInit(): void {
    this.loading = true;
    forkJoin({
      claims: this.managementApi.getClaimsReport(),
      aging: this.managementApi.getAgingReport(),
      performance: this.managementApi.getPerformanceReport(),
      sla: this.managementApi.getSlaReport()
    }).subscribe({
      next: (reports) => {
        this.claims = reports.claims;
        this.aging = reports.aging;
        this.performance = reports.performance;
        this.sla = reports.sla;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.errorMessage = getApiErrorMessage(error);
        this.loading = false;
      }
    });
  }
}
