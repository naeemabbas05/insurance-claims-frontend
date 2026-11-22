import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ClaimsApiService } from '../../core/api/claims-api.service';
import { getApiErrorMessage } from '../../core/api/api-error';
import { ClaimSubmissionResponse } from '../../core/api/claims-api.models';
import { NotificationService } from '../../Shared/feedback/notification.service';
import { DynamicFormSchema } from '../../core/forms/form-schema.models';
import { createClaimSubmissionSchema } from './claim-submission-schema';
import { ApiTokenService } from '../../core/api/api-token.service';

@Component({
  selector: 'app-claimant-submit',
  standalone: false,
  templateUrl: './claimant-submit.component.html',
  styleUrls: ['./claimant-submit.component.scss']
})
export class ClaimantSubmitComponent {
  readonly formSchema: DynamicFormSchema = createClaimSubmissionSchema();
  readonly journeySteps = ['Claim type', 'Claim details', 'Review and declaration'];
  formInitialValues: Record<string, unknown> = {};
  selectedClaimType: 'motor' | 'property' | null = null;
  currentStep = 0;
  claimValues: Record<string, unknown> | null = null;
  declarationAccepted = false;
  loading = false;
  errorMessage: string | null = null;
  submission: ClaimSubmissionResponse | null = null;

  constructor(
    private readonly claimsApi: ClaimsApiService,
    private readonly notifications: NotificationService,
    private readonly router: Router,
    private readonly apiToken: ApiTokenService
  ) {}

  get isSharedClaimsFormRoute(): boolean {
    return this.router.url.startsWith('/form-builder');
  }

  selectClaimType(type: 'motor' | 'property'): void {
    if (this.selectedClaimType !== type) {
      this.declarationAccepted = false;
    }
    this.selectedClaimType = type;
    this.formInitialValues = {
      claimType: type,
      ...(this.apiToken.verifiedEmail ? { claimantEmail: this.apiToken.verifiedEmail } : {})
    };
    this.currentStep = 1;
    this.claimValues = null;
  }

  review(values: Record<string, unknown>): void {
    this.claimValues = { ...values, claimType: this.selectedClaimType };
    this.currentStep = 2;
  }

  editDetails(): void {
    this.currentStep = 1;
  }

  submitReviewedClaim(): void {
    if (!this.claimValues || !this.declarationAccepted) {
      return;
    }
    this.submit(this.claimValues);
  }

  submit(values: Record<string, unknown>): void {
    this.errorMessage = null;
    this.submission = null;
    const incidentAt = this.stringValue(values, 'incidentAt');
    const incidentTimestamp = Date.parse(incidentAt);
    if (!incidentAt || Number.isNaN(incidentTimestamp)) {
      this.errorMessage = 'Enter a valid incident date and time.';
      return;
    }

    const rawClaimType = this.selectedClaimType ?? values['claimType'];
    const claimType = typeof rawClaimType === 'string' ? rawClaimType.trim().toLowerCase() : '';
    if (claimType !== 'motor' && claimType !== 'property') {
      this.errorMessage = 'Choose Motor or Property as the claim type.';
      return;
    }

    const estimatedLossAmount = this.numberValue(values['estimatedLossAmount']);
    if (!Number.isFinite(estimatedLossAmount) || estimatedLossAmount <= 0) {
      this.errorMessage = 'Enter an estimated loss amount greater than zero.';
      return;
    }

    const verifiedEmail = this.apiToken.verifiedEmail;
    const claimantEmail = this.stringValue(values, 'claimantEmail');
    if (!verifiedEmail) {
      this.errorMessage = 'Sign in with a Claimant account that has a verified email address before submitting.';
      return;
    }
    if (claimantEmail.toLowerCase() !== verifiedEmail.toLowerCase()) {
      this.errorMessage = `Use the verified email address for your signed-in account: ${verifiedEmail}`;
      return;
    }

    this.loading = true;
    this.claimsApi.submit({
      marketCode: this.stringValue(values, 'marketCode'),
      policyNumber: this.stringValue(values, 'policyNumber'),
      claimType: this.selectedClaimType ?? claimType,
      incidentAtUtc: new Date(incidentTimestamp).toISOString(),
      incidentDescription: this.stringValue(values, 'incidentDescription'),
      claimant: {
        name: this.stringValue(values, 'claimantName'),
        email: this.stringValue(values, 'claimantEmail'),
        phone: this.stringValue(values, 'claimantPhone')
      },
      estimatedLossAmount,
      currencyCode: this.stringValue(values, 'currencyCode').toUpperCase()
    }, this.createIdempotencyKey()).subscribe({
      next: (response) => {
        this.submission = response;
        this.notifications.success(`Claim ${response.claimReference} was submitted.`);
        this.loading = false;
      },
      error: (error: unknown) => {
        this.errorMessage = error instanceof HttpErrorResponse && error.status === 403
          ? 'The API requires a verified Claimant account and a matching claimant email address.'
          : getApiErrorMessage(error);
        this.loading = false;
      }
    });
  }

  private createIdempotencyKey(): string {
    return `claim-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  private stringValue(values: Record<string, unknown>, key: string): string {
    const value = values[key];
    return typeof value === 'string' ? value.trim() : '';
  }

  private numberValue(value: unknown): number {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string' && value.trim() !== '') {
      return Number(value.trim());
    }
    return Number.NaN;
  }
}
