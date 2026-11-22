# CHUBB APAC Claims Frontend

Angular frontend for the CHUBB APAC claims-management API. It provides claimant, claims officer, and management workspaces, a shared dynamic form renderer, typed API clients, and reusable loading/error/notification feedback.

## Technology stack

- Angular 22.3 with TypeScript 6 and RxJS 7
- Angular NgModules and lazy-loaded feature areas
- Bootstrap 5.3
- Angular `HttpClient` for the existing ASP.NET Core API
- Jasmine, Karma, and Chrome Headless for unit tests

## Requirements and installation

- Node.js `^22.22.3`, `^24.15.0`, or `>=26.0.0`
- npm
- Claims API available at `http://localhost:5187` for local integration

```powershell
npm ci
npm start
```

The Angular development server proxies `/api` to `http://localhost:5187`. The backend exposes Swagger at `/swagger` when running in Development.
The app checks `/api/v1/status` on load and shows whether the API is reachable through the proxy.

## Environment and API configuration

`src/environments/environment.ts` and `environment.prod.ts` define `claimsApiUrl`. `src/app/core/api/api-config.ts` provides that base URL to typed services. Configure the production URL in the production environment or route `/api/v1` through the hosting reverse proxy. Do not put credentials or tokens in these environment files.

Select **Sign in** to authenticate through the configured OpenID Connect provider. Local development uses Keycloak; start it with the instructions in the backend README. The access token is kept in the current tab's session storage and attached only to claims API requests. You can also paste an externally issued bearer token into the header. Backend authorization remains authoritative.

## Architecture

- `src/app/core/api`: typed API models and `HttpClient` services, organized by claims, staff, management, and claimant notifications.
- `src/app/core/forms` and `src/app/features/dynamic-forms`: shared schema-driven reactive form renderer and validators.
- `src/app/features/claimant`, `officer`, and `management`: lazy-loaded role workspaces.
- `src/app/features/shared-claims`: reusable claim tracking/details UI.
- `src/app/Shared/feedback`: reusable loading, error, and notification components.
- `src/app/app-routing.module.ts`: application routes and feature loading.

## User roles and routes

- Claimant: `/claimant/dashboard`, `/claimant/submit-claim`, `/claimant/my-claims`, `/claimant/claims/:id`
- Claims Officer: `/officer/dashboard`, `/officer/claims`, `/officer/claims/:id`
- Manager: `/management/dashboard`, `/management/reports`
- Render-only shared claim form: `/form-builder`
- The root route opens the claimant dashboard.

Routes include descriptive `allowedRoles` metadata. The frontend uses OpenID Connect authorization code flow with PKCE and has no route guard. Backend authorization remains authoritative; protected operations require a valid token with the expected role and identity claims.

## Implemented features

- Claimant: Motor/Property selection, shared dynamic form, review/declaration, fixed-DTO submission, lookup by reference, status history, decision read, and additional-information text responses.
- Claims Officer: incoming/unassigned queues with backend pagination, page-local search/filter/sort, workload counts where an officer UUID is available, assignment/reassignment, assessment recording, approval/rejection confirmation, and available history/audit reads.
- Management: claims overview, market/date filters, distribution by market/category/status/officer, claim aging, turnaround/SLA reports, and financial amounts grouped by currency.
- Shared dynamic forms: text, textarea, number, email, date/date-time, dropdown, multi-select, radio, checkbox, toggle, file validation, and repeatable groups.
- Shared loading, empty, and error states, responsive layouts, and accessible labels for interactive inputs and charts.

## Existing API endpoints

- Claims: `POST /api/v1/claims`; `GET /api/v1/claims/{claimReference}`; `GET /api/v1/claims/{claimReference}/history`; `GET /api/v1/claims/{claimReference}/decision`; `GET /api/v1/claims/{claimReference}/audit`; `GET` and `POST /api/v1/claims/{claimReference}/information-requests`; `POST /api/v1/claims/{claimReference}/information-requests/{requestId}/responses`; `POST /api/v1/claims/{claimReference}/assessments`; `POST /api/v1/claims/{claimReference}/approval`; `POST /api/v1/claims/{claimReference}/rejection`; settlement operations under `/api/v1/claims/{claimReference}/settlements`.
- Staff: incoming/unassigned queues and officer workload/claim reads under `/api/v1/staff`; assignment history, assignment, and reassignment under `/api/v1/staff/claims/{claimReference}/assignments`.
- Management: `GET /api/v1/management/reports/{claims,aging,performance,sla}` with optional `marketCode`, `fromDate`, and `toDate` query parameters.
- Claimant notifications: `GET /api/v1/claimant/notifications`; `PUT /api/v1/claimant/notifications/{notificationId}/read`.

## API limitations

The backend currently has no claimant claims-list endpoint, published-form retrieval, or document upload/download/attachment APIs. Claim submission accepts a fixed `ClaimSubmissionRequest`, not dynamic schema answers. Tracking only returns reference, status, and submission date.

Officer queue/detail APIs omit claimant identity/contact, priority, estimated loss, and documents. Information-request creation and settlement proposal require claimant UUIDs not returned by claim reads. There is no staff directory or current-officer identity endpoint. Queue search and filters therefore apply only to the loaded API page; management reporting filters are limited to market and date.

Management reports do not expose monthly series, financial exposure by market/category, pending-decision counts, or category/status/officer filters. Financial totals remain grouped by currency; the frontend does not convert or combine currencies without conversion data. No mock backend or fabricated metrics are used.

## Build and tests

```powershell
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

The production bundle has an existing 500 kB warning budget and a 1 MB error threshold. See [DEVELOPMENT_JOURNAL.md](./DEVELOPMENT_JOURNAL.md) for ticket decisions and the latest verification record.
