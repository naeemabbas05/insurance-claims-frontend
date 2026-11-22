import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../../core/api/api-config';
import { ApiTokenService } from '../../core/api/api-token.service';
import { OidcAuthService } from '../../core/api/oidc-auth.service';

@Component({
  selector: 'app-default-layout',
  standalone: false,
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  readonly linkActiveOptions = { exact: false };
  private readonly claimantLinks = [
    { label: 'Dashboard', path: '/claimant/dashboard' },
    { label: 'Submit a claim', path: '/claimant/submit-claim' },
    { label: 'My claims', path: '/claimant/my-claims' }
  ];
  private readonly officerLinks = [
    { label: 'Dashboard', path: '/officer/dashboard' },
    { label: 'Claims', path: '/officer/claims' },
    { label: 'Claim form', path: '/form-builder' }
  ];
  private readonly managementLinks = [
    { label: 'Dashboard', path: '/management/dashboard' },
    { label: 'Reports', path: '/management/reports' },
    { label: 'Claim form', path: '/form-builder' }
  ];
  private readonly formBuilderLinks = [{ label: 'Claim form', path: '/form-builder' }];
  apiTokenDraft = '';
  apiConnectionMessage = 'Checking claims API…';
  apiConnectionState: 'checking' | 'connected' | 'unavailable' = 'checking';
  authMessage: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly apiToken: ApiTokenService,
    private readonly auth: OidcAuthService
  ) {
    this.apiTokenDraft = this.apiToken.token;
  }

  ngOnInit(): void {
    this.checkApiConnection();
  }

  saveApiToken(): void {
    this.apiToken.save(this.apiTokenDraft);
    this.apiTokenDraft = this.apiToken.token;
  }

  signIn(): void {
    this.authMessage = null;
    this.auth.beginLogin(this.router.url).catch(error => {
      this.authMessage = error instanceof Error ? error.message : 'Could not start sign-in.';
    });
  }

  signOut(): void {
    this.auth.logout();
  }

  clearApiToken(): void {
    this.apiToken.clear();
    this.apiTokenDraft = '';
  }

  checkApiConnection(): void {
    this.apiConnectionState = 'checking';
    this.apiConnectionMessage = 'Checking claims API…';
    this.http.get<{ status?: string }>(`${API_BASE_URL}/status`).subscribe({
      next: () => {
        this.apiConnectionState = 'connected';
        this.apiConnectionMessage = 'Claims API connected';
      },
      error: () => {
        this.apiConnectionState = 'unavailable';
        this.apiConnectionMessage = 'Claims API unavailable';
      }
    });
  }

  get sectionLabel(): string {
    switch (this.activeArea) {
      case 'claimant':
        return 'Claimant';
      case 'officer':
        return 'Claims officer';
      case 'management':
        return 'Management';
      case 'form-builder':
        return 'Claim form';
      default:
        return 'Claims';
    }
  }

  get sectionLinks(): { label: string; path: string }[] {
    switch (this.activeArea) {
      case 'claimant':
        return this.claimantLinks;
      case 'officer':
        return this.officerLinks;
      case 'management':
        return this.managementLinks;
      case 'form-builder':
        return this.formBuilderLinks;
      default:
        return this.claimantLinks;
    }
  }

  get activeArea(): 'claimant' | 'officer' | 'management' | 'form-builder' {
    const path = this.router.url;
    if (path.startsWith('/claimant')) {
      return 'claimant';
    }
    if (path.startsWith('/officer')) {
      return 'officer';
    }
    if (path.startsWith('/management')) {
      return 'management';
    }
    if (path.startsWith('/form-builder')) {
      return 'form-builder';
    }
    return 'claimant';
  }
}
