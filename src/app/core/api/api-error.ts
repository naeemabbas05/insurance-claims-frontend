import { HttpErrorResponse } from '@angular/common/http';

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const problem = error.error as { detail?: string; title?: string } | null;
    return problem?.detail || problem?.title || error.message || 'The request could not be completed.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'The request could not be completed.';
}
