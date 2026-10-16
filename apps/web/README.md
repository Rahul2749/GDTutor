# GD Tutor frontend

Initial Next.js App Router / React / TypeScript scaffold for **2.1.1**. This is the production frontend's starting structure, separate from the isolated editor experiment. The current page is a foundation preview, not the finished homepage.

## Requirements and local start

Use a current patched **Node 24 LTS** runtime and **npm 11**. The lockfile pins dependencies; `packageManager` records npm 11.13.0. Verification in this workspace uses Node 24.19.0/npm 11.13.0; this is a tested tool version, not a claim that it is the latest runtime patch or the production image choice. Recheck runtime advisories/patches before deployment.

From `apps/web`:

```powershell
npm ci --ignore-scripts
npm run dev
```

Open [the local frontend](http://127.0.0.1:3000/). The scripts bind to loopback and fail if the selected port is occupied; select a free port explicitly with `npm run dev -- --port 3001` if necessary. The editor prototype remains separately available on its own port.

No environment file, database, account or provider key is required. Optionally copy `.env.example` to `.env.local` for local settings; that file is ignored. Do not place secrets in `NEXT_PUBLIC_*`. There is no backend URL or pretend API response in this leaf. Telemetry can be disabled with `NEXT_TELEMETRY_DISABLED=1` as shown in the example environment file.

The project `.npmrc` disables dependency lifecycle scripts, pins direct versions on save and checks runtime engines. If a future dependency requires an install script, inspect and document it before changing that policy. The current Next native compiler works with its resolved platform package; no blanket script enabling is required.

Lint uses maintained ESLint 10, TypeScript ESLint and React Hooks rules. The optional Next plugin and incompatible legacy JSX plugins were excluded; see [dependency notices](THIRD-PARTY-NOTICES.md) for the admission rationale and coverage limits. TypeScript 5.9.3 is pinned within the selected parser's supported range; compiler upgrades require compatibility checks as well as an advisory review.

## Checks and production preview

```powershell
npm run lint
npm run format:check
npm run typecheck
npm run build
npm run start
```

`typecheck` generates Next route types before strict TypeScript checking, including from a clean checkout. Run type generation/build sequentially, not concurrently with a dev server writing the same `.next` directory. Stop the dev server before building/starting the production preview. Build does not replace linting. Run `npm run format` to format this app only.

The preview intentionally emits `noindex, nofollow` until public content/SEO is implemented. Revisit this in 4.7/11.5 before launch. It has no remote font/image/script requests, API rewrite, login, persistence, course data or payment behavior. Production hosting/listening/secure headers/cache rules remain reviewed deployment work; local `start` is a preview command, not a production deployment configuration.

## Structure and import rules

```text
src/app/                   Routes and root composition only
  (public)/page.tsx        Initial foundation page at /
  (auth)/                 Reserved account route group
  (student)/              Reserved student route group
  (staff)/                Reserved staff route group
src/features/              Feature-owned code as each feature starts
src/components/ui/         Shared primitives, beginning in 2.1.3
src/components/layout/     Shared responsive shells, beginning in 2.1.4
src/lib/                   Shared utilities and future API client
src/hooks/                 Genuinely shared hooks only
src/styles/                Shared styling begins in 2.1.2
src/types/                 Shared/generated contracts when real APIs exist
```

`@/*` maps to `src/*`. Routes compose features; features may use shared code and explicit public exports. ESLint rejects route imports from features and route/feature imports from shared components/utilities/hooks/types, including the documented alias and relative paths. This is an initial import guard, not a complete graph/isolation security system; cross-feature public interfaces are reviewed as modules are added.

Readme-only reserved folders expose no routes and do not provide authorization. Do not add empty business classes or sample student/order entities to fill the structure. `.NET` owns business rules and authorization; the PostgreSQL/table checkpoint remains 2.4.1.

The preview CSS module is deliberately local. Approved common CSS, theme initialization and Light/Dark/System are **2.1.2**; components, navigation/layouts and API-client behavior follow in separate leaves. Editor libraries are not installed or imported into this app yet.

See the [architecture](../../docs/architecture/APPLICATION-ARCHITECTURE.md), [API conventions](../../docs/architecture/API-CONVENTIONS.md), [package admission](../../docs/reference/FRONTEND-PACKAGES.json) and [2.1.1 review](../../docs/delivery/reviews/2.1.1-frontend-scaffold.md).
