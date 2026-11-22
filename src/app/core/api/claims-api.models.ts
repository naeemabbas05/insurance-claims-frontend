export type ClaimType = 'motor' | 'property';
export type ClaimStatus =
  | 'submitted'
  | 'underReview'
  | 'awaitingInformation'
  | 'assessmentInProgress'
  | 'approved'
  | 'declined'
  | 'settled'
  | 'closed';

export interface ClaimantSubmission {
  name: string;
  email: string;
  phone: string;
}

export interface ClaimSubmissionRequest {
  marketCode: string;
  policyNumber: string;
  claimType: ClaimType;
  incidentAtUtc: string;
  incidentDescription: string;
  claimant: ClaimantSubmission;
  estimatedLossAmount: number;
  currencyCode: string;
}

export interface ClaimSubmissionResponse {
  claimReference: string;
  status: ClaimStatus;
  submittedAtUtc: string;
  trackingUrl: string;
}

export interface ClaimTrackingResponse {
  claimReference: string;
  status: ClaimStatus;
  submittedAtUtc: string;
}

export interface ClaimStatusHistoryItem {
  previousStatus: ClaimStatus | null;
  newStatus: ClaimStatus;
  changedAtUtc: string;
}

export interface ClaimAuditHistoryItem {
  action: string;
  occurredAtUtc: string;
  details: string | null;
  staffUserId: string | null;
  claimantId: string | null;
}

export interface ClaimDecisionDetails {
  decisionType: ClaimStatus;
  decisionDate: string;
  approvedAmount: number | null;
  currency: string | null;
  reason: string;
  settlementStatus: string | null;
}

export interface ClaimDecisionResult {
  claimNumber: string;
  status: ClaimStatus;
  decision: ClaimDecisionDetails | null;
}

export interface ClaimInformationRequest {
  requestId: string;
  question: string;
  requestedAtUtc: string;
  dueAtUtc: string;
  status: 'open' | 'responded' | 'cancelled';
  response: string | null;
  respondedAtUtc: string | null;
}

export interface ClaimLifecycleResult {
  claimReference: string;
  status: ClaimStatus;
  approvedAmount: number | null;
  approvedCurrency: string | null;
  resourceId: string | null;
}

export interface RecordClaimAssessmentRequest {
  assessedDamageAmount: number;
  recommendedSettlementAmount: number;
  currencyCode: string;
  findings: string;
}

export interface ApproveClaimRequest {
  approvedAmount: number;
  currencyCode: string;
  reason: string;
}

export interface RejectClaimRequest {
  reason: string;
}

export interface RequestClaimInformationRequest {
  claimantId: string;
  question: string;
  dueAtUtc: string;
}

export interface RespondToClaimInformationRequest {
  response: string;
}

export interface ProposeClaimSettlementRequest {
  payeeClaimantId: string;
  amount: number;
  currencyCode: string;
  isFinal: boolean;
}

export interface ChangeClaimWorkflowStatusRequest {
  newStatus: ClaimStatus;
  reason: string;
}

export interface ClaimantNotification {
  id: string;
  claimNumber: string;
  type: string;
  title: string;
  message: string;
  createdAtUtc: string;
  readAtUtc: string | null;
}

export interface ClaimantNotificationPage {
  page: number;
  pageSize: number;
  totalCount: number;
  items: ClaimantNotification[];
}
