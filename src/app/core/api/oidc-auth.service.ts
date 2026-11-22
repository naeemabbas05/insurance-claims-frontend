import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiTokenService } from './api-token.service';

interface TokenResponse {
  access_token: string;
}

const OIDC_STATE_KEY = 'claims-oidc-state';
const OIDC_VERIFIER_KEY = 'claims-oidc-verifier';
const OIDC_RETURN_URL_KEY = 'claims-oidc-return-url';

@Injectable({ providedIn: 'root' })
export class OidcAuthService {
  private readonly config = environment.identityProvider;

  constructor(
    private readonly http: HttpClient,
    private readonly apiToken: ApiTokenService
  ) {}

  async beginLogin(returnUrl: string): Promise<void> {
    if (!this.config.authority || !this.config.clientId || !this.config.redirectUri) {
      throw new Error('Sign-in is not configured for this deployment.');
    }

    const state = this.randomUrlSafeValue(32);
    const verifier = this.randomUrlSafeValue(64);
    const challengeBytes = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(verifier)
    );
    const challenge = this.toUrlSafeBase64(new Uint8Array(challengeBytes));

    sessionStorage.setItem(OIDC_STATE_KEY, state);
    sessionStorage.setItem(OIDC_VERIFIER_KEY, verifier);
    sessionStorage.setItem(OIDC_RETURN_URL_KEY, returnUrl.startsWith('/') ? returnUrl : '/claimant/dashboard');

    const authorizeUrl = new URL(`${this.config.authority}/protocol/openid-connect/auth`);
    authorizeUrl.search = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256'
    }).toString();

    window.location.assign(authorizeUrl.toString());
  }

  completeLogin(code: string, returnedState: string): Observable<string> {
    const expectedState = sessionStorage.getItem(OIDC_STATE_KEY);
    const verifier = sessionStorage.getItem(OIDC_VERIFIER_KEY);
    if (!expectedState || returnedState !== expectedState || !verifier) {
      return throwError(() => new Error('Sign-in could not be verified. Please try again.'));
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      code,
      code_verifier: verifier
    });
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post<TokenResponse>(
      `${this.config.authority}/protocol/openid-connect/token`,
      body.toString(),
      { headers }
    ).pipe(map(tokenResponse => {
      if (!tokenResponse.access_token) {
        throw new Error('The identity provider did not return an access token.');
      }

      this.apiToken.save(tokenResponse.access_token);
      const returnUrl = sessionStorage.getItem(OIDC_RETURN_URL_KEY) ?? '/claimant/dashboard';
      this.clearPendingLogin();
      return returnUrl.startsWith('/') ? returnUrl : '/claimant/dashboard';
    }));
  }

  logout(): void {
    this.apiToken.clear();
    this.clearPendingLogin();
    if (!this.config.authority || !this.config.clientId || !this.config.redirectUri) {
      window.location.assign('/claimant/dashboard');
      return;
    }

    const logoutUrl = new URL(`${this.config.authority}/protocol/openid-connect/logout`);
    logoutUrl.search = new URLSearchParams({
      client_id: this.config.clientId,
      post_logout_redirect_uri: `${window.location.origin}/claimant/dashboard`
    }).toString();
    window.location.assign(logoutUrl.toString());
  }

  private clearPendingLogin(): void {
    sessionStorage.removeItem(OIDC_STATE_KEY);
    sessionStorage.removeItem(OIDC_VERIFIER_KEY);
    sessionStorage.removeItem(OIDC_RETURN_URL_KEY);
  }

  private randomUrlSafeValue(byteLength: number): string {
    const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
    return this.toUrlSafeBase64(bytes);
  }

  private toUrlSafeBase64(bytes: Uint8Array): string {
    let binary = '';
    bytes.forEach(value => binary += String.fromCharCode(value));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }
}
