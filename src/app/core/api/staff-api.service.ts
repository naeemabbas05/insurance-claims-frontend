import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import {
  AssignClaimRequest,
  ClaimAssignmentHistoryItem,
  ClaimAssignmentResult,
  OfficerWorkloadResult,
  PagedResult,
  ReassignClaimRequest,
  StaffClaimListItem
} from './staff-api.models';

@Injectable({ providedIn: 'root' })
export class StaffApiService {
  private readonly staffUrl = `${API_BASE_URL}/staff`;

  constructor(private readonly http: HttpClient) {}

  getIncomingClaims(marketCode: string, page = 1, pageSize = 20): Observable<PagedResult<StaffClaimListItem>> {
    return this.getClaimsPage('incoming', marketCode, page, pageSize);
  }

  getUnassignedClaims(marketCode: string, page = 1, pageSize = 20): Observable<PagedResult<StaffClaimListItem>> {
    return this.getClaimsPage('unassigned', marketCode, page, pageSize);
  }

  getOfficerClaims(
    officerId: string,
    marketCode: string,
    page = 1,
    pageSize = 20
  ): Observable<PagedResult<StaffClaimListItem>> {
    const params = this.pageParams(marketCode, page, pageSize);
    return this.http.get<PagedResult<StaffClaimListItem>>(
      `${this.staffUrl}/officers/${encodeURIComponent(officerId)}/claims`,
      { params }
    );
  }

  getOfficerWorkload(officerId: string, marketCode: string): Observable<OfficerWorkloadResult> {
    const params = new HttpParams().set('marketCode', marketCode);
    return this.http.get<OfficerWorkloadResult>(
      `${this.staffUrl}/officers/${encodeURIComponent(officerId)}/workload`,
      { params }
    );
  }

  getAssignmentHistory(claimReference: string): Observable<ClaimAssignmentHistoryItem[]> {
    return this.http.get<ClaimAssignmentHistoryItem[]>(
      `${this.staffUrl}/claims/${encodeURIComponent(claimReference)}/assignments`
    );
  }

  assignClaim(claimReference: string, request: AssignClaimRequest): Observable<ClaimAssignmentResult> {
    return this.http.post<ClaimAssignmentResult>(
      `${this.staffUrl}/claims/${encodeURIComponent(claimReference)}/assignments`,
      request
    );
  }

  reassignClaim(
    claimReference: string,
    assignmentId: string,
    request: ReassignClaimRequest
  ): Observable<ClaimAssignmentResult> {
    return this.http.post<ClaimAssignmentResult>(
      `${this.staffUrl}/claims/${encodeURIComponent(claimReference)}/assignments/${encodeURIComponent(assignmentId)}/reassign`,
      request
    );
  }

  private getClaimsPage(
    collection: 'incoming' | 'unassigned',
    marketCode: string,
    page: number,
    pageSize: number
  ): Observable<PagedResult<StaffClaimListItem>> {
    const params = this.pageParams(marketCode, page, pageSize);
    return this.http.get<PagedResult<StaffClaimListItem>>(
      `${this.staffUrl}/claims/${collection}`,
      { params }
    );
  }

  private pageParams(marketCode: string, page: number, pageSize: number): HttpParams {
    return new HttpParams()
      .set('marketCode', marketCode)
      .set('page', page)
      .set('pageSize', pageSize);
  }
}
