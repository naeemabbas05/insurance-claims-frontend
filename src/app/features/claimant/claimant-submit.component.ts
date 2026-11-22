import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimsApiService } from '../../core/api/claims-api.service';
import { getApiErrorMessage } from '../../core/api/api-error';
import { ClaimSubmissionResponse } from '../../core/api/claims-api.models';
import { NotificationService } from '../../Shared/feedback/notification.service';
import { DynamicFormSchema } from '../../core/forms/form-schema.models';
import { createClaimSubmissionSchema } from './claim-submission-schema';

@Component({
  selector: 'app-claimant-submit',
  standalone: false,
  templateUrl: './claimant-submit.component.html',
  styleUrls: ['./claimant-submit.component.scss']
})
export class ClaimantSubmitComponent {
  readonly formSchema: DynamicFormSchema = createClaimSubmissionSchema();
  loading = false;
  errorMessage: string | null = null;
  submission: ClaimSubmissionResponse | null = null;

  constructor(
    private readonly claimsApi: ClaimsApiService,
    private readonly notifications: NotificationService,
    private readonly router: Router
  ) {}

  get isSharedClaimsFormRoute(): boolean {
    return this.router.url.startsWith('/form-builder');
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

    const claimType = values['claimType'];
    const estimatedLossAmount = values['estimatedLossAmount'];
    if (
      (claimType !== 'motor' && claimType !== 'property') ||
      typeof estimatedLossAmount !== 'number' ||
      !Number.isFinite(estimatedLossAmount)
    ) {
      this.errorMessage = 'The claim form contains invalid values. Review the fields and try again.';
      return;
    }

    this.loading = true;
    this.claimsApi.submit({
      marketCode: this.stringValue(values, 'marketCode'),
      policyNumber: this.stringValue(values, 'policyNumber'),
      claimType,
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
        this.errorMessage = getApiErrorMessage(error);
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
}
