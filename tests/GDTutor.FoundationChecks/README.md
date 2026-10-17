# Backend foundation checks

The console harness uses the existing ASP.NET shared framework and actual API composition. It inherits the API's two admitted OpenAPI packages, with no additional test runner dependency. Fake adapters/clock/health checks stay in this verification project.

From the repository root:

```powershell
./tools/backend/dotnet.ps1 run --project tests/GDTutor.FoundationChecks -c Release
./tools/backend/dotnet.ps1 run --project tests/GDTutor.FoundationChecks -c Release -- --http
```

Default mode runs 21 actual Host/DI/options/service checks. HTTP mode runs 19 checks against temporary loopback Kestrel hosts in Development/Production/Staging, then disposes them. It writes the generated Development OpenAPI document to the ignored review folder. Both modes output JSON and return a nonzero exit on failure. No database/provider calls, real credentials, frontend integration or capacity test is included.

See [HTTP evidence](../../docs/architecture/BACKEND-HTTP-CHECKS.json) and [current guide](../../docs/architecture/BACKEND-HTTP-FOUNDATION.md). Published-process JSON-console/startup checks are separately run by tools/backend/Verify-Startup.ps1 after publishing.
