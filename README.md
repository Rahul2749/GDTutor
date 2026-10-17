# GD Tutor

Migration of the existing WordPress learning platform to React/TypeScript, .NET and PostgreSQL, with a modern mobile-first interface, light/dark themes, Razorpay payments and Cloudflare R2 image storage.

**Start here:** [Documentation index](docs/README.md)  
**Current work:** [Subphase progress tracker](docs/delivery/PROGRESS.md)  
**Working agreement:** [AGENTS.md](AGENTS.md)

## Project status

The [frontend scaffold](apps/web/README.md) now starts the production application's structure in `apps/web`, with a [local foundation preview](http://127.0.0.1:3000/). It is separate from the [question-editor experiment](experiments/question-editor/README.md). Planning/design documents, original screenshots and review evidence remain under their existing folders. Follow the progress tracker for review status; frontend foundation through 2.1.5 is accepted and the [backend project scaffold](docs/architecture/BACKEND-FOUNDATION.md) is accepted in 2.2.1. [Services/configuration](docs/architecture/BACKEND-SERVICES-CONFIGURATION.md) are accepted in 2.2.2. [HTTP foundation](docs/architecture/BACKEND-HTTP-FOUNDATION.md) is accepted in 2.2.3. [Live frontend/API integration](docs/architecture/LIVE-API-INTEGRATION.md) is accepted in 2.3.1 in the [local preview](http://127.0.0.1:3000/connection-preview?phase=2.3.1). Repeatable setup and schema/feature work remain later leaves.

Work proceeds one agreed subphase at a time: implement the item, verify it, present it for review, then wait for direction before starting the next item.

## Repository layout

```text
AGENTS.md          Persistent project instructions
README.md          Project entry point
apps/web/          Next.js/React/TypeScript frontend foundation
src/               .NET Domain/Application/Infrastructure/API boundaries
GDTutor.slnx       Backend solution; SDK pinned by global.json
docs/              Plans, requirements, evidence and delivery tracking
Project Files/     Original screenshots and ignored source-intake files
experiments/       Separately reviewed investigations; not production app foundations
tools/             Backend/frontend verification and source-intake helpers
```

Remaining application folders are documented in the [migration plan](docs/planning/MIGRATION-PLAN.md); create them only in their approved subphases. See [frontend instructions](apps/web/README.md) for install/check/run commands. PostgreSQL entities and migrations remain gated by owner-provided prior table/database structure at 2.4.1.

See the [backend guide](docs/architecture/BACKEND-FOUNDATION.md) for SDK bootstrap and build/run commands. The [HTTP guide](docs/architecture/BACKEND-HTTP-FOUNDATION.md) covers current status/health endpoints, Development-only OpenAPI and checks; the unmapped API root returns a JSON 404.
