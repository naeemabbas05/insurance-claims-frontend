import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OidcAuthService } from './oidc-auth.service';
import { getApiErrorMessage } from './api-error';

@Component({
  selector: 'app-auth-callback',
  standalone: false,
  template: `
    <main class="auth-callback" aria-live="polite">
      <h1>{{ errorMessage ? 'Sign-in failed' : 'Signing you in…' }}</h1>
      <p *ngIf="!errorMessage">Completing secure sign-in with the identity provider.</p>
      <p *ngIf="errorMessage" role="alert">{{ errorMessage }}</p>
      <a *ngIf="errorMessage" routerLink="/claimant/dashboard">Return to the claims app</a>
    </main>
  `,
  styles: [`
    .auth-callback { margin: 4rem auto; max-width: 38rem; padding: 2rem; }
  `]
})
export class AuthCallbackComponent implements OnInit {
  errorMessage: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly auth: OidcAuthService
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');
    if (!code || !state) {
      this.errorMessage = 'The identity provider did not return a sign-in code.';
      return;
    }

    this.auth.completeLogin(code, state).subscribe({
      next: returnUrl => this.router.navigateByUrl(returnUrl),
      error: error => this.errorMessage = getApiErrorMessage(error)
    });
  }
}
