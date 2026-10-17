# API composition and HTTP boundary

Program composes accepted services/settings and the 2.2.3 HTTP foundation. It validates scopes/build settings, validates startup options and returns configuration exit code 78 on invalid settings. SystemController delegates to the nonpersistent Application sample service. HealthController exposes process/foundation-only checks. Development diagnostics are removed from controller discovery in all other environments.

HTTP errors use safe ProblemDetails, no-store and server X-Trace-Id. Request/failure events use structured JSON without raw paths, bodies, queries, credentials or exception details. Built-in Microsoft OpenAPI is the only new package graph. No authentication, frontend proxy, provider or database is configured.

Run `./tools/backend/dotnet.ps1 run --project src/GDTutor.Api` from the repository root; Development listens on loopback 5080. Inspect `/api/v1/system/status`, `/health/live`, `/health/ready` and `/openapi/v1.json`. The root returns JSON 404. Production/Staging require an explicit HTTPS Application public origin; docs and diagnostics are absent there.

See [current HTTP guide](../../docs/architecture/BACKEND-HTTP-FOUNDATION.md), [accepted settings guide](../../docs/architecture/BACKEND-SERVICES-CONFIGURATION.md) and [package admission](../../docs/reference/BACKEND-HTTP-PACKAGES.json). Database structure input remains required at 2.4.1.

2.3.1 adds a fixed two-second Development-only diagnostic sample read with cancellation and a shared DTO mapping. See [live frontend integration](../../docs/architecture/LIVE-API-INTEGRATION.md). No provider/database dependency was added.
