import { Injectable } from '@angular/core';

const API_TOKEN_KEY = 'claims-api-access-token';

@Injectable({ providedIn: 'root' })
export class ApiTokenService {
  get token(): string {
    return sessionStorage.getItem(API_TOKEN_KEY) ?? '';
  }

  get verifiedEmail(): string | null {
    const payload = this.token.split('.')[1];
    if (!payload) {
      return null;
    }

    try {
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
      const binary = atob(padded);
      const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
      const claims = JSON.parse(new TextDecoder().decode(bytes)) as {
        email?: unknown;
        email_verified?: unknown;
      };
      const isVerified = claims.email_verified === true || claims.email_verified === 'true';
      return isVerified && typeof claims.email === 'string' ? claims.email.trim() : null;
    } catch {
      return null;
    }
  }

  save(token: string): void {
    const value = token.trim();
    if (value) {
      sessionStorage.setItem(API_TOKEN_KEY, value);
    } else {
      this.clear();
    }
  }

  clear(): void {
    sessionStorage.removeItem(API_TOKEN_KEY);
  }
}
