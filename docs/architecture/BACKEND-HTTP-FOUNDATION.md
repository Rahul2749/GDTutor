# Backend HTTP foundation — 2.2.3

**Updated:** 17 October 2026 · **Status:** Accepted on 17 October 2026  
[Review](../delivery/reviews/2.2.3-http-foundation.md) · [Progress](../delivery/PROGRESS.md) · [Generated OpenAPI](openapi/foundation-v1.json) · [Package admission](../reference/BACKEND-HTTP-PACKAGES.json)

This guide preserves the accepted 2.2.3 snapshot. The [2.3.1 integration guide](LIVE-API-INTEGRATION.md) documents the current delayed-read endpoint, contract artifact and live frontend connection.

## Delivered behavior

The .NET API now exposes controller-based HTTP contracts with camelCase JSON. `SystemController` delegates to the accepted Application sample service and maps its result into an explicit HTTP DTO. Domain/Application/Infrastructure references remain unchanged. All examples are nonpersistent; there is no course/student entity, database connection, provider call or authenticated operation.

| Method and path | Behavior | Availability |
|---|---|---|
| GET /api/v1/system/status | Sample label, actual UTC serverTime ending in Z, apiVersion v1, isDemonstration true, scope foundation, dependenciesVerified false | All environments |
| GET /health/live | Process liveness, status healthy, scope process, dependenciesVerified false | All environments |
| GET /health/ready | Runs checks tagged ready; healthy gives 200, unhealthy/degraded gives 503; bounded health DTO | All environments |
| GET /openapi/v1.json | OpenAPI generated from the actual discovered controllers, DTOs and response metadata | Development only |
| POST /api/v1/diagnostics/validation | Validates a required 1–80 character label; returns accepted/isDemonstration and saves nothing | Development only |
| GET /api/v1/diagnostics/failure | Fixed synthetic exception to inspect the safe 500 response | Development only |

MVC discovery removes the diagnostics controller outside Development. This is tested in both Production and Staging; it is not only hidden in documentation. There is no Swagger/Scalar UI or extra documentation service. The generated artifact captures the Development profile, including explicitly labelled diagnostics. The API root has no web page and returns a JSON 404.

Every application response receives `Cache-Control: no-store` and a server-generated `X-Trace-Id`. An incoming header with that name is ignored. There is no browser token/CORS/authentication policy in this leaf. Production ingress, TLS, authentication and protected operations are separate reviews.

## Errors and validation

`ApiProblems` owns stable error codes and safe ProblemDetails. `ApiExceptionHandler` handles unexpected exceptions; status-code pages fill otherwise empty error responses, including 404/405/415. All environments use the same safe response policy; Development never returns a stack trace. The 405 response retains Allow.

| Status | Current code | Covered trigger |
|---|---|---|
| 400 | validation_failed | Required/length checks, malformed/empty/wrong-type JSON, unknown fields, depth violation |
| 404 | not_found | Unmapped route or removed Development route |
| 405 | method_not_allowed | POST against the read-only status action |
| 413 | payload_too_large | Declared or streamed request body exceeding the foundation limit |
| 415 | unsupported_media_type | Unsupported content type on the validation demonstration |
| 500 | unexpected_error | Controlled Development exception or a failing sample adapter in a Production test host |

For example, a field error has type about:blank, title Bad Request, status 400, code validation_failed, traceId matching the response header, and errors.label containing a fixed safe message. No exception text, source path, raw URL, rejected value or JSON parser/type diagnostic is returned. Missing/malformed request-level data maps to errors.request. Only known DTO property names can become field keys; arbitrary JSON paths are never echoed. Future feature DTOs must supply reviewed, useful field messages and nested-field mappings as their forms are implemented.

The foundation accepts at most **64 KiB** per request body and JSON depth **32**, rejects unknown JSON members, and bounds the demonstration label to 80 characters. These are deliberately small foundation limits, not a quiz/question/import product limit. Feature-specific upload and large-exam contracts must review their limits when implemented. Kestrel enforces the streamed limit, while an early Content-Length check handles declared oversize before binding. Nested body-size exceptions retain 413 instead of becoming a generic validation 400. Protocol failures before the application pipeline, disconnected clients, and some rejected uploads can end with transport errors rather than a JSON body; do not claim every rejected byte stream can receive ProblemDetails.

The actual final streamed-upload check received HTTP 413. During testing, reusing a connection immediately after an early oversize rejection caused a reset before the next request reached the application; the streamed fixture now uses its own connection. Its harness fallback accepts a transport rejection only when the server independently recorded 413. An unrelated connection failure cannot satisfy the check.

Health endpoints intentionally use a small health DTO, including on readiness 503, rather than ProblemDetails. The ready check currently verifies only that the configured foundation host has started. It does not probe PostgreSQL, Razorpay, R2, YouTube, workers, email or production infrastructure. Dependency readiness must expand with actual adapters; healthy here does not establish launch readiness or 500-student capacity.

## Logging and trace correlation

The API writes JSON console logs with UTC timestamps and structured events:

- RequestCompleted / 1000: allowlisted HTTP method, matched route template (or unmatched), status, duration and TraceId.
- RequestFailure / 1001: status and TraceId, with no exception object, message or stack trace.

Logs omit raw paths/queries, request/response bodies, authorization/cookie/header values, and raw validation input. Unknown methods log OTHER. No user identity or student answer is logged. Framework ASP.NET request/error and health-check categories are disabled in this foundation to prevent duplicate unsanitized request/exception logs; the application owns the safe events. Other hosting/configuration lifecycle logs remain JSON. Revisit category coverage, retention, access and operational diagnostics when production infrastructure is selected; this is a tested policy for the covered surface, not blanket redaction of arbitrary future libraries or secrets.

The HTTP harness checks captured structured fields and matching failure/completion TraceIds. The published-host check separately verifies the actual JSON console provider and searches for synthetic query/header/exception/configuration fixture values. No real credential is used in testing.

## OpenAPI and dependencies

The built-in Microsoft generator describes the implemented controller paths, input constraints, DTOs, explicit error statuses and health responses. Schema/operation transformers document code, traceId and field errors, plus X-Trace-Id/no-store headers. The saved contract is OpenAPI **3.0.4**. Its 25 internal references were resolved locally. The generated document omits incoming Host-derived servers. It has no authentication scheme because authentication is not implemented. Frontend type generation and actual API calls remain 2.3.1.

Admitted packages: **Microsoft.AspNetCore.OpenApi 10.0.13** (exact direct API reference) and **Microsoft.OpenApi 2.12.2** (locked transitive dependency). Both are Microsoft-published MIT packages; signed official NuGet archives, source commits, SHA-256 hashes and retained notices are in the [admission record](../reference/BACKEND-HTTP-PACKAGES.json). Inner projects acquire no package/framework dependency. The existing harness inherits the API graph; no test-runner package was added. No package license fee, paid UI or hosted service is introduced.

[NuGet advisory output](../reference/BACKEND-HTTP-NUGET-AUDIT.json) reports no vulnerable packages across the five projects as checked on 17 October 2026. This finding does not guarantee undiscovered vulnerabilities. Keep the lockfiles and continue patch/advisory reviews.

## Reproduce and inspect

Run from the repository root using the already admitted SDK wrapper:

```powershell
./tools/backend/dotnet.ps1 restore GDTutor.slnx --locked-mode
./tools/backend/dotnet.ps1 build GDTutor.slnx -c Release --no-restore
./tools/backend/dotnet.ps1 run --project tests/GDTutor.FoundationChecks -c Release --no-build --no-restore
./tools/backend/dotnet.ps1 run --project tests/GDTutor.FoundationChecks -c Release --no-build --no-restore -- --http
./tools/backend/dotnet.ps1 format GDTutor.slnx --verify-no-changes --no-restore
./tools/backend/Verify-Architecture.ps1
./tools/backend/dotnet.ps1 publish src/GDTutor.Api/GDTutor.Api.csproj -c Release --no-restore -o .planning-review/backend/publish
./tools/backend/Verify-Startup.ps1
./tools/backend/dotnet.ps1 package list --project GDTutor.slnx --include-transitive --vulnerable --no-restore
```

For manual inspection, `./tools/backend/dotnet.ps1 run --project src/GDTutor.Api` uses the Development profile on loopback port 5080. Open [system status](http://127.0.0.1:5080/api/v1/system/status), [liveness](http://127.0.0.1:5080/health/live), [readiness](http://127.0.0.1:5080/health/ready), [OpenAPI](http://127.0.0.1:5080/openapi/v1.json) and [controlled failure](http://127.0.0.1:5080/api/v1/diagnostics/failure). Stop the manual host when finished. The automated checks dispose/stop their own hosts; no API server is left running by verification. Existing frontend previews are unchanged and still use mocks until 2.3.1.

Evidence: [19 HTTP checks](BACKEND-HTTP-CHECKS.json), [21 service regressions](BACKEND-HTTP-SERVICE-REGRESSION.json), [three published startup cases](BACKEND-HTTP-STARTUP-CHECKS.json) and [architecture/package guard](BACKEND-HTTP-ARCHITECTURE-CHECKS.json). Locked restore, zero-warning/error Release build, format verification and publish pass. Earlier 2.2.1/2.2.2 snapshots are preserved.

Primary references: [Microsoft API errors](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling-api?view=aspnetcore-10.0), [exception diagnostics](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-10.0), [OpenAPI generation](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/aspnetcore-openapi?view=aspnetcore-10.0) and [health checks](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-10.0).

Next proposed leaf is **2.3.1 — connect the frontend shell to the actual backend health/sample contract**, after this review. Schema work remains gated at 2.4.1.
