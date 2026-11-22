# Development Journal

## Ticket 1 — Frontend foundation and API integration

### Project inspection

- The requested `Assignment-FE` source was copied into the root `insurance-claims-frontend` checkout; the nested temporary clone was removed.
- The existing application was Angular 14.2, using NgModules, strict TypeScript, Bootstrap, and a small dynamic user form builder.
- The supplied Angular project contained no auth service, JWT/token store, role/permission model, guard, or HTTP interceptor. No authentication behavior was replaced or recreated.
- The backend is an ASP.NET Core API with URL-segment versioning (`/api/v1`), JWT bearer authentication, role authorization, and Development-only Swagger. DTOs and endpoints were reviewed in the controllers and models.

### Changes

- Upgraded Angular, CLI, compiler, and build tooling to 22.3.0 and moved production builds to the modern application builder. Set the supported Node.js engine range.
- Added lazy-loaded Claimant, Claims Officer, and Management feature modules and the requested routes, while retaining the existing user-management routes.
- Added typed `HttpClient` services and DTOs for claims, lifecycle actions, officer operations, claimant notifications, and management reports.
- Centralized the claims API base path and configured a local Angular development proxy to the backend’s `http://localhost:5187`.
- Added shared loading, error, and notification components.
- Split reusable Form Builder and Dynamic Forms modules and replaced the legacy multi-select dependency with a native multi-select control.
- Replaced the README with project setup, API, route, and limitation documentation.

### Verification

- `npm ci` installed the Angular 22 dependency set.
- `ng build` completed successfully using Angular 22.3.0 and Node.js 22.22.3.
- `ng test --watch=false` completed with all 7 tests passing.
- The existing 500 kB initial bundle warning remains; the configured 1 MB production error budget is satisfied.

### Known limitations

- No frontend authentication implementation existed to reuse. Route role metadata is descriptive only; protected API calls require the separate JWT/role integration.
- No backend endpoint lists a claimant’s claims. The “My claims” route reports this gap instead of returning mock data.
- The generated Swagger endpoint was not queried live; route templates and DTO shapes were verified against backend controller attributes and model types.
- Existing `/api/User` and `/api/SkillSet` services remain for compatibility, but those endpoints are outside the claims backend contract.

## Ticket 2 — Dynamic claims form builder

### Backend capability review

- Re-inspected the claims API controllers and DTOs before implementing the editor. The API has claim submission and tracking endpoints, but no form-schema CRUD, draft, publish, archive, version, or dynamic-answers endpoints.
- The existing claim submission DTO is fixed-shape and cannot accept arbitrary answers from a configured schema. No mock endpoint, local-storage substitute, fabricated success response, or new API client was added.
- The existing application still has no frontend authentication/authorization guard to enforce form-editor access. The route carries descriptive `allowedRoles` metadata for Claims Officers and Managers only.

### Changes

- Added the lazy-loaded `/form-builder` workspace with a field palette, editable canvas, field properties panel, responsive styling, and officer/management navigation links.
- Added Motor, Property, and blank in-memory starting schemas, unique field IDs/keys, field/section CRUD, field ordering through Angular CDK drag-and-drop, and configuration for options, file constraints, validation messages, and conditional visibility.
- Integrated live preview with the shared reactive dynamic renderer. It supports built-in validators, file checks, multi-select, date/time, and repeatable groups via `FormArray`; hidden conditional fields and repeatable arrays are disabled and excluded from form values. Hidden repeatable arrays are cleared and restored to their configured minimum when shown again.
- Save and Publish controls explicitly report that the operation was not performed because the backend capabilities are missing. No claim is submitted from preview.
- Raised the per-component-style build budget to 8 kB warning / 10 kB error to accommodate the new editor stylesheet; the existing initial bundle warning budget remains unchanged.

### Verification

- Refreshed `package-lock.json` for the declared Angular CDK dependency and completed a clean `npm ci`.
- `npm run build` succeeds. The existing initial-bundle budget warning remains (767.37 kB versus 500 kB); the 1 MB error budget is satisfied.
- `npm test -- --watch=false` passes all 11 tests at this stage, including hidden-value omission, conditional repeatable-group disable/restore, field add/remove, and visibility-reference updates.

### Limitations

- Form schemas are editable only in the current page session. Draft persistence, retrieval, publication, archive, form version retention on claims, and claimant rendering from a published schema require backend APIs.
- The builder's live preview does not submit claims. The claimant page uses the shared renderer but maps to the existing fixed `/api/v1/claims` DTO; it does not persist arbitrary schema answers.
- File selection is validated in the browser only; there is no upload endpoint.
- Role metadata and navigation do not provide authorization enforcement until the application's actual auth/permission integration is connected.

## Follow-up — Shared rendering for application forms

### Changes

- Migrated user create/edit and the Claims Officer market filter to the shared Dynamic Forms renderer. Migrated claimant submission to the same renderer while preserving the existing fixed claim DTO and API request.
- Added a reusable generic schema shape, date-time input/validation, multi-select options, initial values for edit forms, configurable submit labels, and submit disabling while requests are active.
- Removed the unused legacy `FormBuilderComponent`, metadata-driven `DynamicFormFieldsComponent`, `MetaModel`, `userMeta`, and unused `InputComponent`. User and skill-set API services and user-management routes remain in place.
- The user form, officer filter, and claimant submission schemas are defined as frontend configuration because the backend has no general form-schema endpoint. They use the common renderer but are not loaded from or edited by the claims form-builder page.
- Added tests confirming user form values retain the existing user API shape and claimant form values map to the existing fixed claims request.

### Verification

- The previous `npm test -- --watch=false` run passed all 13 tests, including the user API mapping and claimant fixed-DTO mapping; that run predates the readiness change.
- New-user forms now render without waiting for the SkillSet request; edit forms continue to wait for the user record. A regression test covers rendering while SkillSet is still pending.
- Browser verification confirmed `/add` renders the shared user form without a loading screen. The SkillSet endpoint was not available during one browser attempt, so user API integration was not validated end-to-end.
- `npm run build` succeeds. The initial bundle is 763.60 kB and exceeds the existing 500 kB warning budget, but remains below its 1 MB error budget.
- The final unit-test rerun was not completed.

## Follow-up — Render the API-aligned form at `/form-builder`

### Changes

- Removed the schema-authoring screen and its palette, canvas, and property editor. `/form-builder` now renders the shared claims form for Claimants, Claims Officers, and Managers, with no form-building controls.
- Reused the claimant submission component and its existing API mapping. Submissions call `POST /api/v1/claims`; API success and errors are handled by the same flow as `/claimant/submit-claim`.
- Updated workspace navigation to call this a “Claim form” rather than a “Form builder.”
- The claims API accepts a fixed `ClaimSubmissionRequest` and does not provide a form-schema endpoint. The displayed schema is therefore frontend configuration aligned to that request DTO, not JSON fetched from the API.

### Verification

- `npm run build` succeeds. The initial bundle is 753.75 kB, above the 500 kB warning budget but below the 1 MB error budget.
- Browser verification confirmed `/form-builder` renders the claim fields and submit button with no schema-authoring controls.
- The route declares Claimant, Claims Officer, and Manager roles; role metadata remains descriptive because no authorization guard is present in the supplied frontend.
- The supplied Swagger URL is reachable. Its contract confirms `POST /api/v1/claims`, the existing `ClaimSubmissionRequest` body, `Idempotency-Key` header, and `ClaimSubmissionResponse`.
- `GET /api/v1/status` returned `running` both directly and through the frontend `/api` proxy. No claim was submitted during verification to avoid creating a test record.

## Ticket 3 — Claimant submission and tracking

### Contract review

- Reused the existing claims API DTOs and clients. Available claimant operations are `POST /api/v1/claims`, `GET /api/v1/claims/{claimReference}`, `GET /api/v1/claims/{claimReference}/history`, `GET /api/v1/claims/{claimReference}/decision`, `GET /api/v1/claims/{claimReference}/information-requests`, and `POST /api/v1/claims/{claimReference}/information-requests/{requestId}/responses`.
- The existing notifications operations are `GET /api/v1/claimant/notifications` and `PUT /api/v1/claimant/notifications/{notificationId}/read`.
- The backend contract has no claimant claims-list, published-form read, upload, or document attachment endpoint. Claim submission only accepts the fixed `ClaimSubmissionRequest`; tracking returns only reference, status, and submitted time. The live API was unavailable during initial inspection but responded during final verification: `GET /api/v1/status` returned `running`, and live Swagger confirmed these contract details. Its status enum is `submitted`, `underReview`, `awaitingInformation`, `assessmentInProgress`, `approved`, `declined`, `settled`, and `closed`.
- No frontend authentication service, token handler, guard, or permission model is present in this checkout. Existing route role metadata is descriptive; API authorization remains the backend's responsibility.

### Changes

- Reworked claimant submission into claim-type selection, the shared Dynamic Form Renderer, review, declaration acceptance, and API submission. The selected Motor or Property value is sent through the existing fixed DTO and successful submissions show the generated reference.
- Added a reference lookup to My Claims using the existing tracking endpoint. Dashboard totals, recent-claim rows, category/status filters, sort, and pagination remain explicitly unavailable without a claimant list endpoint; no local or sample claim records are created.
- Expanded shared claim details with backend status history, decision details, information-request viewing, and claimant text responses. Existing backend permissions govern these requests. Policy/incident fields and attached files are not returned by tracking.
- Documented in the submission flow that published schemas and document uploads cannot be loaded or persisted without corresponding API operations. No mock upload, schema source, or claim data was added.

### Verification

- `npm.cmd run build` succeeds. The initial bundle is 768.73 kB, above the existing 500 kB warning budget and below the 1 MB error budget.
- Live contract verification succeeded against `http://localhost:5187`. No claimant login, submission, or persistence verification was performed because this frontend contains no claimant authentication/token integration and no claimant credentials were supplied. The acceptance test remains incomplete pending that access.
- Ticket 4 was not started at the time Ticket 3 was recorded; it was subsequently started after the explicit Ticket 4 request.

## Ticket 4 — Claims officer workbench and assessment

### Live API contract review

- Queried `http://localhost:5187/swagger/v1/swagger.json`; the API exposes `GET /api/v1/staff/claims/incoming`, `GET /api/v1/staff/claims/unassigned`, `GET /api/v1/staff/officers/{officerId}/claims`, `GET /api/v1/staff/officers/{officerId}/workload`, `GET /api/v1/staff/claims/{claimReference}/assignments`, `POST /api/v1/staff/claims/{claimReference}/assignments`, and `POST /api/v1/staff/claims/{claimReference}/assignments/{assignmentId}/reassign`.
- Existing claim operations include tracking, status history, audit, decision, information-request reads and responses, assessment recording, approval, rejection, information-request creation, and settlement proposal/approval/payment.
- Queue rows contain only claim reference, policy number, market, claim type, status, incident/submission dates, and active assignment data. They omit claimant identity/contact, priority, and estimated loss. Individual tracking returns reference, status, and submission time. There is no staff directory or current-officer identity API.
- Information-request creation requires `claimantId`; settlement proposal requires `payeeClaimantId`. Neither is returned by any available claim read. No required-document fields or upload/download API exist. The management report is not used as an officer dashboard source because it is a separate management API.
- No frontend authentication/token integration exists in this checkout. Officer route `allowedRoles` metadata is descriptive; backend authorization and business rules remain authoritative.

### Changes

- Replaced the officer placeholder dashboard with live incoming and unassigned totals and optional workload lookup by officer UUID. Other status-specific totals are marked unavailable because there is no dashboard aggregate endpoint; a single page is not treated as a global count.
- Implemented incoming/unassigned queue switching, backend pagination, and page-local search, status/category filters, and sorting. Queue fields absent from the response are visibly unavailable; no claimant or financial data is fabricated.
- Added a professional officer assessment route with available claim details, assignment history, assignment/reassignment by officer UUID, assessment recording, approval/rejection review and confirmation, decision/audit history, information-request viewing, and post-action refreshes. Responses are displayed from API results without optimistic status changes.
- Request creation and settlement actions are explicitly unavailable because the backend requires claimant UUIDs not exposed by the read APIs. Required documents, claimant details, priority, estimated loss, and uploaded documents are also unavailable under the current contract.
- Updated the stale claims API unit assertion to use the configured `API_BASE_URL` rather than a relative URL.

### Verification

- Live status returned `running`; live Swagger was inspected for actual route templates and DTO fields.
- `npm.cmd run build` succeeds. Initial bundle is 771.26 kB, above the existing 500 kB warning and below the 1 MB error budget.
- `npm.cmd test -- --watch=false --browsers=ChromeHeadless` passes all 11 existing unit tests. The first run exposed the stale API URL expectation; it was updated and the suite passed on rerun.
- The officer acceptance test was not run end-to-end: no officer login/token integration or test credentials were supplied, so assignment and decision operations were not submitted to the backend. Persistence remains unverified. Ticket 5 has not been started.

## Ticket 5 — Management reporting and final quality

### Live API contract review

- Rechecked live Swagger for the existing `GET /api/v1/management/reports/claims`, `/aging`, `/performance`, and `/sla` endpoints. All accept optional `marketCode`, `fromDate`, and `toDate`; category, status, and officer filters are not supported.
- Claims reporting supplies totals, unassigned counts, status/market/type distributions, active workload by officer, and aggregate financial amounts grouped by currency. Aging, performance, and SLA endpoints supply open-claim aging buckets, turnaround/pending metrics, and SLA figures.
- The report DTO contains no monthly series, no financial exposure breakdown by market or category, and no pending-decision aggregate. Financial values remain grouped by currency; no conversion or cross-currency sum is calculated.
- Read-only unauthenticated checks returned HTTP 401 for management reports and staff queue routes. The backend is enforcing authentication. No frontend authentication/identity integration or credentials are available for role-authenticated checks.

### AI-assisted engineering decisions and changes

- Based on the Ticket 5 request, inspected actual Swagger paths and DTOs before changing dashboards. Metrics and charts are bound to report values only; unsupported dimensions are labelled unavailable instead of derived from incomplete rows.
- Added management market/date filters, accessible distribution bars for markets/categories/statuses/officer workloads, aging/performance/SLA sections, and per-currency exposure/approved liability lists.
- Added management dashboard counts from API status totals and open-claim aging. “Pending decisions” remains unavailable because it is not a reporting DTO field.
- Corrected both development and production claims API URLs to relative `/api/v1`; development calls now pass through the configured `/api` proxy. Verified `GET http://localhost:4300/api/v1/status` returns `running` through that proxy.
- Removed unused `@angular/cdk` and `@angular/animations` dependencies after repository-wide import checks; refreshed npm metadata through `npm uninstall`.
- Replaced the README with project overview, stack, installation, environment/API configuration, architecture, roles/routes, features, endpoints, and backend limitations.
- Captured portal screenshots under `artifacts/screenshots/` for claimant dashboard/submission, officer dashboard/queue, and management dashboard/reports. API-backed views are unauthenticated because no login integration is present.

### Final verification

- `npm.cmd run build` passes after final changes. Initial bundle is 768.13 kB, above the configured 500 kB warning threshold and below the 1 MB error threshold.
- `npm.cmd test -- --watch=false --browsers=ChromeHeadless` passes all 11 existing tests. The first sandboxed Chrome launch failed; rerunning Headless Chrome outside the sandbox completed the suite successfully.
- `git diff --check` reports no whitespace errors. `npm ls --depth=0` completed; unused `@angular/cdk` and `@angular/animations` were removed.
- API checks: live Swagger is readable; `GET /api/v1/status` returns `running`; the development `/api/v1/status` proxy returns `running`; unauthenticated report and staff queue calls return 401. These verify routing and backend authentication enforcement, not authorized business operations.
- Captured six portal screenshots in `artifacts/screenshots/`. The claimant/officer/management workspaces render; protected API panels remain in loading or unauthenticated states because no app login/token integration exists. Screenshots do not demonstrate authenticated data.
- Authenticated integration, role-specific authorized-route checks, and full claimant/officer/management workflow persistence checks could not run without identity-provider integration and test credentials. Document upload, claimant list/published forms, officer claimant-UUID operations, and unsupported report dimensions remain backend gaps described above.
- Git history was reviewed for delivery reporting. No commit was created for the current uncommitted Ticket 5 work.
- No subsequent ticket was started.
