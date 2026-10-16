# GD Tutor

Migration of the existing WordPress learning platform to React/TypeScript, .NET and PostgreSQL, with a modern mobile-first interface, light/dark themes, Razorpay payments and Cloudflare R2 image storage.

**Start here:** [Documentation index](docs/README.md)  
**Current work:** [Subphase progress tracker](docs/delivery/PROGRESS.md)  
**Working agreement:** [AGENTS.md](AGENTS.md)

## Project status

The [frontend scaffold](apps/web/README.md) now starts the production application's structure in `apps/web`, with a [local foundation preview](http://127.0.0.1:3000/). It is separate from the [question-editor experiment](experiments/question-editor/README.md). Planning/design documents, original screenshots and review evidence remain under their existing folders. Follow the progress tracker for review status; themes, application features and backend have their own later leaves.

Work proceeds one agreed subphase at a time: implement the item, verify it, present it for review, then wait for direction before starting the next item.

## Repository layout

```text
AGENTS.md          Persistent project instructions
README.md          Project entry point
apps/web/          Next.js/React/TypeScript frontend foundation
docs/              Plans, requirements, evidence and delivery tracking
Project Files/     Original screenshots and ignored source-intake files
experiments/       Separately reviewed investigations; not production app foundations
tools/             Reproducible source-intake helpers
```

Remaining application folders are documented in the [migration plan](docs/planning/MIGRATION-PLAN.md); create them only in their approved subphases. See [frontend instructions](apps/web/README.md) for install/check/run commands. PostgreSQL entities and migrations remain gated by owner-provided prior table/database structure at 2.4.1.
