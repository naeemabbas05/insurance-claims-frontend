import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import {
  ManagementClaimsAgingReport,
  ManagementClaimsPerformanceReport,
  ManagementClaimsReport,
  ManagementClaimsSlaReport
} from './management-api.models';

export interface ManagementReportFilters {
  marketCode?: string;
  fromDate?: string;
  toDate?: string;
}

@Injectable({ providedIn: 'root' })
export class ManagementApiService {
  private readonly reportsUrl = `${API_BASE_URL}/management/reports`;

  constructor(private readonly http: HttpClient) {}

  getClaimsReport(filters: ManagementReportFilters = {}): Observable<ManagementClaimsReport> {
    return this.http.get<ManagementClaimsReport>(`${this.reportsUrl}/claims`, {
      params: this.toParams(filters)
    });
  }

  getAgingReport(filters: ManagementReportFilters = {}): Observable<ManagementClaimsAgingReport> {
    return this.http.get<ManagementClaimsAgingReport>(`${this.reportsUrl}/aging`, {
      params: this.toParams(filters)
    });
  }

  getPerformanceReport(filters: ManagementReportFilters = {}): Observable<ManagementClaimsPerformanceReport> {
    return this.http.get<ManagementClaimsPerformanceReport>(`${this.reportsUrl}/performance`, {
      params: this.toParams(filters)
    });
  }

  getSlaReport(filters: ManagementReportFilters = {}): Observable<ManagementClaimsSlaReport> {
    return this.http.get<ManagementClaimsSlaReport>(`${this.reportsUrl}/sla`, {
      params: this.toParams(filters)
    });
  }

  private toParams(filters: ManagementReportFilters): HttpParams {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });
    return params;
  }
}
