# Live frontend/API integration — 2.3.1

**Updated:** 17 October 2026 · **Status:** Accepted by owner on 17 October 2026  
[Live preview](http://127.0.0.1:3000/connection-preview?phase=2.3.1) · [Review](../delivery/reviews/2.3.1-live-api-integration.md) · [Progress](../delivery/PROGRESS.md)

## Delivered behavior

The new connection preview uses the production browser fetch client against the real published .NET API. The browser requests the same website origin; narrow local Next rewrites forward the calls to loopback .NET. There is no browser mock, CORS dependency, dynamic target URL parameter, alternate business backend or database access. The older /api-preview remains explicitly mocked for its original review examples and now links to this live preview.

| Check in the preview | Actual request | Result |
|---|---|---|
| Service status | GET /api/v1/system/status | Current UTC server time, v1, demonstration label and foundation scope |
| Foundation readiness | GET /health/ready | Bounded foundation-only health DTO; no external dependency verification |
| Process liveness | GET /health/live | Process-only health DTO |
| Delayed read | GET /api/v1/diagnostics/delay | Development-only fixed two-second read; same sample DTO, honors cancellation |
| Timeout check | Same delayed endpoint, one-second client timeout | Explicit timeout feedback |
| Controlled server error | GET /api/v1/diagnostics/failure | Actual safe 500/code/traceId from .NET |

Use Check connection, Cancel request, Reset and explicit Retry check. Changing the selected check aborts/reset its previous result. Late responses cannot replace cancellation, timeout or a newer request. No automatic polling/retries or writes are introduced. Cancelling a browser request means the result is not applied; it does not promise that every intermediary stopped server work. The delayed API itself uses the bound cancellation token. Its duration is fixed and it accepts no arbitrary delay/work parameter.

The normal success panel renders only decoded DTO fields; it shows actual server time in English with explicit Asia/Kolkata display semantics. Foundation-only scope and dependencies not verified remain visible. This is an internal foundation preview, not a student feature screen or evidence of launch/capacity readiness. There are no accounts, enrollments, quizzes or durable operations in this slice.

## Routing and environment

`GDTUTOR_LOCAL_API_ORIGIN` is a **server/build-time local setting**. It is optional and must be an HTTP loopback origin, such as http://127.0.0.1:5080. IPv4 loopback, localhost and IPv6 loopback are allowed. Remote hosts, credentials, paths, queries, fragments, malformed ports, whitespace and normalized path tricks fail with a static configuration error. No rejected value is echoed. The setting is not NEXT_PUBLIC and no API address is passed to browser props.

When configured, only /api/v1/:path*, /health/live and /health/ready are forwarded. OpenAPI, arbitrary paths and arbitrary destinations are not proxied. The shared client retains its versioned API path guard, with two exact GET-only health exceptions. Health queries/trailing paths and health writes are refused before fetch. Same-origin credentials, no-store, redirect refusal, response limits and cancellation continue to apply. Browser checks verify actual backend trace/no-store headers survive forwarding.

Next rewrites are captured when building: **set the local setting before both build and start/dev; rebuild after changing it**. Keep it unset when making deployed artifacts. Do not deploy the local review build; production routing belongs to the reviewed TLS ingress, including deliberate health/operations access. This leaf does not provision that ingress or establish cookie/CSRF/security forwarding for authenticated operations.

The dynamic preview exposes local diagnostic choices only when the server has the local forwarding setting. The backend independently removes every diagnostic route outside Development. A locally configured frontend pointed at a Production API therefore gets a safe 404 for those operations; it cannot enable backend diagnostics. Status and health still work. The flag selects UI choices only and is not an authorization boundary.

## Contracts and source ownership

| Source | Responsibility |
|---|---|
| apps/web/src/lib/server/local-api.ts / next.config.ts | Validate local target and define three narrow rewrite rules |
| apps/web/src/lib/api/foundation.ts | Endpoint selection and strict runtime DTO validation |
| apps/web/src/lib/api/generated/foundation.ts | Two generated TypeScript DTOs, source contract SHA-256 in header |
| apps/web/src/features/connection/ | Preview interaction and compact theme-aware layout |
| apps/web/src/app/(public)/connection-preview/page.tsx | Dynamic route composition, local diagnostic UI flag and review links |
| .NET DevelopmentDiagnosticsController | Fixed delayed read, absent outside Development |
| .NET SystemStatusResponse.FromSample | Shared explicit mapping for immediate/delayed sample DTOs |

[Integration OpenAPI](openapi/integration-v1.json) is generated from the actual updated .NET controller surface. The accepted [2.2.3 artifact](openapi/foundation-v1.json) is preserved as a historical snapshot. The repository Node generator supports only the two selected flat string/boolean DTOs and fails when it encounters unsupported schema shapes. It is not a general OpenAPI client generator. Run it after refreshing the runtime document; --check detects stale generated output. It adds no package or code-generation service.

TypeScript types alone do not validate responses. Runtime decoders check required types, bounded sample label, v1, valid UTC calendar/precision, expected process/foundation scope and explicit demonstration/dependency flags. Unknown capability/version changes fail safely rather than displaying an unsupported readiness claim. Decoders project known values only. The error UI uses the existing safe HTTP summaries and optional trace reference; raw exception or proxy HTML never becomes page content.

## Local run and review

Use two PowerShell terminals from the repository root. Keep the commands in separate terminals because the hosts keep running.

API terminal:

```powershell
./tools/backend/dotnet.ps1 run --project src/GDTutor.Api
```

The Development launch profile uses loopback 5080. Frontend terminal:

```powershell
$env:GDTUTOR_LOCAL_API_ORIGIN = 'http://127.0.0.1:5080'
$env:NEXT_TELEMETRY_DISABLED = '1'
npm --prefix apps/web run build
npm --prefix apps/web run start
```

Alternatively use npm --prefix apps/web run dev with that same environment for local editing. The example assumes the admitted Node/npm are on PATH; [frontend setup](../../apps/web/README.md) and [SDK setup](BACKEND-FOUNDATION.md) explain existing runtimes. Do not enable production rewriting as a workaround for missing deployment ingress.

Open the live preview, run each check, cancel the delayed read, then retry a normal status request. Switch Light/Dark/System and resize to phone/tablet. The final review hosts were started on loopback 3000 and 5080 after automated tests finished. Their temporary PIDs are under the ignored review folder; stop the owned review processes when done. The automated browser suite uses its own API processes and stops them before returning.

## Verification and practical limits

- [35 browser checks](LIVE-INTEGRATION-CHECKS.json) pass against a production Next build and actual published API: status/health, delayed success, cancellation/replacement/timeout, real 500 and trace/log correlation, stopped-API failure, restart retry, Production diagnostic 404, keyboard/navigation cleanup and responsive themes. No route mocking, external request, write, page exception or unexpected console error occurred. Expected failed-resource console messages from intentional 404/500 cases are recorded separately.
- Both themes pass at 320, 360, 390, 768, 820, 1024, 1440 and 1920 pixels, plus 200% text at 320. Mobile controls retain 44px minimum height. Six final captures at 390/768/1440 were visually inspected for readable alignment and clipping. These are Chrome desktop viewport/media tests, not real-device, cross-browser or screen-reader certification.
- [Nine contract/routing checks](INTEGRATION-CONTRACT-CHECKS.json), [21 existing client regressions](INTEGRATION-CLIENT-REGRESSION.json), [19 backend HTTP regressions](INTEGRATION-BACKEND-HTTP-CHECKS.json), [21 service regressions](INTEGRATION-BACKEND-SERVICE-CHECKS.json) and [architecture guard](INTEGRATION-BACKEND-ARCHITECTURE-CHECKS.json) pass. New diagnostic path documentation/Production exclusion is included.
- Frontend production build (including TypeScript), lint and format checks pass. Backend Release build has zero warnings/errors; publish and format verification pass. Lockfiles/package versions are unchanged. No additional package, paid tool or service was introduced; existing exact-version admissions still apply.

Initial browser execution found two test synchronization issues: a transient Chrome response-body lookup on a health response and immediate assertion before the System-theme change event settled. The final tests verify the real health status/headers and decoded rendered state, and wait for the actual theme attribute/native color scheme. Application source did not need a change for either issue.

Backend outage through this local Next proxy currently returns an HTTP 500; the client displays a safe retry summary. It does not fabricate a backend trace ID or readiness result when no backend response exists. Future production ingress may return 502/503 and needs its own review. This is not authentication, durable-save, provider, load or deployment validation. PostgreSQL entities remain gated by prior table/database input at 2.4.1.

Primary routing reference: [Next rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites). Next proposed leaf: **2.3.2 — build/dependency checks and repeatable local/staging setup**, after owner review.
