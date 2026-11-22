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
- `/form-builder` (render-only claim form)

Existing user management routes (`/`, `/add`, and `/edit/:id`) remain available. User create/edit, claimant submission, the officer market filter, and `/form-builder` all use the shared schema-driven Dynamic Forms renderer. It supports text, textarea, number, email, date/date-time, dropdown, multi-select, radio, checkbox, toggle, file, and repeatable-group fields.

`/form-builder` is a render-only claims form route; it has no schema-authoring controls. It renders the claim-submission schema and submits through the same API flow as `/claimant/submit-claim`. The schema is frontend configuration aligned with the API request DTO because the backend does not expose an endpoint to retrieve form schemas. The route's `allowedRoles` metadata documents intended access but is not an authorization guard.

Claimant submission now guides the user through claim type selection, the shared dynamic form, review, declaration, and the existing claim submission endpoint. My Claims can look up a known reference, and claim details show available status history, decisions, and information requests. Published schema retrieval, document upload, and claimant-wide claim listing are not implemented because the backend has no corresponding endpoints. Dashboard totals, recent claims, and list filters therefore remain unavailable.

## API integration

`src/app/core/api/api-config.ts` centralizes the versioned API base path. Typed Angular `HttpClient` services integrate these existing endpoints:

- Claims: `POST /api/v1/claims`; `GET /api/v1/claims/{claimReference}`; claimant decision, information-request, status-history, and lifecycle operations under `/claims/{claimReference}`. Officer audit history is also available at `/claims/{claimReference}/audit`.
- Claimant notifications: `GET /api/v1/claimant/notifications`; `PUT /api/v1/claimant/notifications/{notificationId}/read`.
- Officer operations: incoming and unassigned claim pages, officer claim/workload reads, assignment history, assignment, and reassignment under `/api/v1/staff`.
- Management: claims, aging, performance, and SLA reports under `/api/v1/management/reports`.

Request/response TypeScript contracts are in `src/app/core/api`. The API’s camel-case enum JSON representation is reflected in the frontend types.

No backend API currently reads or writes configurable claim form schemas. Both claim-form routes use the shared renderer and map their answers to the existing fixed `ClaimSubmissionRequest` for `POST /api/v1/claims`. There is no schema fetch, save, publish, version, or archive API, and the frontend does not emulate one.

## Integration gaps

- The supplied Angular project did not contain authentication, JWT storage/handling, role or permission models, guards, or HTTP interceptors. This foundation does not add a competing authentication system. API endpoints still require the existing backend’s JWT and role claims; the frontend must be connected to the owning authentication implementation before protected requests can succeed. Route `allowedRoles` metadata documents intended access only and is not an authorization guard.
- The backend has no claimant claims-list endpoint. My Claims supports lookup by known reference, but claimant-wide rows, dashboard counts, list filters, sorting, and pagination cannot be populated without that endpoint.
- The backend has no form schema create/read/update/delete, draft/publish/archive, version association, or dynamic-answer submission endpoints. File-upload integration is also unavailable. The frontend renders its API-aligned schema and submits only the fixed claim DTO; custom schemas and supporting files cannot be fetched or persisted through the current API.
- The legacy user and skill-set services are retained, but their `/api/User` and `/api/SkillSet` endpoints are not provided by the claims backend.
- The backend Swagger UI is available at `http://localhost:5187/swagger/index.html` when the API is running in Development. The frontend development proxy forwards `/api` requests to `http://localhost:5187`.

See [DEVELOPMENT_JOURNAL.md](./DEVELOPMENT_JOURNAL.md) for implementation and verification notes.
