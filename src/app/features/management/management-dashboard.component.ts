import { Component, OnInit } from '@angular/core';
import { ManagementApiService } from '../../core/api/management-api.service';
import { getApiErrorMessage } from '../../core/api/api-error';
import { ManagementClaimsReport } from '../../core/api/management-api.models';

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

  constructor(private readonly managementApi: ManagementApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.managementApi.getClaimsReport().subscribe({
      next: (report) => {
        this.report = report;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.errorMessage = getApiErrorMessage(error);
        this.loading = false;
      }
    });
  }
}
