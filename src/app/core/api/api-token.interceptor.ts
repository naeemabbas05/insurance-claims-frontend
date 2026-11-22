import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { ApiTokenService } from './api-token.service';

@Injectable()
export class ApiTokenInterceptor implements HttpInterceptor {
  constructor(private readonly apiToken: ApiTokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.apiToken.token;
    const isClaimsApiRequest = request.url.startsWith(`${API_BASE_URL}/`);
    if (!token || !isClaimsApiRequest) {
      return next.handle(request);
    }

    return next.handle(request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }));
  }
}
