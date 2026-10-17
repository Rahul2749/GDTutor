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
src/components/ui/         Shared primitives implemented in 2.1.3
src/components/layout/     Shared responsive shells, beginning in 2.1.4
src/lib/                   Shared utilities and future API client
src/hooks/                 Genuinely shared hooks only
src/styles/                Shared styling begins in 2.1.2
src/types/                 Shared/generated contracts when real APIs exist
```

`@/*` maps to `src/*`. Routes compose features; features may use shared code and explicit public exports. ESLint rejects route imports from features and route/feature imports from shared components/utilities/hooks/types, including the documented alias and relative paths. This is an initial import guard, not a complete graph/isolation security system; cross-feature public interfaces are reviewed as modules are added.

Readme-only reserved folders expose no routes and do not provide authorization. Do not add empty business classes or sample student/order entities to fill the structure. `.NET` owns business rules and authorization; the PostgreSQL/table checkpoint remains 2.4.1.

The shared CSS/theme foundation is implemented for accepted **2.1.2**. Use Appearance to choose Light/Dark/System; choices persist locally where browser storage is available, and System follows device changes. A fixed early script and CSS fallback handle initial/no-script rendering. Shared component states are implemented in 2.1.3. Responsive shells are implemented for review in 2.1.4; API-client behavior and account preference synchronization follow separately. Editor libraries are not installed/imported here.

See the [theme guide](../../docs/design/THEME-FOUNDATION.md) for token ownership, storage/initial-render behavior, verification and CSP integration limits. Do not add hard-coded light/dark colors to page modules or store authentication data in the appearance preference.

Review the [shared UI preview](http://127.0.0.1:3000/ui-preview?phase=2.1.3), [component API](src/components/ui/README.md) and [implementation guide](../../docs/design/SHARED-UI-FOUNDATION.md). All preview form/action state is local; it issues no writes. Native controls, keyboard tabs and controlled dialog/drawer interactions share the light/dark tokens.

See the [architecture](../../docs/architecture/APPLICATION-ARCHITECTURE.md), [API conventions](../../docs/architecture/API-CONVENTIONS.md), [package admission](../../docs/reference/FRONTEND-PACKAGES.json) and [2.1.1 review](../../docs/delivery/reviews/2.1.1-frontend-scaffold.md).

The owner requested an overall visual revision during 2.1.3. The running frontend uses the accepted [Compact Blue](../../docs/design/OVERALL-DESIGN-REVISION.md), including global colors/typography and the component preview composition. The earlier Focus Workspace palette remains historical; the owner accepted the refined component revision on 16 October 2026.

Review the [responsive layout hub](http://127.0.0.1:3000/layout-preview) and [shell guide](../../docs/design/RESPONSIVE-LAYOUT-SHELLS.md). Public/student/instructor/administrator destinations are labelled sample routes under `/layout-preview`; production account/feature routes are still separate implementation.

Review the [2.1.5 mock request/form preview](http://127.0.0.1:3000/api-preview) and [API foundation guide](../../docs/architecture/FRONTEND-API-FOUNDATION.md). Shared transport is under src/lib/api, request state under src/hooks, and form/display helpers under src/lib. There is no backend integration yet. Application and preview copy are English-only.

## Live API review — 2.3.1

[Connection preview](http://127.0.0.1:3000/connection-preview?phase=2.3.1) now uses actual same-origin status/health requests. Set GDTUTOR_LOCAL_API_ORIGIN=http://127.0.0.1:5080 before build/dev and start the .NET Development API separately. Rebuild when changing this local setting. Leave it unset for deployed builds; production routing belongs to reviewed ingress. It is server configuration, never NEXT_PUBLIC. The older /api-preview remains mocked.

See the [integration guide](../../docs/architecture/LIVE-API-INTEGRATION.md) for two-terminal commands, contract generation, failure/cancellation review and evidence. No additional package or paid service was added.
