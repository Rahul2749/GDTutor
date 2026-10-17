# GD Tutor: design and technical requirements

[Documentation index](../README.md) · [Progress tracker](../delivery/PROGRESS.md)

**Version:** 1.0, 14 October 2026  
**Status:** Requirements baseline; accepted design/editor investigations exist. Frontend foundation through 2.1.5 is accepted; backend foundation 2.2.1–2.2.3 is accepted and frontend/API integration 2.3.1 is accepted; execution/review state is in the progress tracker.  
**Related:** [Master plan](../planning/MIGRATION-PLAN.md) · [Subphase roadmap](../planning/SUBPHASE-ROADMAP.md)

## 1. Confirmed choices and proposed choices

Confirmed by the owner: a modern redesign, mobile-first responsiveness, switchable light/dark appearance, React, .NET, PostgreSQL, Razorpay, Cloudflare R2 for images, approximately 500 simultaneous students, open-source-first packages, dynamic equation authoring, and one reviewed subphase at a time.

**Owner clarification, 15 October 2026:** The replacement has no WordPress plugins, themes, PHP runtime, headless CMS, live WordPress database or API dependency. Public content editing, courses, questions, accounts and commerce are implemented within the new stack. Legacy exports are inputs to a one-time migration; they are not a production service. This constraint does not prohibit ordinary reviewed React/.NET libraries or the selected direct Razorpay/R2 services. See the [standalone replacement map](STANDALONE-REPLACEMENT-MAP.md).

The authoring approach in 1.5.4 is accepted with production compatibility/admission gates. The [1.6 architecture](../architecture/APPLICATION-ARCHITECTURE.md) records the accepted Next.js App Router, .NET 10 Clean Architecture and same-origin API/worker boundaries. Exact production package patches, hosting/provider specifications, video access integration and the converter binary remain separately gated. Compact Blue with refined component density and fluid width is the accepted current visual foundation; earlier Focus Workspace values are historical. No paid tool is required by this software baseline.

**Language clarification, 16 October 2026:** Application interface and preview copy must be English-only. Do not use Hindi or Marathi sample text. Preserve original migration/source evidence; do not rewrite historical documents or silently alter imported source material.

## 2. Visual direction and theme system

**Current foundation:** Owner accepted the refined component preview through “great go ahead” on 16 October after requesting overall design improvements during 2.1.3. The [Compact Blue revision](../design/OVERALL-DESIGN-REVISION.md) and [current palette](../design/UI-DESIGN-TOKENS.json) are accepted in the running frontend; the Focus Workspace details below preserve the earlier accepted baseline.

### Visual direction

Create a polished learning product that feels approachable to school and entrance-exam students. Use clear typography, generous spacing, rounded cards, restrained shadows, strong course imagery, and prominent learning actions. Use color and progress to help students understand what to do next; keep the examination screen calm and distraction-free.

Earlier working direction (superseded by the accepted Compact Blue revision): **Focus Workspace — teal primary, violet secondary, warm neutral surfaces and editorial headings**. It follows the selected 1.1 preview and the owner's progression instruction. The provisional wordmark remains subject to branding refinement.

**1.1 result, 15 October 2026:** [Visual direction](../design/VISUAL-DIRECTION.md) preserves both alternatives. The [theme tokens](../design/THEME-TOKENS.json) record Focus Workspace as selected and contain the complete semantic pairs. [1.2 wireframes](../design/NAVIGATION-AND-WIREFRAMES.md) apply that baseline; their page/navigation structure is separately reviewed.

| Semantic token | Light proposal | Dark proposal | Intended use |
|---|---|---|---|
| Page background | `#F8F7F3` | `#0D1918` | Main canvas |
| Surface | `#FFFFFF` | `#152624` | Cards, menus, panels |
| Raised/muted surface | `#EFEEE8` | `#21332F` | Secondary areas and active containers |
| Primary text | `#172C27` | `#EBF3EE` | Headings and body |
| Secondary text | `#4F625B` | `#A9BDB5` | Supporting labels |
| Primary action/accent | `#0F766E` | `#5EEAD4` | Main actions, selected state |
| Text on primary | `#FFFFFF` | `#0D2420` | Primary button label |
| Secondary accent | `#5B4AB4` | `#C4B5FD` | Secondary learning highlights |
| Highlight | `#92400E` | `#FBBF24` | Small highlights and achievements |
| Decorative border | `#D9E1DB` | `#3C5149` | Card separation; essential control boundaries use separate tokens |

These are starting tokens, not permission to use every combination. Define separate success, error, warning, focus, disabled and hover tokens. Test text and control contrast in context; never communicate correct/incorrect, save status or progress by color alone. The minimum design targets are 4.5:1 for normal text and 3:1 for large text and essential UI indicators.

Use a system font stack initially to avoid external font requests and paid font dependencies. If a custom font improves the approved direction, select a freely licensed font, record its license, self-host it, and keep loading/weight count small.

### Theme behavior

The [2.1.2 foundation](../design/THEME-FOUNDATION.md) implements the accepted browser-local preference and common CSS/tokens. Account synchronization remains Phase 3, and theme behavior in future components/features must be verified when those are built. The original design-token JSON remains the baseline snapshot.

- Provide Light, Dark and System choices in a convenient appearance control and account preferences.
- Respect system preference on first visit; remember an explicit choice across reloads and navigation.
- Resolve initial appearance before the first visible render where possible; verify no hydration mismatch or noticeable theme flash.
- Use CSS custom properties for semantic tokens. Shared components use tokens rather than hard-coded light/dark colors.
- Apply themes to public pages, authentication, learning, quizzes, staff screens, charts, tooltips, dialogs, editor toolbars, math and loading/error states.
- Preserve readable images/diagrams; do not invert every image to create dark mode.
- Test both themes, keyboard focus, high contrast and reduced motion. Preferences must not make quiz feedback ambiguous.

### Mobile-first behavior

- Review at 320, 360, 390, 768, 1024 and 1440 CSS-pixel widths, with portrait/landscape and text zoom checks.
- Avoid whole-page horizontal scrolling. Wide formulas or tables may use a clearly bounded scroll region with a suitable accessible alternative.
- Target touch controls around 44 by 44 CSS pixels, with separation for quiz answers and navigation. Owner requested more compact UI on 16 October: accepted component foundation permits 32px desktop controls while preserving 44px on narrow/coarse-pointer devices and 16px mobile field text. Keep page width fluid; compactness is a component/type/alignment requirement, not increased outer margins. See the current design revision.
- Use adaptive public navigation and compact student navigation; select bottom navigation or a drawer during screen review rather than adding both everywhere.
- Collapse curriculum into a drawer on small screens. Keep player, lesson title and next action easy to reach.
- Keep quiz timer, saved state and submit action visible without covering questions or the device keyboard; respect safe areas.
- Make tables adapt through cards, column prioritization or local scrolling. Preserve staff actions on small screens.
- Make the equation keyboard/editor usable with touch, device keyboard, screen zoom and small viewports.
- Use responsive image variants, lazy loading below the fold and deferred editor bundles; do not download authoring tools on student-only routes.
- Favor short purposeful motion and honor reduced-motion settings. Avoid animation during timed questions.

### Design review samples

The accepted [1.3 learning/assessment sample](../design/LEARNING-AND-ASSESSMENT-FLOWS.md) covers lesson, instructions, runner and result states with a fixed sample clock/local save model. It does not establish backend timing, durability, answer-key protection, YouTube delivery or production math/editor compatibility. The separately reviewed [1.4 staff/authoring sample](../design/STAFF-AND-AUTHORING-FLOWS.md) covers roles, drafts/curriculum, approvals and a limited equation/paste-repair interaction; production editor/Word compatibility remains 1.5. The accepted public/student navigation remains in 1.2.

Review the same six representative screens in both themes: public home, catalog/course detail, student dashboard, lesson player, quiz runner/result, and staff question editor. Include mobile views, empty/loading/error states, long titles and long formulas. Accept the design system before scaling it to the remaining screens.

## 3. Frontend and backend foundation

### Frontend

The detailed directory proposal is in the master plan. Keep route composition separate from feature logic; colocate feature-specific components, hooks and types. Promote code to shared folders only after a clear reusable need appears.

The [1.6 architecture](../architecture/APPLICATION-ARCHITECTURE.md) and [API conventions](../architecture/API-CONVENTIONS.md) specify framework/project boundaries, rendering, API-owned cookies/antiforgery, concurrency/retry and isolated content-worker contracts. These are not implemented endpoints or database schemas.

Foundation subphases deliver:

1. React/TypeScript scaffolding, route groups, path aliases, strict typing, lint/format/build scripts and local environment documentation.
2. Global reset/base styles, semantic design tokens, theme switching, typography and responsive spacing/layout primitives.
3. Reusable buttons, inputs, selects, cards, dialogs, drawers, tabs, status messages, skeletons and empty states, with accessible interaction.
4. Public/student/staff layout shells with placeholder content and mobile navigation.
5. API client, request cancellation, consistent errors, date/currency formatting, notifications and form conventions.

Use built-in fetch and CSS capabilities where adequate. Evaluate a UI primitive library or utility-CSS framework only if it reduces effort without creating duplicate styling systems. Do not install a package for every small helper. Generated API contracts follow backend agreements; mock contracts must be labeled as provisional.

### Backend

The [2.2.1 foundation](../architecture/BACKEND-FOUNDATION.md) establishes the pinned SDK, solution/project references, common compiler policies and empty host only. [Services/DI/configuration 2.2.2](../architecture/BACKEND-SERVICES-CONFIGURATION.md) now demonstrate validated startup settings and replaceable sample adapters; [HTTP/errors/logging/health/OpenAPI 2.2.3](../architecture/BACKEND-HTTP-FOUNDATION.md) are accepted. [Live frontend/API integration 2.3.1](../architecture/LIVE-API-INTEGRATION.md) is accepted; deployment and persistence remain separate leaves.

Use ASP.NET Core on the .NET 10 baseline accepted in 1.6, with Clean Architecture boundaries:

- **Domain:** business rules and eventual entities; no web, EF or vendor dependencies.
- **Application:** use cases, validation, DTOs and interfaces for persistence, payments, storage and time.
- **Infrastructure:** EF Core/Npgsql, Razorpay and R2 adapters, email and durable job implementations.
- **API:** endpoints, authentication/authorization wiring, middleware and dependency injection.

Start with project references, service interfaces, configuration validation, structured logs, health endpoints, centralized error responses and OpenAPI conventions. Do not create speculative business entities just to populate folders. Use manual mappings and straightforward service calls unless added tooling has a demonstrated benefit and approved license.

**Database checkpoint 2.4.1:** Ask for the existing table definitions, keys, relationships, relevant plugin tables/metadata and anonymized representative records, plus available PostgreSQL environment/version details. Receive sensitive connection values through the agreed local secret configuration, not committed files. Review old-to-new mappings and schema decisions before entities, mappings or migrations are implemented. No migration command is run against a production database during scaffolding.

## 4. Dynamic question and formula authoring

### Required staff workflow

A teacher creates a question, writes or pastes mixed text and formulas, adds answer options and an explanation, previews the student view, and saves an editable draft. The same formula tooling must work in the question, each option and the explanation.

Provide:

- A rich-text question editor with paragraphs, lists, emphasis, tables where needed, images and inline/display equations.
- An Insert/Edit Equation action opening a visual math field and symbol/template palette.
- Templates for fractions, powers, roots, subscripts, integrals, sums, limits, vectors, matrices, brackets and Greek symbols.
- Chemistry notation/templates for charge, reaction arrows and common equations, subject to the legacy-content compatibility test.
- LaTeX source mode synchronized with the visual field, live preview, undo/redo and actionable syntax feedback.
- Saved reusable formula templates if the early authoring review shows a practical need.
- Touch-friendly equation input and accessible keyboard navigation.
- Save/reopen without losing mathematical structure or silently changing the expression.

### Accepted open-source authoring approach

The accepted [1.5.4 selection](../design/QUESTION-AUTHORING-DECISION.md) chooses **Tiptap OSS**, **MathLive** and custom equation nodes with **KaTeX** as the standard renderer. Bundled `mhchem` is planned for chemistry/units, with visual editing and interoperability still gated. Exact versions, notice obligations, alternatives, supported workflows and remaining tests are in that decision. MathLive and Tiptap core are MIT; commercial Tiptap features are separate. See [MathLive source/license](https://github.com/arnog/mathlive), [MathLive field interaction](https://mathlive.io/mathfield/guides/interacting/), and [Tiptap overview](https://tiptap.dev/docs/editor/getting-started/overview).

Tiptap's mathematics extension uses KaTeX. If testing selects MathJax for broader legacy compatibility, implement a compatible custom editor node/preview instead of assuming that extension automatically switches renderer. See [the mathematics extension](https://tiptap.dev/docs/editor/extensions/nodes/mathematics), [KaTeX supported functions](https://katex.org/docs/support_table), and [MathJax](https://github.com/MathJax/MathJax).

KaTeX is the accepted implementation baseline on the tested subset; complete the actual math/chemistry corpus and accessibility gates before production acceptance, reopening the renderer choice if required notation fails. Do not ship multiple large renderers on every student route without evidence that both are needed. Visual editing is not a general algebra-grading engine; symbolic answer grading, if required, needs its own explicit scope and correctness tests.

### Word and other-source copy/paste

**Owner clarification, 16 October 2026:** “Consider all” source-app/platform families and subjects/languages, including outbound Word reuse. The [1.5.1 corpus](QUESTION-AUTHORING-CORPUS.md) records broad proposed coverage and missing environments. Validate concrete configurations; this scope is not a universal compatibility guarantee. Owner subsequently authorized public internet/platform originals and continuation, so private-file availability no longer blocks progression. The [1.5.4 decision](../design/QUESTION-AUTHORING-DECISION.md) records the accepted editor stack and conversion workflow; no production converter binary is admitted yet.

Clipboard content varies by source application, document version and browser. The goal is a reliable supported workflow, not an unsupported claim that every platform's clipboard is identical.

| Source | Planned behavior | Acceptance evidence |
|---|---|---|
| Existing WordPress LaTeX | Import supported delimiters/macros, preserve original source and preview | Existing real questions retain notation after import and edit |
| Plain LaTeX | Paste into equation input or detect agreed delimiters in rich text | Editable formula renders correctly and survives save/reopen |
| Word text/lists/tables | Normalize supported HTML structure, remove Word-specific styling/scripts | Representative questions keep text, numbering and intended structure |
| Word native equations | Inspect clipboard payload; convert supported structured math if present | Tested equations remain mathematically equivalent and editable in the new editor |
| Word linear LaTeX | Offer a documented path using Word's linear LaTeX representation | Teachers can paste the supplied representative expressions successfully |
| Supported MathML/web content | Parse an explicitly supported subset and normalize math nodes | Compatibility fixtures pass; unsupported elements are reported |
| Image-only equation or screenshot | Preserve the image with a clear non-editable indicator and allow manual recreation | No claim of editable math or successful semantic conversion |
| Source with missing clipboard structure | Show a preview and a visible repair path; evaluate DOCX import if needed | Staff can identify and correct the unresolved formula before publishing |

Word supports linear equation formats including UnicodeMath and LaTeX, but support must be checked against the versions staff use: [Microsoft documentation](https://support.microsoft.com/en-us/word/linear-format-equations-using-unicodemath-and-latex-in-word).

During subphase 1.5, request real Word samples and the other source platforms staff use. Establish a browser/platform compatibility matrix. Native Word equations use document structures that ordinary browser paste may not preserve. If direct paste cannot satisfy required cases, plan a **reviewable DOCX import fallback** with conversion diagnostics and question mapping. Inspect parser/converter licenses before choosing an implementation. Do not quietly buy a commercial conversion service or claim a generic document parser preserves equations.

For outbound reuse, include Copy LaTeX and, where verified, compatible MathML. Validate the agreed Word re-entry workflow; full-fidelity Word document export is a separate decision. Images/OCR and proprietary equation formats must never silently become incorrect math. Automated OCR is not a default dependency.

The accepted [1.5.3 investigation](../delivery/reviews/1.5.3-paste-roundtrip.md) has controlled browser transfer/save/reopen evidence, a limited MathML/HTML normalizer and explicit repair states. Native Word capture and brokered Word-native structure tests are separate from direct clipboard fidelity, which remains unverified. The [1.5.4 selection](../design/QUESTION-AUTHORING-DECISION.md) therefore requires DOCX import/repair in 6.1.3, with source reconciliation and an exact-converter admission gate. A tiny subset is not a complete DOCX converter.

### Content model and safety

- Store versioned structured rich content with explicit inline/block math nodes, LaTeX source and original-source metadata where useful. Generated HTML alone is not the editable source of truth.
- Preserve original imported material and a conversion report for troubleshooting. Do not silently remove unsupported commands or change numerical signs.
- Validate schema and sanitize pasted HTML/links on the server as well as the editor boundary. Disable unsafe renderer commands, external resource fetching and executable markup.
- Bound document, image and expression sizes and formula nesting to prevent pathological rendering or parsing workloads.
- Do not run arbitrary TeX compilation on the server for question rendering.
- Store approved image assets in R2 with metadata; do not retain untrusted temporary local-file links from pasted documents.
- Keep the preview and final student rendering consistent in both themes and at mobile widths.

### Formula-editor release gate

Before accepting this capability, a teacher must successfully create, paste, edit, save, reopen and preview an agreed sample set covering fractions, integrals, matrices, vectors, chemistry, mixed text/math, formulas in options and explanations, diagrams, and unsupported input. Capture original-versus-result comparisons. There must be no silent loss of formula content; unresolved conversion cases must be visibly flagged for repair before publication.

## 5. Capacity and service integration requirements

### Approximately 500 simultaneous students

Interpret the requirement as **500 active student sessions**, not merely open tabs or registered users. Record seeded data volume, infrastructure, browser/device profile, endpoint mix, pacing and results so the capacity claim can be reproduced.

Initial acceptance scenarios, finalized in 0.4:

Owner input during 0.4 confirms YouTube video sources and exams up to 180 minutes with 200+ questions. The [0.4 inventory/capacity contract](DATA-MEDIA-AND-CAPACITY.md) supplies measured export counts, source gaps and the proposed 250-question long-exam fixture. It is the detailed workload reference for the scenarios below; the 250-question fixture is not a product cap.

1. **Mixed learning:** ramp to 500 active users over five minutes, then sustain for 30 minutes. Proposed mix: 40% learning/progress, 40% quizzes, 15% navigation/dashboard and 5% enrollment/checkout test-mode interactions. Validate this mix with the owner.
2. **Exam:** 500 concurrent attempts with the owner-confirmed 180-minute exam duration and representative 200/250-question fixtures. At one save per 15 seconds per user in the busy-save profile, the steady baseline is about 33 writes/second; include realistic answer pacing and separate save bursts. Test pacing does not mandate a frontend autosave delay.
3. **Deadline burst:** 500 students submit within ten seconds, including collisions between user submission and server timeout. Expect one durable final result per attempt and no lost acknowledged answers.
4. **Headroom:** explore 750 active users separately to find saturation and validate graceful degradation; this is diagnostic headroom, not a promised 750-user launch SLA.
5. **Recovery:** test dependency timeouts, database connection pressure and worker restarts; measure backlog recovery and ensure accepted writes persist.

Initial pass targets at 500 users: common API p95 under 500 ms, quiz-save acknowledgment p95 under one second, submit acknowledgment p95 under two seconds, less than 1% unexpected server/transport failures, **zero lost acknowledged answers**, no duplicate finalization and no cross-student data leakage. Expected validation failures and deliberate fault-injection runs are reported separately. Provider latency must be separated from backend latency; use provider-approved test traffic or stubs for load tests, never uncontrolled real charges.

Design for stateless API instances, appropriately bounded PostgreSQL connection pools, indexed/paginated queries, short write transactions and durable background jobs. Coordinate distributed jobs and idempotency through shared durable state. Avoid counting 500 users as 500 dedicated database connections. Use caching only where correctness permits; private learning records and answer keys must not enter a public cache.

Keep media delivery off the API's streaming path. Measure client formula rendering and video delivery separately from API load; if 500 students watch video, the video provider/CDN must independently support that traffic. API load-test success alone does not establish playback capacity.

Begin with an affordable staging configuration, measure, then choose production CPU/RAM/database sizing and estimated operating cost. Do not promise capacity from an untested server specification.

### Razorpay

- Create and price orders in .NET; store provider references and internal order identity.
- Use Razorpay test mode until the reviewed production setup.
- Verify checkout signatures and webhook signatures against the correct data; grant access only on server-verified successful/captured state as appropriate to the configured flow.
- Persist and deduplicate events, tolerate late/out-of-order delivery, reconcile missing callbacks and handle refunds/access rules.
- Keep secrets server-side and out of source control; audit approved staff financial actions.
- Migrate historical transactions with their original provider references; switching to Razorpay does not rewrite the old gateway's records.

Use the provider's documented order/verification flow and validate compatibility with our ASP.NET Core architecture rather than copying framework-specific sample UI code: [Razorpay .NET integration](https://razorpay.com/docs/payments/server-integration/dot-net/integration-steps/).

### Cloudflare R2 for images

- Use separate environment scopes and object namespaces for public assets and private uploads where needed.
- Store object keys, media type, dimensions, size and ownership in PostgreSQL after the schema review.
- Authorize uploads, validate actual type/size/content, generate safe object keys and avoid exposing R2 credentials to browsers.
- Use controlled upload URLs or server-mediated uploads, with finalization checks before an object is published; configure CORS deliberately.
- Serve public course images through an appropriate public/custom domain and cache policy; use authorized short-lived access for private content.
- Generate responsive image sizes with a reviewed open-source image processor if required. R2 storage is not automatically Cloudflare Images transformation service.
- Define retention, replacement cleanup, failed-upload cleanup and migration manifests.
- The R2 decision does not choose a recorded-video transcoding/streaming provider. Evaluate video separately.

When using temporary upload/download authorization, follow [R2 presigned URL documentation](https://developers.cloudflare.com/r2/api/s3/presigned-urls/) and verify actual browser CORS and object-access behavior.

## 6. Package policy and cost register

### Package admission checklist

Before adding a direct dependency, record package name/version, official repository, publisher, purpose, license, cost, relevant advisories, maintenance status, transitive dependencies and replacement option. Pin resolved versions in lockfiles and retain license notices.

Prefer platform capabilities and established permissively licensed packages. Open-source does not automatically mean secure. Scan npm/NuGet dependency graphs in CI, review high/critical findings before release, and keep a documented update process. Use official distribution sources, verify package identity, and avoid unmaintained wrappers when direct integration is simpler. Review copyleft obligations and commercial add-ons explicitly rather than treating every library from one vendor as having the same license.

| Candidate | Purpose | License/cost direction | Selection checkpoint |
|---|---|---|---|
| React/TypeScript and optional Next.js | Frontend | Open-source baseline; exact version/license audit before installation | 2.1.1 |
| ASP.NET Core/EF Core | API and persistence | Open-source baseline; compatible supported versions | 2.2.1 / 2.4.3 |
| Npgsql EF Core provider | PostgreSQL integration | PostgreSQL License; no package license fee | 2.4.3 |
| Tiptap OSS | Rich-text question editing | MIT core; use only reviewed free extensions | 1.5.4 approach accepted / 6.1.1 integration |
| MathLive | Visual equation entry | MIT | 1.5.4 approach accepted / 6.1.1 integration |
| KaTeX with bundled mhchem planned | Formula rendering; MathJax remains a revision alternative | MIT core; mhchem also retains Apache-2.0 upstream notices | 1.5.4 approach accepted / 6.1.4 production acceptance |
| Pandoc, uninstalled candidate | Preferred DOCX/OMML engine to prove | GPL; exact-release license/security/fixture admission before adoption, no license fee | 6.1.3 |
| UI primitives, icons, forms, charts, image processor | Shared capabilities | Pick only when needed; verify exact package and asset licenses | Relevant foundation/feature item |
| Browser/load test tools | Verification | Prefer local open-source execution; hosted paid testing is not assumed | 2.3 / 11.3 |

Sources for math/editor licenses appear above; [Npgsql license](https://github.com/npgsql/efcore.pg/blob/main/LICENSE) and [KaTeX](https://katex.org/) provide primary package references. All candidates remain subject to version-specific checks at installation. A verified license today is not a security audit of a future release.

### External services and unavoidable costs

Prices checked against official pages on 14 October 2026; recheck before activation. Razorpay and R2 are selected commercial services, not open-source packages. No optional paid editor, template or conversion service is included in the default plan.

| Item | Published baseline / planning treatment |
|---|---|
| Razorpay | Standard published pricing is generally 2% plus applicable GST; method-specific/contract pricing may differ. At 2% plus 18% GST on the fee, a ₹1,000 payment has ₹23.60 in fees. Confirm merchant terms before launch |
| R2 Standard storage | $0.015 per GB-month; Class A operations $4.50/million; Class B $0.36/million; direct Internet egress is free. Free tier: 10 GB-month, 1 million Class A and 10 million Class B operations per month |
| R2 example | If average Standard storage is 100 GB-month and operations stay within the free allowances, storage is approximately `(100 - 10) × $0.015 = $1.35/month`, before taxes or other services |
| Application/PostgreSQL hosting and backups | Software can be open source; server resources and managed operations are not assumed free. Quote actual monthly resources after capacity tests |
| Video, email, live meetings and domain | Reuse suitable existing accounts where possible; itemize provider costs and free alternatives before selection |
| Paid equation editor, DOCX conversion, paid UI kit | Not selected. First evaluate open-source/local approaches. Any proposal must include exact fee/usage limits, why free options failed and owner review before adoption |

Official pricing: [Razorpay](https://razorpay.com/pricing/) and [Cloudflare R2](https://developers.cloudflare.com/r2/pricing/). R2's free tier is for Standard storage; usage above allowances is billable. Other Cloudflare services, image transformations and video services have separate pricing. A paid tool's subscription is never silently added to satisfy a feature requirement.
