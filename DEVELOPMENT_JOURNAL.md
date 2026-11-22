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
