import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { FeedbackModule } from '../../Shared/feedback/feedback.module';
import { NotificationService } from '../../Shared/feedback/notification.service';
import { ClaimsApiService } from '../../core/api/claims-api.service';
import { ApiTokenService } from '../../core/api/api-token.service';
import { ClaimSubmissionResponse } from '../../core/api/claims-api.models';
import { DynamicFormsModule } from '../dynamic-forms/dynamic-forms.module';
import { ClaimantSubmitComponent } from './claimant-submit.component';

describe('ClaimantSubmitComponent', () => {
  let fixture: ComponentFixture<ClaimantSubmitComponent>;
  let component: ClaimantSubmitComponent;
  let submitClaim: jasmine.Spy;
  let notifySuccess: jasmine.Spy;

  beforeEach(async () => {
    const response: ClaimSubmissionResponse = {
      claimReference: 'CLM-123',
      status: 'submitted',
      submittedAtUtc: '2026-01-01T00:00:00Z',
      trackingUrl: '/claims/CLM-123'
    };
    submitClaim = jasmine.createSpy().and.returnValue(of(response));
    notifySuccess = jasmine.createSpy();

    await TestBed.configureTestingModule({
      declarations: [ClaimantSubmitComponent],
      imports: [DynamicFormsModule, FeedbackModule, RouterTestingModule],
      providers: [
        { provide: ClaimsApiService, useValue: { submit: submitClaim } },
        { provide: ApiTokenService, useValue: { verifiedEmail: 'avery@example.com' } },
        { provide: NotificationService, useValue: { success: notifySuccess } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimantSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('submits dynamic form values through the existing fixed-DTO claims API', () => {
    const incidentAt = '2026-06-15T10:30';
    component.submit({
      marketCode: ' SG ',
      policyNumber: ' P-123 ',
      claimType: 'property',
      incidentAt,
      incidentDescription: ' Water damage ',
      estimatedLossAmount: 123.45,
      currencyCode: 'sgd',
      claimantName: ' Avery Tan ',
      claimantEmail: 'avery@example.com',
      claimantPhone: ' 123456 '
    });

    expect(submitClaim).toHaveBeenCalledWith({
      marketCode: 'SG',
      policyNumber: 'P-123',
      claimType: 'property',
      incidentAtUtc: new Date(Date.parse(incidentAt)).toISOString(),
      incidentDescription: 'Water damage',
      claimant: {
        name: 'Avery Tan',
        email: 'avery@example.com',
        phone: '123456'
      },
      estimatedLossAmount: 123.45,
      currencyCode: 'SGD'
    }, jasmine.any(String));
    expect(notifySuccess).toHaveBeenCalledWith('Claim CLM-123 was submitted.');
  });
});
