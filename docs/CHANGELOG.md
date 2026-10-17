# Documentation changelog

- 17 October 2026: Owner accepted 2.3.1 and requested a GitHub commit/push of completed work. Recorded acceptance and checkpoint intent; 2.3.2 remains not started. Sensitive exports, credentials, local SDK/caches and build outputs remain excluded.

- 17 October 2026: Owner accepted 2.2.3 and authorized 2.3.1. Connected a new compact responsive preview to the actual API through validated local Next rewrites, added two contract-derived DTO types/runtime decoders and a bounded Development-only delayed read. All 35 live browser checks, 9 contract checks, 21 client regressions, 19 backend HTTP checks and 21 service regressions pass; six captures visually reviewed. Awaiting review. No new dependency, database, provider, authentication or staging/CI setup.

- 17 October 2026: Owner accepted 2.2.2 and authorized 2.2.3. Added controller-based status/health contracts, safe ProblemDetails and JSON request logs, Development-only validation/failure demos and generated OpenAPI. Admitted two signed MIT Microsoft OpenAPI packages with locked graph and advisory evidence. All 19 HTTP checks, 21 service regressions and three published startup cases pass; awaiting review. No frontend/API integration, database or provider work started.

- 16 October 2026: Owner accepted 2.2.1 and authorized 2.2.2. Added an Application sample port/service, immutable in-memory adapter, API composition, validated startup options, explicit lifetime checks and a dependency-free verification harness. All 21 service checks and three published configuration cases pass; awaiting review. No persistent model, provider integration or endpoint added.

- 16 October 2026: Owner accepted 2.1.5 and authorized 2.2.1. Added pinned/verified local .NET 10 SDK admission, four Clean Architecture projects, inward references, common compiler/restore policies, lockfiles and minimal empty host. Build, format, package graph and published startup checks pass; awaiting review. No persistent entity/schema or service/endpoint work started.

- 16 October 2026: Owner accepted 2.1.4 and required English-only copy; replaced the Hindi fixture and recorded the language requirement. Added 2.1.5 same-origin API-client/result/error handling, cancellation/state hook, form mapping/focus and English display utilities, with labelled mock preview and contract/browser evidence. Awaiting review.

- 16 October 2026: Owner accepted refined shared UI 2.1.3 and authorized 2.1.4. Added configurable public/student/staff shells, labelled instructor/admin fixtures, responsive navigation and linked placeholder routes. Browser/static evidence and guide added; awaiting shell review.

- 16 October 2026: Refined 2.1.3 after owner clarified compactness: restored fluid page width, reduced component typography/controls/modal size, aligned text and fields, simplified tabs, and extended light/dark mobile/tablet checks. Awaiting review; no phase progression.

## 16 October 2026 — Compactness and blue/charcoal reference feedback

- Owner supplied seven reference images and requested smaller overall UI and changed accents. Proposed Compact Blue with neutral charcoal dark surfaces and blue/slate emphasis, replacing the large illustrative hero with a concise workspace intro.
- Reduced shared typography, card/control radii, padding/gaps and desktop controls; retained 44px narrow/coarse-pointer controls and 16px mobile field text. Paired related fields with aligned labels.
- 35 shared UI checks/28 button contrast-state pairs and 29 theme checks/34 token pairs pass. Preserved four prior captures: preview height reduced 40.3% at 1440px and 37.3% at 390px. No new dependency or progression to the next leaf.


## 16 October 2026 — Overall design revision in 2.1.3

- Owner clarified that overall design needs improvement. Proposed Student Studio across global colors/typography, masthead/hero with original code-native lesson illustration, cards, forms, tabs and feedback; original Focus Workspace evidence remains historical.
- Added a separate current palette register and design guide; new appearance checks compare that proposal and derive fallback colors from it. Fixed actual compact-control overflow at 200% text zoom.
- Production build and both browser suites pass. No new dependency, paid asset/service, backend/schema or progression to layout-shell leaf 2.1.4. Awaiting design review.


## 16 October 2026 — Button appearance feedback in 2.1.3

- Refined the shared buttons after the owner found the initial colors/appearance ordinary: violet/lilac main actions, lavender alternatives, icon slots, improved dimensions and spacing, subtle depth and motion-aware interaction states.
- Rebuilt the local preview and reran 34 shared UI checks, expanded to 28 button contrast/state pairs, plus the 29-check/34-pair theme regression. Current evidence and captures replace the previous 2.1.3 iteration; historical 2.1.2 evidence remains intact. No package change or progression to 2.1.4.


## 16 October 2026 — Subphase 2.1.3 shared UI foundation

- Owner accepted 2.1.2 and authorized 2.1.3 through “go for next phase.” Implemented typed buttons, native fields, cards, tabs, notices/badges, loading/empty states and dialog/drawer layers with no new package.
- Added local component review route, responsive light/dark styles and documented component contracts. Fixed observed modal Tab boundary behavior; verification awaits rendered validation and settled style transitions.
- Recorded 34 shared UI checks/10 button contrast pairs, 29 theme regression checks/34 token contrast pairs, build/type/lint/format passes and 12 inspected captures. Historical theme evidence preserved.
- Shared UI is ready for review; layout shells 2.1.4 remain not started. Work stays local; backend/schema input gate 2.4.1 remains.


## 16 October 2026 — Git checkpoint and subphase 2.1.2 theme foundation

- Owner accepted 2.1.1 and requested pushing before progression. Committed/pushed reviewed work as `4d064ee` to `origin/main`, verifying matching heads; private exports/captures, dependencies and build output excluded.
- Then implemented only 2.1.2: shared reset/semantic tokens, Focus Workspace Light/Dark/System, early head initialization, persisted browser choices, cross-tab/device updates and safe storage/no-script fallbacks. New theme work remains local for review.
- Added a labelled native appearance selector, focus/touch/reduced-motion behavior and tokenized responsive demo. Corrected detected narrow-grid overflow.
- Recorded passing production build/type/lint/format, 29 browser checks, 34 contrast pairs and four inspected captures; no new package, provider, backend/schema or production deployment. Next proposed leaf is 2.1.3.

## 16 October 2026 — Subphase 2.1.1 initial frontend scaffold

- Recorded acceptance of 1.6 and authorization of 2.1.1 through “go ahead.” Created `apps/web` Next.js/React/TypeScript structure with route groups, shared/feature ownership notes, strict types, aliases, import guards and explicit local check/build/run scripts.
- Pinned reviewed dependencies, disabled install scripts and retained strict peers. Rejected unsupported ESLint 9, incompatible legacy JSX plugin peers and an optional Next lint plugin with an unpatched dependency; final audit has zero known npm advisories.
- Recorded package provenance, license/notice inventory, five passing import-boundary probes, successful lint/format/type/build checks and actual production HTTP checks at four widths. Two review captures visually inspected.
- Production preview runs locally on port 3000. Shared tokens/themes, components, shells, API client, backend and schema remain separate leaves; no deployment or commit/push.

## 16 October 2026 — Subphase 1.6 architecture and API conventions

- Recorded acceptance of 1.5.4 and authorization of 1.6 through the owner's subsequent “ok go ahead.” Authoring compatibility/converter admission and reforecast gates remain.
- Selected Next.js App Router and .NET 10 Clean Architecture modular monolith for review, with same-origin routing, API-owned cookies/antiforgery, public/private rendering boundaries and documented folder/reference rules.
- Defined conceptual versioned HTTP contracts, ProblemDetails, strong ETags, durable idempotency and student-safe attempt responses. No persistence structures or endpoints implemented.
- Defined a durable .NET Worker and isolated Node content tool/converter boundary. Inspected installed SDK/runtime readiness; patch admission remains backend setup work.
- No packages installed, app scaffold created, infrastructure purchased, schema inferred or deployment performed. Next proposed leaf is 2.1.1 after review.

## 16 October 2026 — Subphase 1.5.4 authoring selection

- Recorded owner acceptance of 1.5.3 and authorization of 1.5.4 through “ok go ahead.” Submitted Tiptap OSS + MathLive + custom equation nodes + KaTeX as the researched baseline for review; planned bundled mhchem retains MIT/Apache notices.
- Selected reviewed paste plus required DOCX import/repair under 6.1.3. Pandoc is the preferred engine to prove, with exact-release/security/GPL admission pending; no converter installed or production compatibility claimed.
- Re-audited the unchanged lockfile: zero known npm advisories. Six Node render feasibility fixtures pass with bundled chemistry support; no preview/UI changes or broad interoperability certification.
- Added supported-workflow matrix, source reconciliation, release gates and provisional 7–12 authoring/conversion workday impact, excluding remaining assessments. The six-week target remains a stretch baseline, not a promise.
- Architecture 1.6 and production foundations remain unstarted; database input gate remains 2.4.1.

## 16 October 2026 — Subphase 1.5.3 paste and round-trip investigation

- Recorded acceptance of 1.5.2 and authorization of 1.5.3 through “very nice go further.” Added reviewed paste into all regions, explicit LaTeX/basic MathML/HTML/text normalization, atomic repair feedback, equation copy controls and native editor copy serialization.
- Separated controlled browser round trips from native clipboard evidence. Word exposed native formats, while automated Chrome received an empty payload; direct native Word clipboard fidelity remains unverified.
- App-generated MathML replayed through a Windows broker created native fraction/root structure in two unsaved Word test documents. Nine native reference conversions produced one subset acceptance and eight repair outcomes; no full DOCX importer or visual-fidelity pass claimed.
- No new runtime packages, paid service, database or production foundations. Final package/renderer/conversion selection remains 1.5.4 after this review.


## 16 October 2026 — Public source substitution and subphase 1.5.2 prototype

- Owner authorized internet/platform sources instead of waiting for private originals and continuation to the next item. Registered three pinned MIT-licensed Microsoft Open XML SDK DOCX fixtures with checksums: nine native equations across two files, plus a legacy OLE-object fixture.
- Completed 1.5.1 with public substitutes and explicit actual-teacher/environment gaps. Built only the isolated 1.5.2 React/TypeScript rich-text/visual equation experiment with prompt, four options, explanation, local structured save/reopen, candidate preview and Light/Dark/System controls.
- Recorded pinned candidate package licenses, transitive build-tool MPL notice obligations, scripts-disabled install and zero known npm advisories at audit time. Documented authoring bundle size and production integration limits.
- Submitted 1.5.2 for review after build, model and browser checks. Native Word clipboard/conversion experiments (1.5.3), final selection, production foundations, backend, schema and deployment remain unstarted.


## 16 October 2026 — Subphase 1.5.1 question/source corpus intake

- Recorded owner acceptance of 1.4 and authorization of 1.5.1 only. Incorporated “consider all” for source families, subjects/languages and outbound Word reuse.
- Registered four real visual references, a read-only XML pattern audit, 40 synthetic proposed cases, 12 source families and seven unconfirmed destination environments. All compatibility results remain Not run.
- Prepared local ignored source intake and a documented verification/review procedure. Original editable files and actual environment details are still required; 1.5.1 remains In progress. No editor/package experiment, application implementation or database work started.


## 15 October 2026 — Subphase 1.4 staff workspace and authoring design

- Recorded owner acceptance of 1.3 through "go next" and limited execution to 1.4.
- Added staff role/navigation, course/lesson/curriculum/offer authoring, question/equation concept, unsupported-paste repair and review/publication/archive designs with explicit local-only limits.
- Recorded 929 passing layout observations, seven-width role/interaction flows, 32 passing observed text/background pairs, zero runtime errors, 20 review captures and tested-source checksum.
- Submitted 1.4 for review. Real Word/source samples and editor/package experiments remain separately gated at 1.5; no application scaffolding, schema, service operation, migration or commits/pushes performed.

## 15 October 2026 — Subphase 1.3 lesson player and quiz flow

- Recorded owner acceptance of 1.2 through "ok great, continue" and limited execution to 1.3.
- Added connected lesson, instructions, runner, submission and release/history designs with a 250-item navigation fixture, pending/conflict/deadline/access states and five-question scoring example.
- Recorded 364 passing layout observations, seven-width interaction checks, 32 passing observed text/background pairs, zero runtime errors, 17 captures and tested-source checksum. Documented fixed-clock/local-save limits and future backend/video/math/editor work.
- Submitted 1.3 for review. No staff-design execution, application foundation, package adoption, persistent schema, external services, migrations, capacity test or commits/pushes performed.

## 15 October 2026 — Subphase 1.2 navigation and wireframes

- Recorded 1.1 progression acceptance; carried forward the Focus Workspace variant selected in the preview before the owner's "go next".
- Added four connected wireframes, public/student mobile navigation, proposed route/access contracts, search/filter and empty/loading/error examples, and six course-access states.
- Recorded 259 passing layout observations, seven-width interaction checks, 26 observed passing text contrast pairs, zero runtime errors, source checksum and 16 captures. Kept verification limits explicit.
- Submitted 1.2 for review. No 1.3 work, application scaffolding, dependencies, payments, database/schema work, external requests or commits/pushes performed.

## 15 October 2026 — Subphase 1.1 visual direction

- Recorded 0.5 acceptance and resumed 1.1 after the owner's export-guidance detour.
- Prepared two concrete responsive directions: Learning Studio (recommended) and Focus Workspace, with Light/Dark/System controls and local sample interactions.
- Added proposed semantic tokens, eight review captures, browser results for 28 width/theme/direction combinations and 40 passing default contrast checks; documented offline icon and broader accessibility limits.
- Submitted 1.1 for owner selection. No 1.2 execution, application scaffolding, packages, database work, service configuration or commits/pushes performed.

## 15 October 2026 — Subphase 0.5 delivery baseline

- Recorded 0.4 acceptance; source gaps remain unresolved rather than being declared complete.
- Owner clarified the team is the owner with Codex, with no fixed launch date and approximately one-and-a-half months as the planning target.
- Added a six-week stretch sequence, scope coverage, ten milestones, twelve risks and explicit reforecast rules.
- Added a structured backlog for all 89 existing leaf IDs, preserving review order; all 52 feature IDs are covered and 78 design/build/validation items map to the six-week target window.
- Preserved conditional production cutover, separate post-launch reviews and the 2.4.1 schema-input gate. No parity feature was silently removed to meet the target.
- Submitted 0.5 for review; 1.1 visual direction has not started. No application code, packages, database or service changes performed.

## 15 October 2026 — Subphase 0.4 export audit and capacity definition

- Recorded acceptance of the 0.3 working baseline; explicitly unspecified commercial/settings/provider choices remain open.
- Owner supplied a 43,302,495-byte WXR export and confirmed YouTube videos plus three-hour exams with 200+ questions.
- Audited 16,039 items, visibility states, enrollment references, video/asset references and quiz-course relationship paths; recorded source gaps instead of inventing missing question/history/payment counts.
- Added aggregate export JSON and a 65-screenshot checksum/size manifest. Excluded the raw production XML from Git.
- Defined eight workload scenarios for 500 active students, including long exams, save/start/submit bursts and recovery; proposed synthetic seed assumptions remain distinct from measured source data.
- Submitted 0.4 for review. No import, data/entity setup, production media download, runtime load test or 0.5 execution performed.

## 15 October 2026 — Subphase 0.3 business-rule review

- Recorded owner-authorized progression from 0.2 and prepared business rules with worked acceptance examples.
- Owner confirmed configurable lifetime/time-limited course access, configurable per-quiz scoring/retakes/release and both online classes and offline coaching batches.
- Kept detailed expiry/refund/permission/assessment/completion/attendance proposals visibly separate from those confirmed choices.
- Added the policy document/review record, updated decisions and navigation, and submitted 0.3 for review. No later item, application code, database work, package installation or service configuration started.

## 15 October 2026 — Independent replacement and subphase 0.2

- Recorded the owner's no-WordPress requirement: no plugins, themes, PHP runtime, headless CMS, live old-database connection or WordPress API dependency in the replacement.
- Renamed/refined 0.2 to capability replacement and direct integration mapping, retaining its existing ID and review boundary.
- Added 18 replacement mappings, 8 integration decisions and 6 assigned source unknowns. Local source configuration/exports were unavailable; no installed-plugin audit is claimed.
- Recorded owner-authorized progression from 0.1; 0.2 is Ready for review and 0.3 remains Not started.
- Updated project instructions, plans, requirements and navigation. No application code, package installation, database work or service changes performed.

## 15 October 2026 — Subphase 0.1 prepared for review

- Owner authorized the feature inventory and user-journey discovery item.
- Added a traceable feature inventory with evidence groups, proposed launch priorities, actor responsibilities, eleven journeys and open questions assigned to later subphases.
- Reused the existing 65-screenshot audit; distinguished owner-confirmed requirements, observed/empty interfaces and proposed behavior.
- Added the 0.1 review record and linked the deliverable from the documentation index.
- Submitted 0.1 as Ready for review; acceptance remains pending. Every other item remains Not started.
- No application code, database entities, packages or external service configuration added.

## 15 October 2026 — Documentation organization

- Added project/documentation entry points and a reading order.
- Moved the master plan and subphase roadmap into `planning/`.
- Moved detailed design/technical requirements into `requirements/`.
- Moved the screenshot index into `reference/`; preserved all 65 original screenshots.
- Added a decision register separating confirmed choices from proposals/open questions.
- Added one execution-status tracker covering all existing leaf subphases, with no item marked started or accepted.
- Added a review-record template and a location for future per-item evidence.
- Updated repository instructions and local links to use the new structure.
- Preserved scope, review gates and original planning dates. No application implementation, package installation or database work performed.

## 14 October 2026 — Initial planning and owner revisions

- Reviewed the screenshot collection and produced the migration plan and evidence index.
- Added sequential subphase reviews, modern responsive design and theme requirements.
- Recorded PostgreSQL, Razorpay, R2 images, 500 concurrent students and visual formula authoring requirements.
- Added the explicit legacy-schema review gate before persistent entities or database migrations.
