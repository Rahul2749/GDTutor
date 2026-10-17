# Shared utilities

API JSON transport and safe failure contracts live in api/. forms.ts maps allowlisted server fields and focuses the first invalid control after rendering. format.ts uses English Intl display with integer minor units and explicit UTC/event timezone. Shared code imports no routes or business features.

The 2.1.5 guide is docs/architecture/FRONTEND-API-FOUNDATION.md. Consumers own runtime DTO validation, real business rules, sessions, server state and form inputs. Browser-local appearance settings remain independent of authentication. The api-preview uses an injected local transport; it does not connect to a backend.
