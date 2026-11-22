import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ClaimsApiService } from './claims-api.service';
import { ClaimSubmissionRequest } from './claims-api.models';
import { API_BASE_URL } from './api-config';

describe('ClaimsApiService', () => {
  let service: ClaimsApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClaimsApiService]
    });
    service = TestBed.inject(ClaimsApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('submits claims to the versioned API with an idempotency key', () => {
    const request: ClaimSubmissionRequest = {
      marketCode: 'AU',
      policyNumber: 'POL-123',
      claimType: 'motor',
      incidentAtUtc: '2026-01-01T00:00:00.000Z',
      incidentDescription: 'Vehicle damage',
      claimant: { name: 'Test User', email: 'user@example.test', phone: '0400000000' },
      estimatedLossAmount: 1000,
      currencyCode: 'AUD'
    };

    service.submit(request, 'claim-idempotency-key').subscribe();

    const apiRequest = http.expectOne(`${API_BASE_URL}/claims`);
    expect(apiRequest.request.method).toBe('POST');
    expect(apiRequest.request.headers.get('Idempotency-Key')).toBe('claim-idempotency-key');
    expect(apiRequest.request.body).toEqual(request);
    apiRequest.flush({
      claimReference: 'CLM-123',
      status: 'submitted',
      submittedAtUtc: '2026-01-01T00:00:00.000Z',
      trackingUrl: '/api/v1/claims/CLM-123'
    });
  });
});
