# Frontend API and form foundation — 2.1.5

**Updated:** 16 October 2026 · **Status:** Accepted through owner “we can go further” on 16 October 2026  
[Preview](http://127.0.0.1:3000/api-preview) · [Review](../delivery/reviews/2.1.5-api-conventions.md) · [Architectural contract](API-CONVENTIONS.md)

The [2.3.1 integration guide](LIVE-API-INTEGRATION.md) describes the current live preview and two exact GET-only health path exceptions. This document preserves the accepted mocked 2.1.5 snapshot.

## Delivered boundary

A framework-independent JSON client, per-consumer request-state hook, field-error/focus helpers and English display utilities implement the frontend side of the accepted conventions. There is no backend endpoint, authentication session, generated OpenAPI DTO, persistence or provider integration in this leaf. `api-preview` injects a local mock transport; it never calls the network for its sample reads or writes. Its DTO and example field rules are expressly preview fixtures.

| Source | Responsibility |
|---|---|
| `apps/web/src/lib/api/client.ts` | Same-origin request construction, bounded JSON reading, decoding, cancellation/timeout and response metadata |
| `apps/web/src/lib/api/errors.ts` | Safe HTTP summaries, stable code/trace metadata, bounded validation fields and Retry-After guidance |
| `apps/web/src/hooks/use-api-request.ts` | Idle/loading/success/error/cancelled state; abort/reset/unmount handling and sequence guard against stale feedback |
| `apps/web/src/lib/forms.ts` | Explicit API-to-control mapping and focus of the first rendered invalid control |
| `apps/web/src/lib/format.ts` | English `en-IN` currency and UTC-to-explicit-timezone display |
| `apps/web/src/app/(public)/api-preview/` | Labelled request/form fixtures and local mock transport; no production domain DTO |

## Request contract

Create a client with `createApiClient()` for browser same-origin fetch. Tests/previews pass an injected `typeof fetch` transport that honors AbortSignal. `get(path, decoder, options)` and `write(method, path, body, decoder, options)` return a discriminated `ApiResult<T>` rather than throwing ordinary request failures. Decoder input is unknown and must be checked by the consuming endpoint adapter. Success includes data, HTTP status and the exact returned ETag; `204` supplies null to the decoder explicitly.

Only relative `/api/v1/` paths are admitted. Normalized traversal outside that prefix, absolute/protocol-relative addresses, fragments, backslashes and control/space characters are refused before transport. Fetch uses same-origin credentials, no-store and redirect:error. JSON media types are checked; malformed/unsupported/schema-invalid responses produce a contract failure. JSON bodies are read with a default 1 MiB response limit, configurable up to 20 MiB. Default timeout is 15 seconds, configurable up to 120 seconds. These are client JSON safeguards, not upload/course/exam limits.

Writes require a caller-supplied antiforgery token and serialize JSON. Optional strong If-Match and Idempotency-Key values are validated and forwarded exactly. The operation adapter must require the headers applicable to its actual endpoint. This layer does not fetch or persist auth tokens, mint operation keys, infer business state, automatically replay writes or refresh CSRF tokens. Server issuance/validation, ETag atomicity and durable idempotency must be implemented in the later backend/account/feature leaves. Do not supply the preview token to real requests.

Failure kinds are http/network/cancelled/timeout/contract/configuration. HTTP status comes from the response, not a contradictory body status. Controlled English summaries accompany status; bounded code/trace identifiers remain available. Untrusted title/detail/HTML and nonvalidation error-field payloads are not rendered. Validation messages are treated as server-approved safe user text, bounded and rendered as React text only; the real API must still redact secrets. Explicit field mapping prevents unknown server keys from being silently applied to unrelated controls. Keep a summary for unmapped errors.

Retry-After seconds/date forms are surfaced as bounded wait guidance. The client does not schedule retries or enforce a rate-limit clock; the consuming feature must respect current server guidance before offering a retry. 401/403 are data results, not HTML redirects. Login/permission flows and private-state cleanup remain Phase 3 responsibilities. Do not reuse state across identity changes; reset/remount consumers then. Session, secrets and raw response diagnostics are never written to localStorage or logs by this code.

Cancellation is distinct from timeout. Replacement, reset and unmount abort the active request; sequence checks stop older callbacks from replacing newer state. Client cancellation does not establish server rollback. Features must reconcile uncertain writes using the server’s operation protocol. This generic hook is not the future serialized quiz answer-save queue or a global cache.

## Form and formatting conventions

Keep user input in the consuming form after failures. Clear stale field feedback when values change, prevent repeat submission while pending, map only known field names, retain visible error summaries and focus the first invalid control after rendering. Busy states and linked field labels/errors use the accepted shared UI. Real rules are owned by feature/API contracts; the sample title-length/error trigger is not a course/question validation decision.

`formatMoney` accepts safe integer minor units and an uppercase three-letter currency, then uses Intl currency precision (including JPY/KWD differences). It performs display conversion only, not price, payment or grade calculations. `formatDateTime` requires an explicit valid UTC timestamp, uses English formatting and defaults to Asia/Kolkata; callers can pass the reviewed event timezone. Server deadlines/time remain authoritative. Invalid inputs throw a RangeError for the feature boundary to handle rather than displaying a fabricated zero/date.

Owner clarification: application and preview text is English-only. The previous Hindi wrapping sample was replaced with English. Original export/reference evidence remains unchanged.

## Demonstration and checks

Run the [preview](http://127.0.0.1:3000/api-preview). Exercise success, slow/cancel, timeout, connection failure, 503, 401, 429 and malformed response. Submit a short title for a local error, `error` for a mock field response, then correct it. Try editing while pending. Sample reads/writes never issue `/api/v1` requests and never save anything.

- [Client checks](../design/API-CLIENT-CHECKS.json): 21 passing transport/contract/security/error/formatting cases, compiled from the actual TypeScript using real Response/Abort APIs and injected transports.
- [Browser checks](../design/API-PREVIEW-CHECKS.json): 35 passing state/form/focus/retained-input/stale-request checks and both themes at eight viewport widths, plus 200% text reflow; six captures, with per-capture visual flags. No console/page errors, external requests, API requests or writes observed.
- [Shell regression](../design/RESPONSIVE-SHELL-CHECKS.json): 90 checks pass after the English-only copy correction.
- Production build, lint, strict types and format checks pass. These checks do not certify the backend, real devices, every browser, screen readers, load capacity or production auth/concurrency protocols.

From repository root, compile with `node apps/web/node_modules/typescript/bin/tsc -p tools/frontend/api-checks.tsconfig.json`, then run `node tools/frontend/verify-api.cjs`. Output is ignored under `.planning-review/api-tests`. With the production preview running, execute `node tools/frontend/verify-api-preview.cjs`; configure PLAYWRIGHT_MODULE/CHROME_PATH as with existing browser helpers. Run frontend scripts from apps/web or use npm --prefix apps/web. No test framework/package was added.

No new dependency, paid tool, provider, schema or backend artifact is introduced. Next proposed leaf is **2.2.1 — .NET Clean Architecture solution/project setup**, after owner review. PostgreSQL entities/mappings/migrations remain gated by owner structure input at 2.4.1.
