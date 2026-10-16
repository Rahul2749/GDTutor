# API conventions and conceptual contracts

**Prepared:** 16 October 2026 · **Subphase:** 1.6 · **State:** Accepted architectural conventions; examples are not implemented endpoints or persistence definitions.

[Architecture](APPLICATION-ARCHITECTURE.md) · [Progress](../delivery/PROGRESS.md) · [Business rules](../requirements/BUSINESS-RULES.md)

## 1. HTTP boundary

ASP.NET Core owns `/api/v1`. Use controllers, explicit request/response DTOs, OpenAPI and ordinary JSON with camelCase property names. Next never reads tables or implements a second copy of a use case. Endpoint handlers authenticate/authorize, validate and delegate; application services enforce current business/resource state. EF types are never serialized directly.

Use plural resource paths and HTTP methods consistently. `GET` is read-only; `POST` creates or invokes an explicit domain operation; `PUT` replaces a defined representation; `PATCH` is used only with a documented patch shape. No arbitrary JSON Patch document support by default. Return `201 Created` with `Location` for created resources, `200` with the resulting DTO when a client needs state, `204` for successful no-body updates and `202 Accepted` with an owned job/status location for durable asynchronous work. Never return success before the required state has committed.

Use `application/json` for normal JSON, `application/problem+json` for errors. Avoid a generic `{success,data,error}` wrapper duplicating HTTP semantics. An individual read returns its DTO; collections use `{items, page, pageSize, totalCount}` initially. Page starts at 1, default pageSize 20, maximum 100; use stable ordering with a unique tie-breaker and allowlisted filters/sort fields. Expensive reports/export and large banks may add documented cursor/job contracts instead. These are API defaults, not database-column decisions or a limit on quiz questions.

IDs are opaque strings to clients; source legacy IDs are staff/migration metadata, not authorization or predictable shared secrets. UTC timestamps use ISO 8601 with explicit `Z`; server time/deadlines are authoritative. User-facing class times also carry the relevant timezone semantics; do not infer timezone from a server locale. Money uses integer minor units plus currency (Razorpay-specific constraints verified in Phase 7); grades use the reviewed server precision/rounding rules, not floating-point browser totals.

## 2. Authentication, authorization and caching

- Browser uses relative same-origin paths and API-owned HttpOnly cookies. Obtain the antiforgery request token and send `X-CSRF-TOKEN` on applicable writes; never place tokens in URLs or logs. Do not use browser localStorage for authentication tokens.
- Return JSON ProblemDetails 401 for unauthenticated requests and 403 for denied operations, without an HTML login redirect. Use 404 where revealing another resource's existence would leak information; apply this consistently and test owner-scoped lookups.
- Check role plus assigned resource/entitlement/attempt ownership. Never accept userId, price, score, deadline or enrollment state from the browser as authoritative.
- Private reads/writes and previews use `Cache-Control: no-store`. Do not include correct answers, explanations before release, grade rules that expose answers or staff-only source metadata in student DTOs. Hiding UI fields is insufficient.
- Webhook endpoints are narrowly exempt from browser antiforgery and instead verify provider signatures over bounded original bytes. Restrict payloads, durably deduplicate and acknowledge only accepted events. Invalid signatures do not enqueue work.

## 3. Errors and diagnostics

Use [RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457.html) with `type`, `title`, `status`, safe `detail` where useful, optional safe `instance`, and extensions `code`, `traceId`, plus field `errors` for validation. `type: "about:blank"` is valid with the standard HTTP status title. Define stable application `code` values for client handling; human detail may change. The first error middleware/OpenAPI slice is 2.2.3, following [ASP.NET API error guidance](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling-api?view=aspnetcore-10.0).

| HTTP status | Meaning / client action |
|---|---|
| 400 | Malformed body, invalid input/field validation or failed browser antiforgery; show safe diagnostics. A confirmed antiforgery failure may refresh token and retry once where safe |
| 401 / 403 / 404 | Sign-in required / denied / absent-or-hidden resource; clear private state when appropriate |
| 409 | Business conflict, closed attempt, versioned workflow conflict, or idempotency key reused for a different request |
| 412 / 428 | Stale `If-Match` precondition / required version precondition missing; fetch and reconcile |
| 413 / 415 | Payload exceeds configured limit / unsupported media type; explain acceptable input |
| 429 | Rate limit; use `Retry-After` and preserve unsaved input |
| 500 / 503 | Unexpected or temporarily unavailable; show retry guidance and trace ID, never a stack trace/SQL/provider secret |

Conceptual field-validation response:

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "code": "validation_failed",
  "traceId": "sample-trace-01",
  "errors": {"title": ["Enter a question title."]}
}
```

The fetch client preserves status/code/traceId, handles cancellation distinctly, and associates field errors with controls. It does not parse text messages to infer business state. Unexpected error details go only to sanitized server diagnostics; payment/answer/source payloads are not echoed. Bound JSON depth/body size, string lengths, filenames and pagination before expensive work. Actual content/upload limits are reviewed against source cases rather than copied blindly from prototype limits.

## 4. Concurrency, retries and durability

Use strong ETags for mutable versioned resources where a precondition is required. `GET` supplies `ETag`; a write supplies that exact value in `If-Match`. Missing precondition yields 428, stale yields 412, and the server checks/updates atomically with the write. Last-write-wins must not silently replace a newer answer/draft. DTOs can expose a display revision, but that alone is not a trusted concurrency check.

Use `Idempotency-Key` on retryable side-effect operations (attempt start, answer save, submit, purchase/order creation and appropriate staff commands). Scope a key to authenticated actor, operation and target; include a canonical request fingerprint and preconditions. Atomically retain its result with the accepted change. Identical replay returns the original safe result without another side effect; different payload/precondition with the same key gives 409. Simultaneous same-key requests must converge. Resolve a completed matching replay before rejecting its now-stale original precondition. Unfinished work returns a documented in-progress response, never a second independent operation.

Retention is operation-specific and must cover the supported retry/reconnect window. Payment/attempt uniqueness and provider-event deduplication remain durable domain invariants even after an HTTP key expires. Do not use an instance-local dictionary or a browser-generated key as the only protection. Database representation/constraints are designed only after 2.4.1.

Retry GET requests only with bounded backoff where appropriate. A lost response after a write may mean the server committed; retry the same key/request or query its status. Reconcile state on a 412/409 rather than minting a key and forcing overwrite. Do not automatically retry a charge, refund or non-idempotent command without its durable operation protocol. Cancellation of a browser request does not prove server rollback.

For answers, serialize saves per affected resource and use a monotonic operation sequence/version; a delayed older request cannot overwrite a newer acknowledged answer. Flush pending changes before submit where possible, then let the server atomically enforce deadline/finalization rules. On reconnect, retrieve the authoritative saved version/deadline and resolve pending operations before reporting “Saved.” Define whole-attempt versus per-answer version granularity in 6.3.2; this convention does not invent persistence entities.

## 5. Conceptual operation map

Paths below illustrate intended ownership and result shape, not a frozen exhaustive contract. IDs, resource granularity and exact bodies are refined in each implementation review. They must never be used to infer tables before the database gate.

| Example | Owner and response boundary | Implementation |
|---|---|---|
| `GET /api/v1/system/status` | API sample contract with safe status/time/version; no database entity needed | 2.2.3 / 2.3.1 |
| `GET /api/v1/auth/antiforgery` | Same-origin request token, no-store; browser writes send it in the header | Phase 3 |
| `POST /api/v1/auth/login`, `POST .../logout` | .NET Identity cookie lifecycle; no browser bearer-token response | Phase 3 |
| `GET /api/v1/courses` | Public published listing DTO, stable pagination | 4.4 |
| `GET /api/v1/me/courses` | Current-user entitlement DTO; no userId supplied to impersonate another student | 5.2 |
| `POST /api/v1/quizzes/{quizId}/attempts` | Authorized start, snapshot/server deadline, durable idempotency; 201 | 6.3.1 |
| `PUT /api/v1/attempts/{attemptId}/answers/{questionId}` | Owner-scoped, version/idempotency/deadline checked, acknowledged saved revision | 6.3.2 |
| `POST /api/v1/attempts/{attemptId}/submit` | Shared finalization use case with deadline worker; durable result/status | 6.3.3 |
| `GET /api/v1/attempts/{attemptId}/result` | Release-filtered result; no hidden answers before configured release | 6.4 |
| `POST /api/v1/questions/{questionId}/publish` | Staff resource authorization, exact draft/profile validation job; 202 while pending | 6.1.1 / 6.1.4 |
| `POST /api/v1/imports/questions` | Authorized bounded DOCX intake, private original and issue report; 202 | 6.1.3 |
| `GET /api/v1/jobs/{jobId}` | Owner/authorized staff only; safe pending/running/succeeded/failed diagnostics | Relevant job feature |
| `POST /api/v1/orders`, `POST .../payments/razorpay/verify` | Server pricing/provider verification; durable order/payment operation | Phase 7 |
| `POST /api/v1/webhooks/razorpay` | Provider signature, durable event deduplication; no browser cookie dependency | 7.3 |

An illustrative attempt response contains only student-safe state:

```json
{
  "id": "sample-attempt",
  "quizId": "sample-quiz",
  "status": "inProgress",
  "serverTime": "2026-10-16T07:00:00Z",
  "deadline": "2026-10-16T10:00:00Z"
}
```

This does not establish an allowed duration for every quiz; duration is configurable and the maximum-duration fixture is 180 minutes. An attempt can be started earlier than shown, and the real response uses actual authoritative time/policy. Correct answers and unreleased explanation data are intentionally absent.

## 6. OpenAPI and foundation acceptance

Generate an explicit versioned OpenAPI artifact from the .NET HTTP surface, document statuses/auth/headers/examples, and generate frontend types only from admitted tooling when endpoints exist. Use [built-in ASP.NET OpenAPI support](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/overview?view=aspnetcore-10.0); production docs/UI access must be reviewed and restricted as appropriate. Schema-generation tooling does not authorize database generation.

2.1.5 may use labelled mocked contracts until the real backend exists. 2.3.1 demonstrates an actual health/sample request through the same-origin path, success, cancellation and controlled failure, with no fake enrollment or invented table. Authentication/CSRF, retries, concurrency, restart/replay, rate limits, sensitive-field filtering and 500-user capacity require meaningful runtime tests in their respective implementation leaves. This documentation is not evidence those tests pass.
