import { ClaimStatus, ClaimType } from './claims-api.models';

export type AssignmentRole = 'claimsHandler' | 'adjuster' | 'assessor' | 'approver';

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface StaffClaimListItem {
  claimReference: string;
  policyNumber: string;
  marketCode: string;
  claimType: ClaimType;
  status: ClaimStatus;
  incidentAtUtc: string;
  reportedAtUtc: string;
  activeRole: AssignmentRole | null;
  activeOfficerId: string | null;
  activeOfficerName: string | null;
}

export interface ClaimAssignmentHistoryItem {
  assignmentId: string;
  claimReference: string;
  officerId: string;
  officerName: string;
  role: AssignmentRole;
  assignedAtUtc: string;
  unassignedAtUtc: string | null;
  isActive: boolean;
}

export interface ClaimAssignmentResult {
  assignmentId: string;
  claimReference: string;
  officerId: string;
  role: AssignmentRole;
  assignedAtUtc: string;
  assignmentActorId: string;
}

export interface OfficerWorkloadResult {
  officerId: string;
  officerName: string;
  marketCode: string;
  activeClaimCount: number;
  byRole: { role: AssignmentRole; activeClaimCount: number }[];
}

export interface AssignClaimRequest {
  officerId: string;
  role: AssignmentRole | null;
}

export interface ReassignClaimRequest {
  newOfficerId: string;
}
