# GD Tutor: WordPress to React and .NET migration plan

[Documentation index](../README.md) · [Progress tracker](../delivery/PROGRESS.md)

**Version:** 1.2 — independent replacement and standalone capability mapping  
**Prepared:** 14 October 2026  
**Updated:** 16 October 2026  
**Status:** Planning/design with isolated editor investigation; production application foundation has not started.  
**Evidence:** All 65 PNG screenshots in `Project Files`: 17 public/login screenshots, 10 admin screenshots, 30 student screenshots, and 8 common screenshots. See [the screenshot index](../reference/SCREENSHOT-INDEX.md).

## Confirmed direction from the owner

- The new platform must operate independently of WordPress. Do not use its plugins, themes, PHP runtime, headless CMS, live database or APIs in the replacement. Use the old system only as a one-time migration source; rebuild authoring, commerce, learning and administration in React/.NET.
- Execute **one agreed subphase at a time**, including smaller nested subphases where helpful. Finish, demonstrate, report verification, and stop for owner review before advancing. Approval of this overall plan is not approval to execute every subphase.
- Redesign the application with a modern, attractive student experience. Choose accents and a coherent design system; support **Light, Dark, and System** appearance throughout.
- Make the complete application responsive and mobile-first, including quizzes, course playback, account screens, and staff authoring workflows.
- Design and verify the backend for approximately **500 concurrently active students**, including exam traffic, not merely 500 registered accounts.
- Use **PostgreSQL**, **Razorpay** for new payments, and **Cloudflare R2 for images**. The old gateway/storage still need auditing for historical migration.
- Before defining persistent entities, tables, EF mappings, or database migrations, **ask the owner for the previous database/table structure and target database setup information, then review it together**. This is the explicit gate at **2.4.1**; no inferred replacement schema may bypass it.
- Establish the frontend foundation and .NET Clean Architecture foundation as separately reviewed work before implementing business modules.
- Prefer maintained, reputable, open-source packages without paid licenses. Check actual package/version licenses, maintenance, dependencies and security advisories. Document any unavoidable service/tool cost and its free alternative before adoption.
- Provide a dynamic question editor: rich text, visual equation tools, editable LaTeX, formulas in questions/options/explanations, and validated copy/paste workflows from Word and agreed other sources.
- Owner confirmed on 15 October 2026: lifetime/time-limited access configurable per course; scoring, negative marking, passing, retakes and answer release configurable per quiz; both live online classes and offline coaching batches. Detailed policies are in the separately reviewed business-rules document.

Read alongside this plan:

- [Subphase roadmap and review gates](SUBPHASE-ROADMAP.md) — the execution order and acceptance checkpoint for each small piece.
- [Design, packages, formula editor, capacity and service costs](../requirements/DESIGN-AND-TECHNICAL-REQUIREMENTS.md) — the revised implementation requirements.
- [Standalone replacement map](../requirements/STANDALONE-REPLACEMENT-MAP.md) — how legacy capabilities are rebuilt and which integration details remain unknown.
- [Business rules and examples](../requirements/BUSINESS-RULES.md) — confirmed owner decisions and proposed behavior for access, payments, assessments, completion and classes.
- [Data/media inventory and capacity contract](../requirements/DATA-MEDIA-AND-CAPACITY.md) — audited export records, migration coverage gaps and the 500-user/three-hour exam workload proposal.
- [Delivery baseline and six-week target](DELIVERY-BASELINE.md) — scope coverage, sequential backlog, milestone gates, assumptions and risks for the owner working with Codex.

No product code, packages, infrastructure or database changes are authorized by this documentation revision alone.

## 1. Goal and approach

Rebuild GD Tutor as a maintainable learning platform with a React frontend and a .NET backend, preserving the courses, purchases, students, learning history, public content, and useful workflows from WordPress.

This is a replacement of several connected systems: a public website and content editor, a course catalog, commerce and access management, a learning portal, an assessment engine, and staff administration. Matching the visible pages is only one part of completion.

Recommended delivery approach:

1. Establish an agreed inventory of existing behavior and data.
2. Build the new application in a separate staging environment while WordPress remains operational.
3. Break workflows into reviewable subphases and nested subphases; implement only the currently agreed item, including its relevant UI, API, data and validation work.
4. Develop and rehearse data import throughout implementation.
5. Pilot with selected staff and students using controlled data and sandbox payments.
6. Switch production only after access, payments, assessments, migration, and rollback checks pass.

The first review milestones are the visual direction, frontend foundation, and backend foundation. The first complete learning milestone is **a staff member publishing a free course, a student enrolling, studying a lesson, and resuming saved progress**. The next business milestones add assessments and paid enrollment. Each is reached through separately reviewed subphases; none automatically authorizes production replacement.

## 2. What the screenshots establish

| Area | Observed evidence | Planning implication |
|---|---|---|
| Public website | Home, course navigation, Classes 8–12, JEE, NEET, MHT-CET, test series, about, blog, FAQ, testimonials, counselling calls to action | Rebuild public pages and their editing workflow; preserve important URLs and content |
| Catalog and access | Free enrollment and Buy Now actions, rupee prices, sale prices, instructors, categories, ratings | Separate course content from commercial offers and access rights |
| Course content | Subject/topic groups, chapter lessons, video durations, locked items, course information | Support ordered curricula containing lessons and quizzes, including courses consisting mostly of tests |
| Student dashboard | Enrolled/active/completed counts, time spent, continue learning, progress percentages | Define progress and activity rules; migrate underlying records rather than copying dashboard totals |
| Assessments | Timers, multiple-choice questions, formulas, chemical notation, skip/back/next, attempt history, pass thresholds, retries, automatic timeout submission | Assessment timing, saving, grading, and historical integrity are major workstreams |
| Course administration | Course listing, create/edit wizard, description editor, thumbnail, intro video, draft/publish, free/paid, regular/sale price, categories, tags, author | Staff must be able to operate the replacement without WordPress |
| Course configuration | Visibility, publication schedule, difficulty, public-course toggle, Q&A, content-drip and enrollment settings tabs | Controls are visible; their actual configuration and detailed rules require inspection |
| Staff reporting | Earnings, course/student counts, charts, course performance, student quiz attempts | Agree metric definitions and reconcile reports with transaction and enrollment data |
| Student tools | Notes/video notes, wishlist, discussions, calendar, account, security, billing, appearance/accessibility preferences | Include required tools in the parity backlog; empty views still require a scope decision |
| Course extras | Resources, announcements, reviews, live classes, gradebook, certificate locked until completion | Confirm active usage and rules; build agreed capabilities before full parity launch |
| WordPress dependencies | WordPress admin bar and Elementor edit link; LMS-style course builder | Audit plugin versions, extensions, theme, custom code, scheduled tasks, and external services |

**Evidence boundaries:** Screenshots show interfaces and sample states, not the database schema, all user roles, complete transactions, or production capacity. The LMS resembles Tutor LMS, but the exact plugin/version must be verified. WooCommerce, the payment gateway, recurring billing, and live meeting provider are not established by these images. A Social Accounts menu does not establish social login. A counselling button does not establish appointment scheduling.

One quiz summary displays elapsed time of several days for a 90-minute assessment. Treat this as a data or behavior anomaly to investigate; a screenshot alone does not establish the cause. The replacement needs consistent server-enforced deadlines and an explicit policy for historical anomalies.

## 3. Scope boundaries and decisions

### Required launch scope

- Public pages, course and test-series discovery, and course detail pages.
- Accounts, recovery, staff permissions, student settings, and session management.
- Course authoring, categories, curricula, recorded lessons, and learning resources.
- Free enrollment, paid purchase, manual access grants, and access expiration/revocation where required.
- Student dashboard, course player, progress, resume learning, quizzes, results, and history.
- Staff management of courses, learners, assessments, orders, and basic operational reports.
- Migration of existing users, active access, course content, relevant history, and public URLs.
- All confirmed actively used features in the parity checklist.
- Modern design, light/dark/system themes, responsive mobile workflows, dynamic formula authoring, and validated capacity for 500 concurrently active students.

### Included provisionally; confirm depth during discovery

- Live classes, batches, reminders, attendance, and recordings.
- Notes/video notes, wishlist, Q&A, announcements, course reviews, certificates, and gradebook.
- Content drip, enrollment limits, scheduled publishing, coupons, refunds, and manual/offline payments.
- Blog editing, testimonials, FAQ editing, and enquiry management.
- Current languages, accessibility preferences, and compatibility with existing math content.

Empty or locked screens do not justify silently removing a feature. Each gets one explicit disposition: **rebuild for launch**, **preserve historical data with limited UI**, **defer by agreement**, or **retire by agreement**.

### Separate enhancement backlog unless discovery proves existing dependency

- Native mobile apps, advanced proctoring, AI question generation/tutoring.
- A custom live-video conferencing service.
- Multi-institution tenancy, instructor marketplaces, commissions and payouts.
- Advanced recommendation systems, elaborate gamification, advanced business intelligence.
- Parent accounts, attendance hardware, WhatsApp/SMS automation, subscription plans.

Marketing copy or a plugin button advertising a feature does not make that feature a confirmed requirement. Existing subscriptions or payment plans, if discovered, become migration-critical rather than optional.

## 4. Accepted architecture baseline

The [architecture decision](../architecture/APPLICATION-ARCHITECTURE.md) and [API conventions](../architecture/API-CONVENTIONS.md) define the accepted boundaries from 1.6. This overview does not authorize scaffolding, packages or persistent schema work.

| Layer | Proposed choice | Reason and decision boundary |
|---|---|---|
| Frontend | React + TypeScript with accepted Next.js App Router | Public server rendering and private interactive screens; exact supported compatible package graph admitted in 2.1.1 |
| Backend | ASP.NET Core on .NET 10 LTS, accepted architecture baseline | Pin current supported SDK/runtime patches in 2.2.1; installed older patches are not readiness evidence |
| API | Versioned HTTP APIs with OpenAPI contracts | Clear boundary between frontend and business logic; generated frontend types where useful |
| Persistence | EF Core + Npgsql with PostgreSQL | Confirmed database choice; entities and migrations wait for owner-provided legacy structure and schema review at 2.4.1 |
| Identity | ASP.NET Core Identity-owned secure HttpOnly cookies and antiforgery | .NET owns lifecycle/authorization; no parallel Next auth store or browser-localStorage bearer tokens |
| Media | Cloudflare R2 for images; separately agreed resource/video delivery | R2 choice is confirmed for images. Do not assume it includes video transcoding/streaming or Cloudflare Images paid processing |
| Payments | Razorpay | Use test mode first, server verification, idempotent webhook handling and reconciliation |
| Design | Semantic CSS tokens, reusable components, Light/Dark/System themes | Modern student-focused visual direction; mobile-first layouts with reviewed color/contrast pairs |
| Question authoring | Accepted Tiptap OSS + MathLive + custom equation nodes + KaTeX approach | [Selection](../design/QUESTION-AUTHORING-DECISION.md) defines required DOCX repair, planned chemistry extension, package and compatibility gates; worker tool boundary accepted in 1.6 |
| Jobs | Separate durable .NET Worker with PostgreSQL coordination after schema approval | Email, imports, content validation, scheduled work, reconciliation and retries; no process-local queue as durable acceptance |
| Observability | Structured logs, request correlation, health checks, metrics, error reporting | Diagnose checkout, quiz-save, import, and content-access failures |
| Deployment | Automated builds, staging and production, managed database, backups | Repeatable releases and recoverability |

Next.js is a React framework. Its role here is frontend rendering and delivery; .NET remains responsible for permissions, pricing, purchases, enrollment, progress, and grading. Next.js documentation describes its server/client component model: [official rendering documentation](https://nextjs.org/docs/app/getting-started/server-and-client-components).

Microsoft lists .NET 10 as LTS with support through November 2028: [official support policy](https://dotnet.microsoft.com/en-us/platform/support/policy). Exact dependency versions will be recorded and checked again when scaffolding begins.

### Application structure

Use a **modular monolith organized with Clean Architecture**: Domain, Application, Infrastructure and API boundaries, with business features grouped inside them. Domain has no infrastructure dependency; Application depends on Domain and exposes interfaces; Infrastructure implements persistence and external integrations; API is the composition/HTTP boundary. Avoid redundant abstraction layers and unnecessary mediator/mapping packages. This gives us manageable deployment and transactions while leaving room to split services later if measured demand requires it.

```text
Visitors / Students / Staff
             |
     React / Next.js UI
             |
       ASP.NET Core API
             |
  Identity | Catalog | Learning | Assessment
  Commerce | Scheduling | Community | Content | Reporting
             |
     PostgreSQL + durable background jobs
             |
     R2 images | Razorpay | Video | Email | Meeting provider
```

Prefer a same-origin public deployment with `/api` routed to .NET. Specify CSRF protection for cookie-authenticated writes, appropriate cookie settings, and strict CORS only where cross-origin access is necessary. Personalized pages must not enter shared public caches.

Suggested repository layout, created only after plan approval:

```text
apps/web/src/app/             Routes, layouts and application composition
apps/web/src/features/        Course, learning, assessment and other feature code
apps/web/src/components/ui/   Reusable visual primitives
apps/web/src/components/layout/ Shared application shells
apps/web/src/lib/             API client, errors, formatting and shared utilities
apps/web/src/hooks/           Only genuinely shared hooks
apps/web/src/styles/          Semantic tokens, themes, typography and base CSS
apps/web/src/types/           Shared/generated contracts; local types stay with features
src/GDTutor.Domain/          Business rules and entities after the schema review
src/GDTutor.Application/     Use cases, contracts, validation and service interfaces
src/GDTutor.Infrastructure/  PostgreSQL, R2, Razorpay and other service adapters
src/GDTutor.Api/             Endpoints, middleware, dependency injection and startup
src/GDTutor.Worker/          Durable job host when introduced in its authorized leaf
tools/migration/             Versioned import and reconciliation utilities
tests/                       Domain, integration, browser and load verification
infra/                       Environment and deployment configuration
docs/                        Decisions, backlog, runbooks and review records
```

Do not introduce microservices, a separate search cluster, or caching infrastructure merely because the application has many screens. Add infrastructure when actual workloads justify it.

## 5. Business rules to settle before detailed implementation

| Topic | Questions to resolve | Recommended starting position |
|---|---|---|
| Roles | Does every teacher manage all courses? Who handles refunds and content publication? | Student, instructor, administrator; add narrower content/support/finance permissions as needed |
| Course structure | Can one test or lesson appear in multiple courses? Can a course have multiple authors? | Explicit curriculum items and instructor assignments; version shared questions |
| Free access | Does free mean public viewing or free enrollment? | Distinguish public preview from authenticated free enrollment |
| Paid access | Lifetime/time-limited configurable per course is confirmed; settle activation and expiry details | Review business rules Q-02; recurring payments remain a separate unresolved scope |
| Enrollment | Are students also enrolled manually or through offline payment? | Record source, operator, reason, dates, and access status |
| Completion | Watching, marking complete, passing a quiz, or all required items? | Store explicit rules; enforce them in .NET |
| Quiz grading | Per-quiz marks/negative marking/pass score confirmed; settle types, partial credit and rounding | Review business rules Q-04; do not impose one global exam formula |
| Retakes | Limits, waiting period, highest/latest/first score? | Configure per assessment and preserve every attempt |
| Quiz review | When can students see correct answers/explanations? | Configurable release policy; never send hidden answer keys early |
| Classes | Both online classes and offline coaching batches confirmed; settle eligibility, attendance and recordings | Review business rules Q-06; keep grade, batch and session concepts separate |
| Refunds | Full/partial, purchased bundle, already consumed content? | Define financial state and access consequences explicitly |
| Certificates | Completion only, score threshold, attendance, or staff approval? | Eligibility evaluated server-side with auditable issue/revoke records |
| Reporting | Gross sales, net receipts, refunded revenue, enrollments versus students? | Write definitions and sample reconciliations before charts |

An instructor's course permissions must be checked against the requested course, not just their role. The same applies to a student's enrollment and attempt ownership. This follows ASP.NET Core's resource authorization model: [Microsoft documentation](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/resourcebased?view=aspnetcore-10.0).

## 6. Proposed data model

This is a conceptual domain outline, not a finalized or approved database schema. At **2.4.1**, request the owner's previous table structure/database details and review the migration mapping. Do not implement persistent entities, EF mappings, tables or migrations until that review is complete. Frontend mock contracts and backend infrastructure-free scaffolding can precede it.

| Module | Main records |
|---|---|
| Identity | User, Profile, Role, Permission, Session, Address, Preference, LegacyIdentityMap |
| Catalog | Course, CourseVersion, Category, Tag, InstructorAssignment, CurriculumSection, CurriculumItem |
| Learning | Lesson, MediaAsset, Resource, Enrollment, AccessGrant, LessonProgress, ResumePosition, LearningActivity |
| Assessment | Question, QuestionVersion, AnswerOption, Quiz, QuizVersion, QuizQuestion, Attempt, AttemptQuestion, AttemptAnswer, GradeRevision |
| Commerce | Offer, Cart, Order, OrderLine, PaymentAttempt, PaymentEvent, Refund, Coupon if required |
| Scheduling | Batch, BatchMembership, ClassSession, MeetingReference, Attendance, RecordingReference |
| Community | Note, DiscussionThread, Reply, Announcement, Review, WishlistEntry |
| Completion | CompletionRule, CourseCompletion, GradebookEntry, Certificate |
| Website | Page, BlogPost, Menu, FAQ, Testimonial, Enquiry, Redirect |
| Operations | Notification, Job, AuditEvent, ImportRun, LegacyIdMap, ReconciliationIssue |

Important distinctions:

- **Order is a purchase record; enrollment is a learning relationship; access grant is permission.** A student may have a manual grant without an order, or a refunded order whose access must be reconsidered.
- Store purchase-time prices, discounts, currency, and relevant billing details as immutable snapshots. Later course price changes must not alter historical orders.
- Preserve legacy identifiers and transaction references so support can trace old records.
- Store timestamps consistently in UTC and display user/session timezone; default the site to Asia/Kolkata where appropriate.
- Use precise money representations, explicit currency, foreign keys, uniqueness constraints, and concurrency controls.
- Preserve the exact questions/options/rules served to an attempt. Editing the question bank must not rewrite an old result.
- Distinguish attempt state, learning completion, quiz passing, and certificate eligibility.
- Decide how curriculum changes affect existing learners' progress. Adding lessons must not unexpectedly invalidate earned certificates.

## 7. Implementation phases

The phase descriptions below define scope, not permission to execute a whole phase. The [subphase roadmap](SUBPHASE-ROADMAP.md) defines the smaller review units. Work on one agreed leaf item at a time; finish its verification and report, then wait for owner review. Parent items such as 2.1 must be executed through their separately reviewed children where listed.

### Phase 0 — Discovery and migration audit

**Purpose:** Replace assumptions with an agreed scope and source-data inventory.

**Work:**

1. Review screenshots with the owner; record required, optional, and unused functionality.
2. Map existing behavior and integration/data dependencies to standalone replacements. Inspect legacy configuration or read-only exports only when necessary to explain behavior or extract data; do not adopt WordPress packages or runtime services.
3. Inventory users, courses, curricula, media, questions, attempts, orders, refunds, access grants and public content.
4. Identify the old source system and providers where they affect migration; record unknowns with an owner and decision point. The new platform implements LMS/commerce capabilities itself and integrates Razorpay/R2 directly.
5. Capture missing workflows: registration/recovery, checkout success/failure, refunds, curriculum/question authoring, populated live classes, and completed certificates.
6. Measure data/media volume and current performance; establish realistic workload scenarios for the confirmed target of 500 concurrently active students, including simultaneous quizzes.
7. Decide identity mapping, password strategy, course access rules, quiz grading, and what historical records must remain accessible.
8. Run a small export feasibility check for one representative course, student, order and quiz attempt.

**Deliverables:** Feature-parity matrix, role matrix, source inventory, sample exports, initial risks, decisions, and revised estimate.

**Done when:** Every known workflow has an agreed disposition; critical data can be extracted; unknowns have owners. Missing database or plugin access can block reliable migration estimates even if UI work can proceed.

### Phase 1 — Experience design, architecture and contracts

**Depends on:** Phase 0 baseline.

**Work:**

- Map visitor-to-purchase, free enrollment, study/resume, quiz/retake, class joining, and staff publishing workflows.
- Develop a modern redesign with reviewed accent colors, typography, spacing, illustration/icon direction and light/dark palettes; retain useful brand recognition without reproducing the old layout.
- Define public navigation, student navigation, instructor workspace, and administrator workspace.
- Design responsive screens and reusable components: cards, forms, tables, editor, player, quiz runner, results, dialogs and empty/error states.
- Define keyboard behavior, focus, contrast, font scaling, reduced motion, and readable formulas on small screens.
- Finalize frontend approach, PostgreSQL integration boundaries, conceptual API contracts and permissions. Defer persistent entity/table design until the explicit database-structure review at 2.4.1.
- Prototype formula authoring and Word/browser copy/paste using representative supplied questions before committing to editor packages or estimating full import support.
- Write a mapping from old public routes to proposed new routes.

**Deliverables:** Reviewed visual direction and mobile/desktop wireframes in both themes, theme tokens, route map, architecture decisions, conceptual API contracts and formula-editor feasibility findings. Database design remains gated.

**Done when:** One complete student flow and one staff authoring flow are reviewed on mobile and desktop; unresolved architecture decisions do not block the foundation.

### Phase 2 — Engineering foundation and first migration slice

**Depends on:** Phase 1.

**Work:**

- First deliver frontend scaffolding in 2.1, then .NET Clean Architecture scaffolding in 2.2, each through its own reviewed nested subphases.
- Establish common components, CSS tokens, theme switching, API/error conventions, dependency injection and configuration before business features.
- At **2.4.1**, ask the owner for previous tables/relationships and target PostgreSQL details; pause schema-dependent work until those are provided and reviewed.
- Only after schema approval, implement persistent entities, EF Core/Npgsql mappings, database migrations and development database setup.
- Build application shells, shared validation/error handling, API client contracts, logging and health checks.
- Establish development, staging and production configuration boundaries; keep secrets and production exports outside source control.
- Configure automated builds and meaningful test execution, plus repeatable staging deployment.
- Add storage and email abstractions with local/sandbox implementations.
- Build the migration runner with validation-only mode, legacy-ID mappings, import logs and rerunnable batches.
- Import a small sample of users/categories/course metadata into staging, extending the importer as later modules arrive.

**Deliverables:** Running application skeleton, staging URL, build pipeline, schema baseline and migration proof of concept.

**Done when:** A clean checkout can be built/deployed, health checks work, and rerunning the sample import creates no duplicates.

### Phase 3 — Accounts, permissions and student settings

**Depends on:** Phase 2.

**Work:**

- Registration, verification if required, login/logout, forgotten password and password change.
- Staff account provisioning, instructor assignments, administrator permissions and account suspension.
- Profile, avatar, billing details, timezone and agreed appearance/accessibility preferences.
- Session expiration/revocation, brute-force controls, audit events, and staff MFA setup.
- Implement the chosen legacy-user migration and recovery process.
- Validate username/email/phone mapping; do not treat phone-like usernames as verified phone ownership.

**Deliverables:** Working identity flows, protected routes, API permission checks, account management and identity import.

**Done when:** A student cannot access staff operations or another student's information; suspension and recovery work; migrated test accounts follow the agreed login process.

### Phase 4 — Website, catalog and course authoring

**Depends on:** Phase 3.

**Work:**

- Build home, about, contact/counselling enquiry, FAQ/testimonials, blogs and navigation/footer.
- Build course/test-series listings with grade/exam/category filters, search, pagination, and free/paid presentation.
- Build course detail pages with curriculum preview, authors, descriptions, pricing, reviews summary and enrollment actions.
- Build staff editing of public content and course metadata, thumbnails, descriptions, categories, tags and instructor assignments.
- Implement draft/publish/archive, scheduled publication where required, validation and preview.
- Build curriculum authoring: ordered sections, video/text lessons, resources, and placeholders for quiz items.
- Introduce metadata, canonical URLs, sitemap generation, structured content and redirect support.
- Import representative public content and curricula; convert WordPress shortcodes/page-builder output into supported content.

**Deliverables:** Editable public site and staff-created courses backed by real APIs and database records.

**Done when:** Staff can publish/edit a course and a blog post without developer assistance; draft content is hidden from unauthorized visitors; catalog filters and URLs work.

### Phase 5 — Free enrollment and recorded learning

**Depends on:** Phase 4.

**Work:**

- Implement free enrollment, manual access grants, entitlement checks, and configured access expiry.
- Build student dashboard, enrolled/active/completed courses and continue-learning links.
- Build course player, curriculum navigation, video/text content and protected resources.
- Save lesson progress and playback position; define completion and activity/time-spent calculation.
- Add course-level announcements/resources views and foundations for notes.
- Implement content-drip/prerequisite rules if confirmed during discovery.
- Import enrollments and lesson progress; test reference students against their legacy state.

**Deliverables:** First complete learning workflow: publish → enroll → study → resume.

**Done when:** Progress survives logout and device changes; unauthorized/expired users cannot retrieve protected content by calling the API directly; free enrollment is duplicate-safe.

### Phase 6 — Quiz authoring, attempts and grading

**Depends on:** Phase 5; question/import investigation starts during Phase 0.

**Work:**

- Build question-bank and quiz editing with curriculum placement and preview.
- Include visual equation authoring, editable LaTeX, inline/display math, chemistry templates, and formulas in answer options and explanations. Complete the Word/other-source paste compatibility matrix, review/repair flow and safe content serialization specified in the companion requirements.
- Support observed single-choice questions first, then every additional existing type confirmed by the audit.
- Preserve math/chemistry notation, images, symbols, superscripts and explanations; test representative imported content.
- Configure marks, pass threshold, duration, retakes, question order, negative/partial grading and result-release policy as required.
- Build start instructions, runner, saved answers, navigation, skip, submit, timeout, results and attempt history.
- Build staff attempt inspection and grade correction with audit history.
- Import historical attempts and preserve their original scoring context.

**Reliability requirements:**

1. The server creates start/deadline timestamps; refreshing or changing the device clock cannot extend an attempt.
2. Save answers incrementally with explicit saved/unsaved status and safe retries. Offline answers are pending until the server acknowledges them.
3. Reject answer writes after the deadline according to the agreed grace policy; enforce expiry in API reads/writes as well as scheduled jobs.
4. Make submission idempotent and coordinate concurrent timeout/manual submission so grading occurs once.
5. Persist the question/option order and version for each attempt; handle multiple tabs/devices deterministically.
6. Keep answer keys and unreleased explanations out of student API responses.
7. Define behavior for disconnection, browser closure, server restart, retake exhaustion and instructor corrections.

**Deliverables:** Complete assessment authoring and student examination workflow, plus attempt migration and reconciliation.

**Done when:** Agreed grading examples match exactly; timeout/reconnect/duplicate-submit tests pass; editing a quiz does not change an earlier attempt; simultaneous exam load meets the agreed target.

### Phase 7 — Paid access, checkout and order operations

**Depends on:** Phases 3–5 and accepted access contracts. Follow the sequential subphase roadmap; reorder only through an explicit owner decision, without running ahead of the current review.

**Work:**

- Implement offers, server-calculated prices, sale prices, cart if required, checkout and billing details.
- Integrate **Razorpay** in test mode; create orders server-side and record payment attempts/provider references. Verify payment state and signatures before granting access.
- Grant access from server-verified payment state, with durable event processing and retries.
- Build student order/receipt history and staff order/payment search.
- Implement failed/pending/cancelled payments, full/partial refunds, disputes and access consequences as applicable.
- Add coupons, offline/manual payment recording or bundles only to the agreed depth.
- Migrate historical orders/payments and link them to existing access without charging users again.

**Reliability requirements:**

- Verify webhook signatures and order amount/currency; a browser success page alone cannot grant access.
- Deduplicate provider events and repeated checkout requests; tolerate delayed and out-of-order events.
- Reconcile payments that succeeded when the browser closed or a webhook failed.
- Record refunds separately and evaluate whether another valid grant still gives the learner access.
- Importing an old paid order must not trigger a new charge, receipt email, or duplicate enrollment.

**Deliverables:** Buy → verified payment → access → receipt; operational refund and reconciliation workflows.

**Done when:** Sandbox success/failure/refund and duplicate-event cases pass; financial totals reconcile; a refund or revoked grant has the agreed access effect.

### Phase 8 — Live classes, batches and calendar

**Depends on:** Phase 5 and Phase 7 where paid access applies.

**Work:**

- Confirm the meaning of classes: recorded course, student grade, live meeting, offline batch, or a combination.
- Implement batches and memberships only where the real delivery model needs them.
- Build staff session creation, scheduling, rescheduling/cancellation, instructor assignment and capacity rules.
- Build student calendar/list views with timezone-aware times and entitlement-protected join actions.
- Integrate the chosen meeting provider to the agreed depth; a managed external meeting link may be enough initially.
- Add reminders, attendance/manual correction and recording access if required.
- Connect session events to the student calendar and relevant course.

**Deliverables:** Staff schedules → eligible student sees reminder/calendar → joins → accesses recording where available.

**Done when:** Unauthorized users cannot retrieve private join information; timezones and cancellations work; attendance is either provider-verified or explicitly recorded manually, not inferred from clicking Join.

### Phase 9 — Learning support and completion features

**Depends on:** Phases 5–6; Phase 8 for attendance-dependent rules.

**Work:**

- Personal notes and timestamped video notes, search and course filters.
- Wishlist, discussions/Q&A, replies and staff moderation.
- Course announcements and notification preferences.
- Course reviews with eligibility and moderation rules.
- Gradebook aggregation, course completion and certificate eligibility.
- Certificate generation, verification reference, download, reissue and revocation as required.
- Complete agreed settings/preferences and import existing community/completion records.

**Deliverables:** The agreed student support tools and end-of-course experience.

**Done when:** Private notes remain private, discussion/review permissions work, and certificates cannot be issued by manipulating a client-side completion percentage.

### Phase 10 — Administration, reports and support operations

**Depends on:** Relevant data-producing modules from Phases 3–9.

Basic administration is built with each feature; this phase completes cross-module operations and reporting.

**Work:**

- Student search, account history, enrollment/access adjustments and support investigation views.
- Staff role/assignment management and publishing controls.
- Course performance, quiz performance, enrollment counts and activity reporting.
- Sales/refund summaries with written gross/net and date-range definitions.
- Enquiry handling, media administration, safe data exports and audit-log search.
- Background-job failure visibility, notification delivery status and payment mismatch reports.
- Operating guides for content authors, teachers, support and administrators.

**Deliverables:** Staff can run everyday operations without database edits or WordPress.

**Done when:** Selected report totals match source records and legacy reconciliation samples; instructors see only permitted data; sensitive changes identify who changed what and why.

### Phase 11 — Migration rehearsals, system testing and pilot

**Depends on:** All agreed launch features. Migration tools have been developed since Phase 2.

**Work:**

- Rehearse full imports from a dated snapshot, then perform a repeat run and a delta run.
- Validate content conversion, media availability, passwords, access, historical attempts and finances.
- Execute browser journeys across visitor/student/instructor/admin roles and mobile/desktop sizes.
- Test concurrency, quiz submission peaks, failed external services, job retries and database restore.
- Review accessibility, authorization, rich-text/upload handling and sensitive data exposure.
- Crawl old/new URLs and validate redirects, metadata, sitemap and private-page indexing controls.
- Pilot with representative staff/students; resolve issues and record acceptance.
- Rehearse cutover, rollback boundaries and post-switch transaction reconciliation.

**Deliverables:** Reconciliation report, test results, pilot feedback, resolved launch blockers, and deployment/rollback runbooks.

**Done when:** All active access rights reconcile, required historical data is accounted for, no unresolved critical defects remain, and stakeholders accept the release checklist.

### Phase 12 — Production migration and launch

**Depends on:** Phase 11 release decision and an agreed launch window.

**Work:**

1. Take verified WordPress/database/media backups and record the final source snapshot.
2. Stop new quiz starts and allow active attempts to finish, unless a separately tested attempt-transfer strategy exists.
3. Freeze affected writes: publishing, enrollment, checkout and learning changes for the agreed maintenance window.
4. Drain/reconcile pending payments; keep provider events durably captured during the switch.
5. Run final delta import including edits, deletions, refunds and access changes.
6. Reconcile totals and spot-check priority users/courses/orders.
7. Switch routing/domain configuration, payment callbacks and scheduled jobs using the runbook.
8. Verify login, legacy access, free enrollment, a controlled real purchase/refund, video, quiz, class links and redirects.
9. Enable traffic progressively where practical and monitor error/support rates.

**Deliverables:** Production React/.NET platform with reconciled data and launch evidence.

**Done when:** Critical journeys work in production, pending payments are reconciled, and the support/monitoring handover is active.

### Phase 13 — Stabilization and WordPress retirement

**Depends on:** Phase 12.

**Work:**

- Monitor purchase/access mismatches, failed logins, quiz saves, job failures, video errors and missing redirects.
- Resolve user-reported migration issues using legacy IDs and audit trails.
- Verify scheduled backups, recovery exercises, operating alerts and documentation ownership.
- Keep the legacy application restricted and read-only for an agreed retention period.
- Decommission old jobs, credentials, hosting and plugin subscriptions after rollback/support needs are met.
- Reprioritize enhancements using actual user feedback.

**Done when:** The agreed stabilization period passes without unresolved critical issues; recovery and support procedures are owned; legacy retirement is explicitly accepted.

## 8. Data migration plan in detail

### Extraction and mapping

Audit WordPress core records, LMS-specific tables/metadata, commerce storage, uploaded files, external media references and custom fields. Do not assume a standard WordPress content export contains quiz attempts, payments or all enrollment data.

If WooCommerce is present, its product CSV and customer/order export facilities are separate documented mechanisms; validate which data they actually cover before choosing them. See [product CSV documentation](https://woocommerce.com/document/product-csv-importer-exporter/) and [customer/order export documentation](https://woocommerce.com/document/ordercustomer-csv-export/). A database-level export or custom extractor may still be required for this LMS migration.

For every entity, record: source location, source key, target key, transformation, dependencies, validation, rejected-record policy and retention disposition. Keep raw extracts immutable and access-restricted; anonymize staging copies where practical.

### Recommended import sequence

1. Identity and roles; categories and reference data.
2. Public pages, posts, media manifests, authors and course metadata.
3. Curriculum, lessons, questions, quiz definitions and assets.
4. Offers/products, historical orders, payment references and refunds.
5. Enrollments and access grants, including non-purchase grants and expiry dates.
6. Learning progress, quiz attempts, answer records and historical outcomes.
7. Notes, discussions, reviews, announcements, class records and certificates where retained.
8. Redirects, derived reports and search indexes if used.

### Password migration

Passwords cannot be read back from hashes. Inspect actual formats before choosing a route. WordPress changed its default password hashing in version 6.8, so assuming every user has an identical legacy hash is unsafe: [WordPress Core announcement](https://make.wordpress.org/core/2025/02/17/wordpress-6-8-will-use-bcrypt-for-password-hashing/).

Choose between a tested compatibility verifier that validates supported legacy hashes and rehashes after successful login, or a controlled password-reset campaign. If using compatibility, validate WordPress-specific processing with fixtures and time-limit the compatibility path. Sessions are invalidated at migration. Never export plaintext passwords or replace existing accounts with a shared default password.

### Required reconciliation

| Dataset | Validation |
|---|---|
| Users | Count and mapping coverage; duplicate identities and unverified contacts explicitly handled |
| Courses/content | Published/draft status, curriculum order, links, formulas and representative visual comparison |
| Media | File manifest, sizes/checksums where applicable, accessible originals and controlled paid downloads |
| Orders | Count and totals by currency/status/date; payment and refund references; historical amounts unchanged |
| Access | Every active source grant has an equivalent target grant and correct expiry; explain every exception |
| Progress | Completed item sets and resume positions agree; investigate percentage differences caused by rules |
| Attempts | User/quiz mapping, answers where available, earned marks, status and timestamps preserved |
| Certificates | Existing awards remain traceable; rule changes do not silently revoke them |
| Public URLs | Every priority old URL resolves directly or through an appropriate permanent redirect |

Importers must be rerunnable, checkpointed, deterministic and auditable. Disable outbound emails, charging and learner notifications during replay. Do not silently drop invalid records; produce an exception report and a resolution decision. If legacy detail is unavailable, preserve the available original result and clearly label its limits rather than inventing answers or recomputing marks without evidence.

### Cutover and rollback

The default is one production writer at a time. Avoid open-ended bidirectional syncing between WordPress and the new platform.

Before new-platform writes begin, rollback can restore traffic to the unchanged legacy source. After new purchases, attempts or profile changes occur, a DNS reversal alone is insufficient. First freeze new writes, export the post-switch changes, reconcile payment events, then use a rehearsed reverse-import process or a controlled forward fix. Record the decision owner, rollback trigger, maximum observation window and reconciliation steps in the runbook.

Proposed triggers include widespread login failure, incorrect paid access, lost quiz answers or material payment mismatches. Quantitative thresholds must be agreed from expected traffic in Phase 0.

## 9. Quality and operational acceptance

Tests accompany each module; Phase 11 adds full-system validation rather than starting testing from scratch.

| Area | Minimum evidence |
|---|---|
| Access | Student cannot read another student's profile/notes/attempts; unenrolled user cannot request paid content; instructor scope enforced |
| Learning | Resume survives sessions/devices; completion and entitlement rules are consistent across UI/API |
| Assessments | Known grading fixtures; no hidden keys; duplicate submit, timeout, refresh, clock change, disconnection and concurrent-save cases |
| Payments | Tampered price, failed/late/duplicate webhook, closed browser, refund, reconciliation and repeat checkout |
| Migration | Repeat and delta imports; foreign-key integrity; active grants and financial totals reconciled |
| Content | HTML sanitized; supported formulas/images render; uploads validated; private files use authorized delivery |
| Accessibility | Keyboard/focus, readable quiz content, mobile controls, contrast and agreed preference behavior |
| Operations | Alert delivery, failed-job retry, backup restore, deploy rollback and support lookup exercise |

The required target is **500 concurrently active students**. Verify both a realistic mixed learning workload and 500 concurrent quiz attempts, including a synchronized start/submit burst. The companion requirements define test durations, workload assumptions and acceptance metrics. Initial targets: public LCP around 2.5 seconds on the agreed mobile profile, common API p95 under 500 ms, quiz saves p95 under one second, and final submission acknowledgment p95 under two seconds in the defined test environment. Capacity is established by measured evidence; neither a framework choice nor 500 idle sessions proves it.

Agree recovery point/time objectives based on business needs and hosting capability. A proposed baseline is database recovery to within 15 minutes and service recovery within four hours, subject to a successful restore rehearsal and cost review.

For learner data, especially where students are minors, discovery must identify applicable consent, retention, account deletion and export requirements with the owner. Translate approved policy into product behavior and vendor choices; this plan does not assert legal compliance.

## 10. Timeline and staffing assumptions

**Active model, 15 October 2026:** The owner will implement with Codex, has no fixed launch date, and requested an approximately one-and-a-half-month target. The [0.5 delivery baseline](DELIVERY-BASELINE.md) proposes a six-week stretch sequence for the scoped release candidate, with conditional production readiness and separate post-launch reviews. Its timeboxes are planning budgets, not measured forecasts. The older table below is historical only; do not use it as the current team/calendar assumption.

The table below preserves the version 1.0 baseline for context; it is not the revised delivery commitment. Its assumptions were one frontend engineer, one .NET engineer, shared QA/design/operations support, timely owner feedback, working source exports, one gateway, one meeting integration, and limited custom plugin behavior. Weeks below were elapsed phase estimates for that team, not person-weeks. Re-estimate against the sequential subphase roadmap and new requirements before scheduling.

| Phase | Initial range |
|---|---:|
| 0. Discovery/audit | 1–2 weeks |
| 1. Design/architecture | 2–3 weeks |
| 2. Foundation/import slice | 1–2 weeks |
| 3. Accounts/permissions | 1–2 weeks |
| 4. Website/catalog/authoring | 3–4 weeks |
| 5. Enrollment/learning | 2–3 weeks |
| 6. Assessment engine | 4–6 weeks |
| 7. Payments/access | 2–4 weeks |
| 8. Classes/calendar | 2–3 weeks |
| 9. Support/completion | 2–4 weeks |
| 10. Operations/reporting | 2–3 weeks |
| 11. Rehearsals/testing/pilot | 3–4 weeks |
| 12. Launch | About 1 week including preparation |
| 13. Stabilization | 2–3 weeks |

The previous baseline was approximately **28–44 weeks** before contingency. Treat it as historical planning context, not the revised delivery commitment: detailed redesign, theme coverage, formula/paste compatibility, 500-student capacity testing and the owner's sequential review cadence require re-estimation. Work is serialized through reviewed subphases; review waiting time and rework are additional calendar time. Estimate each next leaf item before it begins and update the forecast after discovery and the formula prototype. Keep a 20–30% uncertainty reserve until those investigations are complete. A single developer will generally take longer, and AI assistance does not remove review, integration or migration rehearsal time.

Likely schedule drivers: legacy data quality, unusual quiz types, advanced checkout rules, video hosting changes, live-provider integrations, content conversion and expanded scope.

Prefer free open-source software; commercial infrastructure still has operating costs. Razorpay and R2 are confirmed external services, not open-source libraries. Their published baseline fees and examples are recorded in [the cost register](../requirements/DESIGN-AND-TECHNICAL-REQUIREMENTS.md#6-package-policy-and-cost-register). Hosting, database operations, video, email and meeting costs need an itemized estimate before a paid service is enabled. No purchase, subscription or live payment is implied by this plan.

## 11. Main risks and planned responses

| Risk | Response |
|---|---|
| Screenshots omit business-critical plugin behavior | Audit installed configuration and real transactions before final scope |
| LMS exports omit attempts/progress | Prove extraction early with representative records and custom extraction if needed |
| Learners lose paid access | Treat active access reconciliation as a launch blocker |
| Incorrect timing or grading | Server deadlines, versioned attempts, explicit scoring rules and reference fixtures |
| Duplicate/late payments | Durable deduplicated provider events and operational reconciliation |
| Math or embedded content breaks | Early representative conversion tests and supported rich-content formats |
| Existing public video links cannot provide paid-media protection | Confirm provider/ownership; decide whether to retain or migrate assets based on required access control |
| Search traffic drops | Inventory URLs, preserve slugs where possible, validate redirects/metadata before launch |
| Staff still depend on WordPress | Build editing and operational workflows alongside student features |
| Simultaneous exam traffic overwhelms the app | Set capacity targets early; test quiz-save and submit peaks against realistic data |
| Cutover creates two conflicting sources | Freeze writes, use a final delta, drain events and define rollback after new writes |
| Scope continually expands | Maintain a separate enhancement backlog and record phase changes with their impact |

## 12. How we will work through the phases

For each agreed leaf subphase:

1. State the exact item ID, scope, dependencies and acceptance examples. Split it again if the review would be too large.
2. Resolve only the decisions needed for that item; identify any required owner input in advance.
3. Implement only that item's agreed work. Foundation subphases can intentionally deliver structural work without business features.
4. Run appropriate verification and prepare a local/staging demonstration or concrete document/configuration review.
5. Report changed files, demonstrated behavior, validation, limitations, package/cost additions and remaining decisions.
6. Set the item to Ready for review and **stop**. Fix requested issues within that same item; do not start another item while waiting.
7. Mark Accepted when the owner accepts it. Start the next named item only when the owner's reply also authorizes proceeding; otherwise wait.

Track tasks as **Not started → In progress → Ready for review → Accepted**, with **Changes requested** when needed. Track blockers separately. Accepting a plan or parent phase does not automatically accept its children. An instruction to proceed to a specific next item authorizes that item only. A phase is accepted when its child items and overall criteria are met; a screenshot of a finished page alone is insufficient.

Suggested next planning deliverables after reviewing this document:

- Confirmed scope/parity matrix and feature priorities.
- Screen and route inventory with required mobile states.
- Final role/permission matrix.
- Business-rule decisions for access, quizzes, classes and completion.
- Database diagram and API/module boundaries.
- Phase 0 and Phase 1 task-level backlog.

## 13. Decisions requested for the next revision

These are review prompts, not prerequisites for reading this first draft:

1. Review the proposed modern accent palette and visual direction; implementation will include light/dark/system themes.
2. Review the Next.js App Router choice and .NET/API/worker boundaries in 1.6. PostgreSQL is confirmed; schema remains gated at 2.4.1.
3. Which LMS/commerce plugins and old payment provider are installed, and can we inspect a read-only export or staging copy? The new gateway is Razorpay.
4. Online classes and offline coaching batches are confirmed alongside recorded lessons. Which meeting/video services and attendance/recording policies are required?
5. Lifetime/time-limited course access is confirmed as configurable. Review activation/expiry proposals and indicate whether offline enrollments or existing subscriptions need support.
6. Per-quiz scoring/retakes/answer-release settings are confirmed as configurable. Review required answer types and concrete scoring examples in the business-rules document.
7. Must every historical quiz answer remain available, or is some older history allowed to be an archived result record?
8. Which features are essential for first production launch, and which can be explicitly deferred?
9. How many staff/developers will work on this, and is there a target launch date or budget limit?
10. What are the total user count, typical activity mix and media volume? The new platform target is already 500 concurrent students.
11. At subphase 2.4.1, provide the previous database/table structure and target database details before persistent entity design. Do not paste production credentials into planning documents.
12. During the authoring prototype, provide representative Word/LaTeX questions and identify the Word versions and other source platforms staff use.

**Current next action:** Review [2.1.1 frontend scaffold](../delivery/reviews/2.1.1-frontend-scaffold.md), [run instructions](../../apps/web/README.md) and [local preview](http://127.0.0.1:3000/). Owner accepted the 1.6 architecture and authorized 2.1.1 through “go ahead.” Next proposed leaf is **2.1.2**, common CSS/tokens and Light/Dark/System, not started. Shared components, responsive shells, API client and backend follow in separate reviews. PostgreSQL still requires owner-provided prior structure at 2.4.1; native compatibility, converter admission and authoring effort conditions remain.
