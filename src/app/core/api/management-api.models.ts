import { ClaimStatus, ClaimType } from './claims-api.models';

export interface CurrencyAmountTotal {
  currencyCode: string;
  amount: number;
}

export interface ManagementClaimsReport {
  marketCode: string | null;
  fromDate: string | null;
  toDate: string | null;
  totalClaims: number;
  unassignedClaims: number;
  claimsByStatus: { status: ClaimStatus; count: number }[];
  claimsByMarket: { marketCode: string; count: number }[];
  claimsByType: { type: ClaimType; count: number }[];
  workloadByOfficer: { officerId: string; officerName: string; activeClaimCount: number }[];
  outstandingEstimatedExposure: CurrencyAmountTotal[];
  assessedAmount: CurrencyAmountTotal[];
  approvedAmount: CurrencyAmountTotal[];
  approvedButUnpaidLiability: CurrencyAmountTotal[];
  settledAmount: CurrencyAmountTotal[];
}

export interface ManagementClaimsAgingReport {
  marketCode: string | null;
  fromDate: string | null;
  toDate: string | null;
  asOfUtc: string;
  totalOpenClaims: number;
  aging: { bucket: string; count: number }[];
}

export interface ManagementClaimsPerformanceReport {
  marketCode: string | null;
  fromDate: string | null;
  toDate: string | null;
  asOfUtc: string;
  totalClaims: number;
  completedClaims: number;
  claimsPending: number;
  averageTurnaroundDays: number;
  claimsOlderThan30Days: number;
  slaAttainmentPercentage: number;
}

export interface ManagementClaimsSlaReport {
  marketCode: string | null;
  fromDate: string | null;
  toDate: string | null;
  targetDays: number;
  asOfUtc: string;
  eligibleClaims: number;
  achievedClaims: number;
  breachedClaims: number;
  attainmentPercentage: number;
}
