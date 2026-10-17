# Subphase progress tracker

**Updated:** 17 October 2026  
**Active item:** None — 2.3.1 accepted; repository checkpoint requested  
**Awaiting owner review:** None  
**Next proposed item:** 2.3.2 — build/dependency checks and repeatable setup; not started  
**Execution authorization:** Owner accepted 2.3.1 with “great” and requested a commit/push on 17 October 2026. No next implementation leaf is authorized by this checkpoint request.

## How to use this tracker

This is the single source of execution status. The [roadmap](../planning/SUBPHASE-ROADMAP.md) owns scope and review gates; [review records](reviews/README.md) hold evidence and owner feedback. The work labels below are navigational summaries, not additional requirements.

- Set only one agreed leaf item to **In progress** at a time.
- On completion, set **Ready for review**, link its record, and stop.
- Use **Changes requested** while addressing owner feedback.
- Mark **Accepted** only after owner acceptance; start the next item only when authorized.
- Keep blockers in the review record; do not treat missing input as completed work.
- When splitting an item, mark its parent **Split — see children** and add child rows. Do not count the parent as a completed leaf.
- Update the summary and counts when statuses change. A parent phase is accepted only when its children and overall criteria are accepted.

## Current summary

| State | Leaf items |
|---|---:|
| Not started | 66 |
| In progress | 0 |
| Ready for review | 0 |
| Changes requested | 0 |
| Accepted | 23 |

Phases 0 and 1 and frontend leaves 2.1.1–2.1.5 are accepted. Compact Blue with refined component density and fluid width is the accepted current visual foundation. Backend project foundation 2.2.1 is accepted. Service/configuration 2.2.2 is accepted; HTTP foundation 2.2.3 is accepted; frontend/API integration 2.3.1 is accepted; schema and provider work remain later leaves. Owner requested a new GitHub checkpoint on 17 October 2026; see Git history for its commit identity. Previous checkpoint was 4d064ee.

**Required database input:** At **2.4.1**, request and review the previous database/table structure and PostgreSQL environment details before persistent entities, EF mappings or migrations.

## Items by phase

### Phase 0 — Discovery

| ID | Work | Status | Review record |
|---|---|---|---|
| 0.1 | Screenshot-based feature inventory and visitor/student/staff journeys | Accepted | [0.1 review](reviews/0.1-feature-inventory.md) |
| 0.2 | Legacy capabilities, standalone replacements and direct integrations | Accepted | [0.2 review](reviews/0.2-standalone-replacements.md) |
| 0.3 | Access, enrollment, assessment, completion and class business rules | Accepted | [0.3 review](reviews/0.3-business-rules.md) |
| 0.4 | Data/media inventory and 500-student workload definition | Accepted | [0.4 review](reviews/0.4-data-media-capacity.md) |
| 0.5 | Consolidated backlog, risks and revised estimate | Accepted | [0.5 review](reviews/0.5-delivery-baseline.md) |

### Phase 1 — Design and architecture

| ID | Work | Status | Review record |
|---|---|---|---|
| 1.1 | Brand direction, accent palette, typography and light/dark token proposal | Accepted | [1.1 review](reviews/1.1-visual-direction.md) |
| 1.2 | Mobile navigation and representative public/student wireframes | Accepted | [1.2 review](reviews/1.2-navigation-wireframes.md) |
| 1.3 | Lesson player and quiz flow in mobile/desktop, light/dark | Accepted | [1.3 review](reviews/1.3-learning-assessment.md) |
| 1.4 | Instructor/admin layout and authoring interaction design | Accepted | [1.4 review](reviews/1.4-staff-authoring.md) |
| 1.5.1 | Gather real Word/LaTeX questions, source apps and required equation cases | Accepted | [1.5.1 review](reviews/1.5.1-question-corpus.md) |
| 1.5.2 | Isolated rich-text + visual formula prototype using candidate OSS packages | Accepted | [1.5.2 review](reviews/1.5.2-editor-prototype.md) |
| 1.5.3 | Word/other-source paste and round-trip experiment | Accepted | [1.5.3 review](reviews/1.5.3-paste-roundtrip.md) |
| 1.5.4 | Select editor/renderer approach and conversion scope | Accepted | [1.5.4 review](reviews/1.5.4-editor-selection.md) |
| 1.6 | Frontend/backend architecture, API conventions and deployment boundaries | Accepted | [1.6 review](reviews/1.6-architecture.md) |

### Phase 2 — Engineering foundations

| ID | Work | Status | Review record |
|---|---|---|---|
| 2.1.1 | React/TypeScript framework scaffold and folder structure | Accepted | [2.1.1 review](reviews/2.1.1-frontend-scaffold.md) |
| 2.1.2 | Common CSS, theme tokens and Light/Dark/System switching | Accepted | [2.1.2 review](reviews/2.1.2-theme-foundation.md) |
| 2.1.3 | Shared UI primitives and common interaction patterns | Accepted | [2.1.3 review](reviews/2.1.3-shared-ui.md) |
| 2.1.4 | Public/student/staff responsive layout shells | Accepted | [2.1.4 review](reviews/2.1.4-responsive-shells.md) |
| 2.1.5 | API-client contracts, shared utilities and form/error conventions | Accepted | [2.1.5 review](reviews/2.1.5-api-conventions.md) |
| 2.2.1 | .NET solution, Domain/Application/Infrastructure/API projects and references | Accepted | [2.2.1 review](reviews/2.2.1-backend-scaffold.md) |
| 2.2.2 | Service interfaces, dependency injection and environment configuration | Accepted | [2.2.2 review](reviews/2.2.2-services-configuration.md) |
| 2.2.3 | HTTP conventions, validation/error response shape, logging and health endpoints | Accepted | [2.2.3 review](reviews/2.2.3-http-foundation.md) |
| 2.3.1 | Connect frontend shell to backend health/sample contract | Accepted | [2.3.1 review](reviews/2.3.1-live-api-integration.md) |
| 2.3.2 | Build checks, dependency/license scanning and repeatable local/staging setup | Not started | — |
| 2.4.1 | Ask the owner for previous table structures/database details; inspect them together | Not started | — |
| 2.4.2 | Proposed target schema and source-to-target mapping | Not started | — |
| 2.4.3 | Approved first entity slice, EF Core/Npgsql mappings and development migration | Not started | — |
| 2.5.1 | R2 image adapter and isolated upload/retrieval demonstration | Not started | — |
| 2.5.2 | Email/job interfaces, local sandbox and durable-work design | Not started | — |
| 2.5.3 | Migration runner, legacy mapping and one sample import | Not started | — |

### Phase 3 — Accounts and permissions

| ID | Work | Status | Review record |
|---|---|---|---|
| 3.1 | Account schema extension and registration/login/logout | Not started | — |
| 3.2 | Password recovery, verification/session controls and staff security | Not started | — |
| 3.3 | Student/instructor/admin permissions and resource ownership | Not started | — |
| 3.4 | Profile, billing, timezone and appearance preferences | Not started | — |
| 3.5 | Legacy identities and password migration rehearsal | Not started | — |

### Phase 4 — Website, catalog and authoring

| ID | Work | Status | Review record |
|---|---|---|---|
| 4.1 | Public homepage using approved design system | Not started | — |
| 4.2 | About/contact/counselling/FAQ/testimonial content and editing | Not started | — |
| 4.3 | Blog listing/detail and staff publishing | Not started | — |
| 4.4 | Course/test-series catalog with categories/search/filter/pagination | Not started | — |
| 4.5 | Course metadata, pricing presentation, authors and R2 thumbnails | Not started | — |
| 4.6 | Curriculum section/lesson ordering and content authoring | Not started | — |
| 4.7 | Course detail, publishing/archive and metadata/redirect foundation | Not started | — |

### Phase 5 — Enrollment and learning

| ID | Work | Status | Review record |
|---|---|---|---|
| 5.1 | Free enrollment/manual grants and course-access enforcement | Not started | — |
| 5.2 | Student dashboard/enrolled-course list | Not started | — |
| 5.3 | Responsive lesson player and curriculum navigation | Not started | — |
| 5.4 | Progress, completion rules and resume position | Not started | — |
| 5.5 | Protected resources and confirmed prerequisites/drip rules | Not started | — |

### Phase 6 — Question authoring and assessments

| ID | Work | Status | Review record |
|---|---|---|---|
| 6.1.1 | Production rich-text/math content schema and teacher editor | Not started | — |
| 6.1.2 | Supported Word/LaTeX/web paste normalization | Not started | — |
| 6.1.3 | Required import/repair fallback identified during 1.5 | Not started | — |
| 6.1.4 | Student renderer, saved-content round trip and legacy sample import | Not started | — |
| 6.2.1 | Question bank, versions and required answer types | Not started | — |
| 6.2.2 | Quiz assembly, marks, timing, pass/retake/release settings | Not started | — |
| 6.3.1 | Attempt creation, question snapshot and server deadline | Not started | — |
| 6.3.2 | Answer saving, navigation and reconnect behavior | Not started | — |
| 6.3.3 | Submission/timeout and grading | Not started | — |
| 6.4 | Results, attempt history, staff review and grade correction | Not started | — |
| 6.5 | Historical attempt import and first exam-capacity test | Not started | — |

### Phase 7 — Razorpay and paid access

| ID | Work | Status | Review record |
|---|---|---|---|
| 7.1 | Purchase/order records, server prices and checkout UI | Not started | — |
| 7.2 | Razorpay test checkout and server verification | Not started | — |
| 7.3 | Durable webhook handling, enrollment and reconciliation | Not started | — |
| 7.4 | Order history, receipts, refunds and staff operations | Not started | — |
| 7.5 | Agreed coupons/manual payments/bundles and historical import | Not started | — |

### Phase 8 — Classes and calendar

| ID | Work | Status | Review record |
|---|---|---|---|
| 8.1 | Batch/session structure and staff scheduling | Not started | — |
| 8.2 | Student calendar/list views and eligibility | Not started | — |
| 8.3 | Agreed meeting-provider connection and join behavior | Not started | — |
| 8.4 | Required reminders, attendance and recordings | Not started | — |

### Phase 9 — Learning support and completion

| ID | Work | Status | Review record |
|---|---|---|---|
| 9.1 | Private notes and timestamped video notes | Not started | — |
| 9.2 | Wishlist and course reviews | Not started | — |
| 9.3 | Discussions/Q&A, announcements and notifications | Not started | — |
| 9.4 | Gradebook and course completion | Not started | — |
| 9.5 | Certificates and retained historical awards | Not started | — |

### Phase 10 — Administration and reporting

| ID | Work | Status | Review record |
|---|---|---|---|
| 10.1 | Student/support lookup, staff assignments and access changes | Not started | — |
| 10.2 | Enrollment/course/quiz reports | Not started | — |
| 10.3 | Sales/refund reporting and exports | Not started | — |
| 10.4 | Job/notification/payment failure views and operational guides | Not started | — |

### Phase 11 — Rehearsals, capacity and pilot

| ID | Work | Status | Review record |
|---|---|---|---|
| 11.1 | Full snapshot import and reconciliation | Not started | — |
| 11.2 | Repeat/delta import and cutover/rollback exercise | Not started | — |
| 11.3.1 | 500-user mixed workload | Not started | — |
| 11.3.2 | 500-attempt sustained exam and deadline burst | Not started | — |
| 11.3.3 | Headroom/recovery investigation and production sizing | Not started | — |
| 11.4 | Mobile/themes/accessibility and security regression journeys | Not started | — |
| 11.5 | SEO/redirect checks and owner/staff/student pilot | Not started | — |

### Phase 12 — Production launch

| ID | Work | Status | Review record |
|---|---|---|---|
| 12.1 | Launch checklist, backup evidence and window selection | Not started | — |
| 12.2 | Approved maintenance freeze, attempt drain and final import | Not started | — |
| 12.3 | Approved production switch and smoke verification | Not started | — |

### Phase 13 — Stabilization and retirement

| ID | Work | Status | Review record |
|---|---|---|---|
| 13.1 | Launch monitoring and prioritized defect resolution | Not started | — |
| 13.2 | Backup/restore, support handover and stability review | Not started | — |
| 13.3 | WordPress retirement decision and archival | Not started | — |
