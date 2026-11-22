import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import {
  ApproveClaimRequest,
  ChangeClaimWorkflowStatusRequest,
  ClaimAuditHistoryItem,
  ClaimDecisionResult,
  ClaimInformationRequest,
  ClaimLifecycleResult,
  ClaimStatusHistoryItem,
  ClaimSubmissionRequest,
  ClaimSubmissionResponse,
  ClaimTrackingResponse,
  ProposeClaimSettlementRequest,
  RecordClaimAssessmentRequest,
  RejectClaimRequest,
  RequestClaimInformationRequest,
  RespondToClaimInformationRequest
} from './claims-api.models';

@Injectable({ providedIn: 'root' })
export class ClaimsApiService {
  private readonly claimsUrl = `${API_BASE_URL}/claims`;

  constructor(private readonly http: HttpClient) {}

  submit(request: ClaimSubmissionRequest, idempotencyKey: string): Observable<ClaimSubmissionResponse> {
    const headers = new HttpHeaders({ 'Idempotency-Key': idempotencyKey });
    return this.http.post<ClaimSubmissionResponse>(this.claimsUrl, request, { headers });
  }

  getTracking(claimReference: string): Observable<ClaimTrackingResponse> {
    return this.http.get<ClaimTrackingResponse>(this.claimUrl(claimReference));
  }

  getDecision(claimReference: string): Observable<ClaimDecisionResult> {
    return this.http.get<ClaimDecisionResult>(`${this.claimUrl(claimReference)}/decision`);
  }

  getInformationRequests(claimReference: string): Observable<ClaimInformationRequest[]> {
    return this.http.get<ClaimInformationRequest[]>(`${this.claimUrl(claimReference)}/information-requests`);
  }

  getStatusHistory(claimReference: string): Observable<ClaimStatusHistoryItem[]> {
    return this.http.get<ClaimStatusHistoryItem[]>(`${this.claimUrl(claimReference)}/history`);
  }

  getAuditHistory(claimReference: string): Observable<ClaimAuditHistoryItem[]> {
    return this.http.get<ClaimAuditHistoryItem[]>(`${this.claimUrl(claimReference)}/audit`);
  }

  recordAssessment(
    claimReference: string,
    request: RecordClaimAssessmentRequest
  ): Observable<ClaimLifecycleResult> {
    return this.http.post<ClaimLifecycleResult>(`${this.claimUrl(claimReference)}/assessments`, request);
  }

  approve(claimReference: string, request: ApproveClaimRequest): Observable<ClaimLifecycleResult> {
    return this.http.post<ClaimLifecycleResult>(`${this.claimUrl(claimReference)}/approval`, request);
  }

  reject(claimReference: string, request: RejectClaimRequest): Observable<ClaimLifecycleResult> {
    return this.http.post<ClaimLifecycleResult>(`${this.claimUrl(claimReference)}/rejection`, request);
  }

  requestInformation(
    claimReference: string,
    request: RequestClaimInformationRequest
  ): Observable<ClaimLifecycleResult> {
    return this.http.post<ClaimLifecycleResult>(
      `${this.claimUrl(claimReference)}/information-requests`,
      request
    );
  }

  respondToInformation(
    claimReference: string,
    requestId: string,
    request: RespondToClaimInformationRequest
  ): Observable<ClaimLifecycleResult> {
    return this.http.post<ClaimLifecycleResult>(
      `${this.claimUrl(claimReference)}/information-requests/${encodeURIComponent(requestId)}/responses`,
      request
    );
  }

  cancelInformationRequest(claimReference: string, requestId: string): Observable<ClaimLifecycleResult> {
    return this.http.delete<ClaimLifecycleResult>(
      `${this.claimUrl(claimReference)}/information-requests/${encodeURIComponent(requestId)}`
    );
  }

  proposeSettlement(
    claimReference: string,
    request: ProposeClaimSettlementRequest
  ): Observable<ClaimLifecycleResult> {
    return this.http.post<ClaimLifecycleResult>(`${this.claimUrl(claimReference)}/settlements`, request);
  }

  approveSettlement(claimReference: string, settlementId: string): Observable<ClaimLifecycleResult> {
    return this.http.post<ClaimLifecycleResult>(
      `${this.claimUrl(claimReference)}/settlements/${encodeURIComponent(settlementId)}/approval`,
      {}
    );
  }

  paySettlement(claimReference: string, settlementId: string): Observable<ClaimLifecycleResult> {
    return this.http.post<ClaimLifecycleResult>(
      `${this.claimUrl(claimReference)}/settlements/${encodeURIComponent(settlementId)}/payment`,
      {}
    );
  }

  cancelSettlement(claimReference: string, settlementId: string): Observable<ClaimLifecycleResult> {
    return this.http.delete<ClaimLifecycleResult>(
      `${this.claimUrl(claimReference)}/settlements/${encodeURIComponent(settlementId)}`
    );
  }

  changeWorkflowStatus(
    claimReference: string,
    request: ChangeClaimWorkflowStatusRequest
  ): Observable<ClaimLifecycleResult> {
    return this.http.post<ClaimLifecycleResult>(`${this.claimUrl(claimReference)}/workflow-status`, request);
  }

  private claimUrl(claimReference: string): string {
    return `${this.claimsUrl}/${encodeURIComponent(claimReference)}`;
  }
}
