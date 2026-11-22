import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ClaimsApiService } from '../../core/api/claims-api.service';
import { getApiErrorMessage } from '../../core/api/api-error';
import { ClaimSubmissionResponse, ClaimType } from '../../core/api/claims-api.models';
import { NotificationService } from '../../Shared/feedback/notification.service';

@Component({
  selector: 'app-claimant-submit',
  standalone: false,
  templateUrl: './claimant-submit.component.html',
  styleUrls: ['./claimant-submit.component.scss']
})
export class ClaimantSubmitComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  readonly form = this.formBuilder.group({
    marketCode: ['', [Validators.required, Validators.maxLength(16)]],
    policyNumber: ['', [Validators.required, Validators.maxLength(64)]],
    claimType: ['motor' as ClaimType, Validators.required],
    incidentAt: ['', Validators.required],
    incidentDescription: ['', [Validators.required, Validators.maxLength(4000)]],
    estimatedLossAmount: [0, [Validators.required, Validators.min(0.01)]],
    currencyCode: ['', [Validators.required, Validators.maxLength(3)]],
    claimant: this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(320)]],
      phone: ['', [Validators.required, Validators.maxLength(32)]]
    })
  });
  loading = false;
  errorMessage: string | null = null;
  submission: ClaimSubmissionResponse | null = null;

  constructor(
    private readonly claimsApi: ClaimsApiService,
    private readonly notifications: NotificationService
  ) {}

  submit(): void {
    this.errorMessage = null;
    this.submission = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const incidentTimestamp = Date.parse(value.incidentAt);
    if (Number.isNaN(incidentTimestamp)) {
      this.errorMessage = 'Enter a valid incident date and time.';
      return;
    }

    this.loading = true;
    this.claimsApi.submit({
      marketCode: value.marketCode.trim(),
      policyNumber: value.policyNumber.trim(),
      claimType: value.claimType,
      incidentAtUtc: new Date(incidentTimestamp).toISOString(),
      incidentDescription: value.incidentDescription.trim(),
      claimant: {
        name: value.claimant.name.trim(),
        email: value.claimant.email.trim(),
        phone: value.claimant.phone.trim()
      },
      estimatedLossAmount: value.estimatedLossAmount,
      currencyCode: value.currencyCode.trim().toUpperCase()
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
}
