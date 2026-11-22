# CHUBB APAC Claims Frontend

Angular foundation for the CHUBB APAC claims-management API. The application preserves the original user-management screens while adding lazy-loaded claimant, claims-officer, and management areas, typed API clients, and shared feedback components.

## Requirements

- Node.js `^22.22.3`, `^24.15.0`, or `>=26.0.0` (required by Angular 22.3)
- npm
- The claims API running locally at `http://localhost:5187` for development API calls

## Run locally

```powershell
npm ci
npm start
```

The Angular development server proxies `/api` to `http://localhost:5187`. The backend exposes Swagger at `/swagger` only in its Development environment. In production, configure the hosting reverse proxy to route `/api/v1` to the claims API; no production API host is hard-coded.

## Build and tests

```powershell
npm run build
npm test -- --watch=false
```

The production build uses the current Angular application builder. Some first-party and Bootstrap assets may exceed the existing 500 kB warning budget; the configured 1 MB error budget remains the build failure threshold.

## Application areas

- `/claimant/dashboard`
- `/claimant/submit-claim`
- `/claimant/my-claims`
- `/claimant/claims/:id`
- `/officer/dashboard`
- `/officer/claims`
- `/officer/claims/:id`
- `/management/dashboard`
- `/management/reports`

Existing user management routes (`/`, `/add`, and `/edit/:id`) remain available. The reusable Form Builder and Dynamic Forms modules support typed text, numeric, date, textarea, select, and multi-select fields.

## API integration

`src/app/core/api/api-config.ts` centralizes the versioned API base path. Typed Angular `HttpClient` services integrate these existing endpoints:

- Claims: `POST /api/v1/claims`; `GET /api/v1/claims/{claimReference}`; claimant decision, information-request, status-history, and lifecycle operations under `/claims/{claimReference}`. Officer audit history is also available at `/claims/{claimReference}/audit`.
- Claimant notifications: `GET /api/v1/claimant/notifications`; `PUT /api/v1/claimant/notifications/{notificationId}/read`.
- Officer operations: incoming and unassigned claim pages, officer claim/workload reads, assignment history, assignment, and reassignment under `/api/v1/staff`.
- Management: claims, aging, performance, and SLA reports under `/api/v1/management/reports`.

Request/response TypeScript contracts are in `src/app/core/api`. The API’s camel-case enum JSON representation is reflected in the frontend types.

## Integration gaps

- The supplied Angular project did not contain authentication, JWT storage/handling, role or permission models, guards, or HTTP interceptors. This foundation does not add a competing authentication system. API endpoints still require the existing backend’s JWT and role claims; the frontend must be connected to the owning authentication implementation before protected requests can succeed. Route `allowedRoles` metadata documents intended access only and is not an authorization guard.
- The backend has no claimant claims-list endpoint. `/claimant/my-claims` explains this rather than fabricating records or calling a mock API. Claim submission and lookup by known reference are integrated.
- The legacy user and skill-set services are retained, but their `/api/User` and `/api/SkillSet` endpoints are not provided by the claims backend.
- The backend Swagger document was not available as a running service during this work; endpoint and DTO contracts were checked against its ASP.NET controller attributes and request/response types. Start the API in Development to view the generated OpenAPI document.

See [DEVELOPMENT_JOURNAL.md](./DEVELOPMENT_JOURNAL.md) for implementation and verification notes.
