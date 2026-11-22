import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../../Shared/feedback/notification.service';
import { getApiErrorMessage } from '../../core/api/api-error';
import { ClaimsApiService } from '../../core/api/claims-api.service';
import {
  ApproveClaimRequest,
  ClaimAuditHistoryItem,
  ClaimDecisionResult,
  ClaimInformationRequest,
  ClaimLifecycleResult,
  ClaimStatusHistoryItem,
  ClaimTrackingResponse,
  RecordClaimAssessmentRequest,
  RejectClaimRequest
} from '../../core/api/claims-api.models';
import { ClaimAssignmentHistoryItem, AssignmentRole, StaffClaimListItem } from '../../core/api/staff-api.models';
import { StaffApiService } from '../../core/api/staff-api.service';

@Component({
  selector: 'app-officer-claim-details',
  standalone: false,
  templateUrl: './officer-claim-details.component.html',
  styleUrls: ['./officer-claim-details.component.scss']
})
export class OfficerClaimDetailsComponent implements OnInit {
  readonly roles: AssignmentRole[] = ['claimsHandler', 'adjuster', 'assessor', 'approver'];
  claimReference = '';
  tracking: ClaimTrackingResponse | null = null;
  history: ClaimStatusHistoryItem[] = [];
  audit: ClaimAuditHistoryItem[] = [];
  decision: ClaimDecisionResult | null = null;
  assignments: ClaimAssignmentHistoryItem[] = [];
  queueItem: StaffClaimListItem | null = null;
  informationRequests: ClaimInformationRequest[] = [];
  loading = false;
  pendingAction: string | null = null;
  errorMessage: string | null = null;
  actionMessage: string | null = null;
  assignmentError: string | null = null;
  assignmentConfirmation: string | null = null;
  decisionConfirmation: 'approve' | 'reject' | null = null;
  officerId = '';
  role: AssignmentRole = 'claimsHandler';
  newOfficerId = '';
  activeAssignmentId = '';
  assessedDamageAmount: number | null = null;
  recommendedSettlementAmount: number | null = null;
  assessmentCurrency = '';
  findings = '';
  approvedAmount: number | null = null;
  approvalCurrency = '';
  approvalReason = '';
  rejectionReason = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly claimsApi: ClaimsApiService,
    private readonly staffApi: StaffApiService,
    private readonly notifications: NotificationService
  ) {}

  ngOnInit(): void {
    this.claimReference = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.claimReference) {
      this.errorMessage = 'A claim reference is required.';
      return;
    }
    this.refresh();
    this.loadQueueItem();
  }

  private loadQueueItem(): void {
    const marketCode = this.route.snapshot.queryParamMap.get('marketCode');
    const page = Number(this.route.snapshot.queryParamMap.get('page') ?? '1');
    const queue = this.route.snapshot.queryParamMap.get('queue');
    if (!marketCode) return;
    const request = queue === 'unassigned'
      ? this.staffApi.getUnassignedClaims(marketCode, Number.isInteger(page) && page > 0 ? page : 1)
      : this.staffApi.getIncomingClaims(marketCode, Number.isInteger(page) && page > 0 ? page : 1);
    request.subscribe({
      next: result => this.queueItem = (result.items ?? []).find(item => item.claimReference === this.claimReference) ?? null
    });
  }

  refresh(): void {
    this.loading = true;
    this.errorMessage = null;
    forkJoin({
      tracking: this.claimsApi.getTracking(this.claimReference),
      history: this.claimsApi.getStatusHistory(this.claimReference)
    }).subscribe({
      next: result => {
        this.tracking = result.tracking;
        this.history = result.history;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = getApiErrorMessage(error);
        this.loading = false;
      }
    });
    this.claimsApi.getDecision(this.claimReference).pipe(catchError(() => of(null))).subscribe(result => this.decision = result);
    this.claimsApi.getAuditHistory(this.claimReference).pipe(catchError(() => of([]))).subscribe(result => this.audit = result);
    this.claimsApi.getInformationRequests(this.claimReference).pipe(catchError(() => of([]))).subscribe(result => this.informationRequests = result);
    this.refreshAssignments();
  }

  refreshAssignments(): void {
    this.staffApi.getAssignmentHistory(this.claimReference).subscribe({
      next: assignments => {
        this.assignments = assignments;
        this.assignmentError = null;
        const active = assignments.find(item => item.isActive);
        this.activeAssignmentId = active?.assignmentId ?? '';
      },
      error: error => this.assignmentError = getApiErrorMessage(error)
    });
  }

  assign(): void {
    if (!this.isUuid(this.officerId)) {
      this.assignmentError = 'Enter a valid officer UUID.';
      return;
    }
    this.pendingAction = 'assignment';
    this.staffApi.assignClaim(this.claimReference, { officerId: this.officerId, role: this.role }).subscribe({
      next: () => this.actionSucceeded('Claim assignment saved.'),
      error: error => this.actionFailed(error, true)
    });
  }

  reassign(): void {
    if (!this.isUuid(this.newOfficerId) || !this.activeAssignmentId) {
      this.assignmentError = 'Enter a valid officer UUID and select an active assignment.';
      return;
    }
    this.pendingAction = 'reassignment';
    this.staffApi.reassignClaim(this.claimReference, this.activeAssignmentId, { newOfficerId: this.newOfficerId }).subscribe({
      next: () => this.actionSucceeded('Claim reassignment saved.'),
      error: error => this.actionFailed(error, true)
    });
  }

  recordAssessment(): void {
    if (this.assessedDamageAmount === null || this.assessedDamageAmount < 0 ||
        this.recommendedSettlementAmount === null || this.recommendedSettlementAmount < 0 ||
        !this.assessmentCurrency.trim() || !this.findings.trim()) {
      this.errorMessage = 'Enter non-negative amounts, a currency code, and assessment findings.';
      return;
    }
    const request: RecordClaimAssessmentRequest = {
      assessedDamageAmount: this.assessedDamageAmount,
      recommendedSettlementAmount: this.recommendedSettlementAmount,
      currencyCode: this.assessmentCurrency.trim().toUpperCase(),
      findings: this.findings.trim()
    };
    this.runLifecycle('assessment', this.claimsApi.recordAssessment(this.claimReference, request), 'Assessment recorded.');
  }

  reviewDecision(action: 'approve' | 'reject'): void {
    const valid = action === 'approve'
      ? this.approvedAmount !== null && this.approvedAmount >= 0 && !!this.approvalCurrency.trim() && !!this.approvalReason.trim()
      : !!this.rejectionReason.trim();
    if (!valid) {
      this.errorMessage = action === 'approve'
        ? 'Enter an approved amount, currency code, and reason.'
        : 'Enter a rejection reason.';
      return;
    }
    this.errorMessage = null;
    this.decisionConfirmation = action;
  }

  confirmDecision(): void {
    if (this.decisionConfirmation === 'approve') {
      const request: ApproveClaimRequest = {
        approvedAmount: this.approvedAmount!,
        currencyCode: this.approvalCurrency.trim().toUpperCase(),
        reason: this.approvalReason.trim()
      };
      this.runLifecycle('approval', this.claimsApi.approve(this.claimReference, request), 'Approval submitted.');
    } else if (this.decisionConfirmation === 'reject') {
      const request: RejectClaimRequest = { reason: this.rejectionReason.trim() };
      this.runLifecycle('rejection', this.claimsApi.reject(this.claimReference, request), 'Rejection submitted.');
    }
  }

  cancelDecision(): void {
    this.decisionConfirmation = null;
  }

  private runLifecycle(key: string, request: Observable<ClaimLifecycleResult>, success: string): void {
    this.errorMessage = null;
    this.actionMessage = null;
    this.pendingAction = key;
    request.subscribe({
      next: () => this.actionSucceeded(success),
      error: error => this.actionFailed(error)
    });
  }

  private actionSucceeded(message: string): void {
    this.pendingAction = null;
    this.decisionConfirmation = null;
    this.assignmentConfirmation = null;
    this.actionMessage = message;
    this.notifications.success(message);
    this.refresh();
  }

  private actionFailed(error: unknown, assignment = false): void {
    this.pendingAction = null;
    const message = getApiErrorMessage(error);
    if (assignment) this.assignmentError = message;
    else this.errorMessage = message;
  }

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.trim());
  }
}
