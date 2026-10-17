# Browser API client

`createApiClient()` uses relative same-origin `/api/v1/` JSON calls with no-store, cookie credentials and refused redirects. Pass a runtime decoder to `get` or `write`; handle the discriminated `ApiResult`. Writes need an explicit CSRF token; strong If-Match/idempotency headers are forwarded when supplied. Real operation adapters must require the headers their endpoint needs. No automatic retry, token storage, auth refresh or domain cache is implemented.

Default timeout is 15 seconds; response JSON limit is 1 MiB. Caller limits are bounded. Treat cancel/timeout/http/network/contract/configuration failures separately. Server messages are safe only under the accepted API error contract; display controlled summaries and explicitly mapped validation fields as text. Handle 401/403 and identity-state cleanup in feature/session code. Obtain generated DTOs from the real backend later; sample DTOs stay in api-preview.

See the repository guide at `docs/architecture/FRONTEND-API-FOUNDATION.md` for method signatures, tests and integration limits. No live API is supplied by this module.

Current 2.3.1 additions: foundation.ts validates real status/health DTOs; generated/foundation.ts contains two contract-derived types. The client permits only exact GET /health/live and /health/ready in addition to /api/v1 paths; health writes/queries are refused. See [live integration](../../../../../docs/architecture/LIVE-API-INTEGRATION.md). Generated types do not replace runtime validation.
