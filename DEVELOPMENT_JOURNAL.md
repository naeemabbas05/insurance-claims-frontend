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
- API submission could not be verified against a running backend in the browser. The form uses the existing `POST /api/v1/claims` integration and surfaces API responses or errors.
