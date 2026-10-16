# GD Tutor: subphase execution roadmap

[Documentation index](../README.md) · [Progress tracker](../delivery/PROGRESS.md)

**Version:** 1.0, 14 October 2026  
**Status:** Scope roadmap; execution state is maintained in the progress tracker. Isolated investigations do not authorize production foundations.  
**Related:** [Master plan](MIGRATION-PLAN.md) · [Design and technical requirements](../requirements/DESIGN-AND-TECHNICAL-REQUIREMENTS.md)

## 1. Execution agreement

Work on **one agreed leaf subphase at a time**. After completing it, provide a reviewable result and validation evidence, then stop for the owner to review. An instruction to start a parent item does not authorize automatically running all its children: identify the first child, execute it and stop at its review gate.

Items can be split further, for example `6.2.1 → 6.2.1.1`, if scope grows beyond a comfortable review. Define the new scope and completion criteria before starting it. Prefer one focused review session per leaf; estimate effort when selecting the item rather than promising that every item fits one day.

Status flow: **Not started → In progress → Ready for review → Accepted**, with **Changes requested** for feedback. An accepted item is complete; proceeding requires owner authorization for the next item. If the reply both accepts and says to continue, proceed with the next named item only.

Fixes from review stay inside the current item. Do not start unrelated next-item work while waiting. Changes to accepted work are tracked as a named follow-up item or explicitly included in the current agreed scope.

**Execution status:** See the [progress tracker](../delivery/PROGRESS.md) for the current item and each subphase's state. The initial screenshot audit and planning documents are inputs, not evidence of discovery acceptance. This roadmap defines scope; it does not itself authorize implementation.

## 2. Review packet for every leaf item

Provide:

1. Item ID and the agreed scope.
2. Changed files or document/configuration output.
3. What can be demonstrated, with local/staging location or screenshot where appropriate.
4. Verification performed and actual result; state anything not yet verified.
5. Mobile/light/dark coverage when UI changes are involved.
6. New dependencies, their purpose/license review, and any operating cost implications.
7. Known limitations, decisions needed and requested changes still open.
8. Next proposed item, without starting it automatically.

For foundational work, a working shell, build result, architecture boundaries or a configuration review is a valid deliverable. For business features, use a concrete user journey. For migration, use mappings and reconciliation evidence.

## 3. Phase 0 — Discovery, one review at a time

| ID | Scope | Review gate |
|---|---|---|
| 0.1 | Screenshot-based feature inventory and visitor/student/staff journeys | Owner confirms required capabilities and priorities |
| 0.2 | Legacy capabilities, standalone replacements and direct integrations | Replacement ownership recorded; legacy unknowns assigned; no WordPress runtime/package/API dependency |
| 0.3 | Access, enrollment, assessment, completion and class business rules | Examples agreed for free/paid access, grading, retakes and certificates |
| 0.4 | Data/media inventory and 500-student workload definition | Record sizes/volume, expected activity mix, exam duration, migration scope and capacity acceptance scenarios |
| 0.5 | Consolidated backlog, risks and revised estimate | Owner accepts discovery baseline and next design item |

The earlier screenshot audit is reused, not repeated unnecessarily. Detailed persistent table/entity design remains at 2.4.1. Sample export inspection here is feasibility work and does not authorize entity creation.

Owner clarification on 15 October 2026: 0.2 maps existing capabilities into an independent React/.NET platform. Legacy plugin/configuration information is relevant only to understanding source behavior or extracting data; no WordPress technology is selected for the replacement.

## 4. Phase 1 — Modern design and architecture

| ID | Scope | Review gate |
|---|---|---|
| 1.1 | Brand direction, accent palette, typography and light/dark token proposal | Owner reviews a visual style sample and selects the direction |
| 1.2 | Mobile navigation and representative public/student wireframes | Owner reviews home, catalog, dashboard and learning navigation |
| 1.3 | Lesson player and quiz flow in mobile/desktop, light/dark | Core actions, formula space, timer, saved states and responsive behavior reviewed |
| 1.4 | Instructor/admin layout and authoring interaction design | Staff can understand how to create/manage content and operate on mobile |
| 1.5.1 | Gather real Word/LaTeX questions, source apps and required equation cases | Owner accepts compatibility test corpus and expected paste/edit behavior |
| 1.5.2 | Isolated rich-text + visual formula prototype using candidate OSS packages | Create/edit formulas and demonstrate mobile/light/dark preview; record exact candidate licenses |
| 1.5.3 | Word/other-source paste and round-trip experiment | Compare originals with pasted/saved/reopened output; identify unsupported formats and document fallback needs |
| 1.5.4 | Select editor/renderer approach and conversion scope | Owner accepts supported workflows, known limitations, fallback plan and effort impact |
| 1.6 | Frontend/backend architecture, API conventions and deployment boundaries | Approve proposed Next.js choice, Clean Architecture boundaries and conceptual contracts; no database entities yet |

The prototype is a separately reviewed investigation, not production feature implementation or authority to scaffold the whole application. Paid conversion services are excluded unless separately presented and approved.

The accepted [1.5.4 selection](../design/QUESTION-AUTHORING-DECISION.md) maps editor/paste/conversion/renderer implementation to existing 6.1.1–6.1.4 and records remaining compatibility, exact-converter admission and effort gates. The [1.6 architecture](../architecture/APPLICATION-ARCHITECTURE.md) and [API conventions](../architecture/API-CONVENTIONS.md) were accepted in 1.6. Their acceptance does not authorize all foundation/feature leaves or change their IDs.

## 5. Phase 2 — Frontend foundation, then backend foundation

### 2.1 Frontend foundation

| ID | Scope | Review gate |
|---|---|---|
| 2.1.1 | React/TypeScript framework scaffold and folder structure | App builds; route/feature/shared boundaries and package register reviewed |
| 2.1.2 | Common CSS, theme tokens and Light/Dark/System switching | Minimal demo shows persistent theme choice, consistent initial render and approved colors |
| 2.1.3 | Shared UI primitives and common interaction patterns | Buttons/forms/cards/dialogs/drawers/loading/error states reviewed on small/large screens in both themes |
| 2.1.4 | Public/student/staff responsive layout shells | Navigation, content area, mobile controls and long-content behavior reviewed with placeholders |
| 2.1.5 | API-client contracts, shared utilities and form/error conventions | Demonstrate loading/cancel/error states using clearly labeled mocks; no invented business persistence |

### 2.2 Backend Clean Architecture foundation

| ID | Scope | Review gate |
|---|---|---|
| 2.2.1 | .NET solution, Domain/Application/Infrastructure/API projects and references | Solution builds and dependencies point in the intended direction; no persistent business entities yet |
| 2.2.2 | Service interfaces, dependency injection and environment configuration | Demonstrate configuration validation and replaceable adapter boundaries with simple stubs |
| 2.2.3 | HTTP conventions, validation/error response shape, logging and health endpoints | Inspect OpenAPI/health output and controlled failures; no secrets in logs |

### 2.3 Shared development and verification setup

| ID | Scope | Review gate |
|---|---|---|
| 2.3.1 | Connect frontend shell to backend health/sample contract | Demonstrate loading/success/error across the actual frontend/API boundary |
| 2.3.2 | Build checks, dependency/license scanning and repeatable local/staging setup | Clean build and setup instructions work; agreed checks execute; costs disclosed before paid infrastructure |

### 2.4 PostgreSQL and entity design — explicit owner-input gate

| ID | Scope | Review gate |
|---|---|---|
| **2.4.1** | **Ask the owner for previous table structures/database details; inspect them together** | **Wait for the supplied schema/relationships and target PostgreSQL details. Record unknowns and receive review before dependent design. Do not create entities, tables, EF mappings or migrations before this gate** |
| 2.4.2 | Proposed target schema and source-to-target mapping | Owner reviews entities, fields, keys, relationships, legacy identifiers and migration decisions |
| 2.4.3 | Approved first entity slice, EF Core/Npgsql mappings and development migration | Apply only to the agreed development database; inspect schema and integrity behavior |

This does not force copying WordPress's schema into PostgreSQL. The review determines what data and behavior to preserve, then agrees an appropriate normalized target. Additional module entities get their own reviewed schema changes before implementation. The first slice is intentionally small, not every business table at once.

### 2.5 Integration and migration foundations

| ID | Scope | Review gate |
|---|---|---|
| 2.5.1 | R2 image adapter and isolated upload/retrieval demonstration | Correct authorization, type/size checks and key handling; review public/private delivery and usage costs |
| 2.5.2 | Email/job interfaces, local sandbox and durable-work design | Demonstrate controlled execution/failure visibility without sending to real students |
| 2.5.3 | Migration runner, legacy mapping and one sample import | Validation-only and repeated runs work without duplicate records or outbound side effects |

## 6. Phase 3 — Accounts and permissions

| ID | Scope | Review gate |
|---|---|---|
| 3.1 | Account schema extension and registration/login/logout | Owner reviews schema change and working identity flow; roles cannot be self-escalated |
| 3.2 | Password recovery, verification/session controls and staff security | Recovery and session invalidation verified; staff MFA workflow reviewed |
| 3.3 | Student/instructor/admin permissions and resource ownership | Demonstrate allowed/denied API requests, including another student's records |
| 3.4 | Profile, billing, timezone and appearance preferences | Mobile forms and saved preferences work in both themes |
| 3.5 | Legacy identities and password migration rehearsal | Supplied test accounts follow the agreed compatibility/reset process without exposing passwords |

Split combined schema/flow items further if the proposed change is too large for one review.

## 7. Phase 4 — Website, catalog and authoring

| ID | Scope | Review gate |
|---|---|---|
| 4.1 | Public homepage using approved design system | Real responsive layout and content reviewed in both themes |
| 4.2 | About/contact/counselling/FAQ/testimonial content and editing | Staff can edit agreed content; enquiry validation and delivery workflow verified |
| 4.3 | Blog listing/detail and staff publishing | Draft/public behavior, URLs and mobile reading reviewed |
| 4.4 | Course/test-series catalog with categories/search/filter/pagination | Result accuracy and mobile filter usability verified |
| 4.5 | Course metadata, pricing presentation, authors and R2 thumbnails | Staff creates an editable course draft with correct image handling |
| 4.6 | Curriculum section/lesson ordering and content authoring | Staff builds and previews an ordered course; changes survive reload |
| 4.7 | Course detail, publishing/archive and metadata/redirect foundation | Published content discoverable; unauthorized drafts hidden; priority URL strategy reviewed |

## 8. Phase 5 — Enrollment and recorded learning

| ID | Scope | Review gate |
|---|---|---|
| 5.1 | Free enrollment/manual grants and course-access enforcement | Duplicate enrollment safe; blocked/expired users denied by the API |
| 5.2 | Student dashboard/enrolled-course list | Counts, navigation and course states derive from real data |
| 5.3 | Responsive lesson player and curriculum navigation | Agreed video/content sources work; player/mobile states reviewed |
| 5.4 | Progress, completion rules and resume position | Save/logout/device-change/resume workflow verified |
| 5.5 | Protected resources and confirmed prerequisites/drip rules | Access and release behavior matches examples; migrated sample progress reviewed |

## 9. Phase 6 — Dynamic authoring and assessments

| ID | Scope | Review gate |
|---|---|---|
| 6.1.1 | Production rich-text/math content schema and teacher editor | Create editable formulas in question/options/explanation with visual and LaTeX input |
| 6.1.2 | Supported Word/LaTeX/web paste normalization | Accepted compatibility corpus pastes correctly with explicit diagnostics |
| 6.1.3 | Required import/repair fallback identified during 1.5 | Unresolved formulas can be repaired; no silent loss; DOCX fallback only if selected in scope |
| 6.1.4 | Student renderer, saved-content round trip and legacy sample import | Formula accuracy, safe rendering and mobile/light/dark consistency verified |
| 6.2.1 | Question bank, versions and required answer types | Staff can create/edit supported types without altering historical versions |
| 6.2.2 | Quiz assembly, marks, timing, pass/retake/release settings | Owner reviews representative exam configurations and validation |
| 6.3.1 | Attempt creation, question snapshot and server deadline | Rules/ownership enforced; refresh/device clock cannot extend time |
| 6.3.2 | Answer saving, navigation and reconnect behavior | Acknowledged answers persist; unsaved answers visibly indicated; concurrency policy verified |
| 6.3.3 | Submission/timeout and grading | Reference scoring cases pass; repeat submission/timeout collision finalizes once |
| 6.4 | Results, attempt history, staff review and grade correction | Release policies work and corrections are auditable |
| 6.5 | Historical attempt import and first exam-capacity test | Data reconciles; baseline 500-student quiz test identifies any scaling changes before final acceptance |

Each content import must preserve formulas and original scoring meaning. Authoring a formula does not by itself authorize adding symbolic mathematical answer evaluation.

## 10. Phase 7 — Razorpay and paid access

| ID | Scope | Review gate |
|---|---|---|
| 7.1 | Purchase/order records, server prices and checkout UI | Tampered prices rejected; order snapshots and mobile checkout reviewed |
| 7.2 | Razorpay test checkout and server verification | Test success/failure verified; browser callback alone cannot grant access |
| 7.3 | Durable webhook handling, enrollment and reconciliation | Duplicate/late/out-of-order events and closed browser tested; access granted once |
| 7.4 | Order history, receipts, refunds and staff operations | Agreed financial/access effects demonstrated, including multiple valid grants |
| 7.5 | Agreed coupons/manual payments/bundles and historical import | Required commercial variations and financial reconciliation reviewed; unused options omitted by agreement |

Live charging is reserved for the reviewed launch process. Razorpay fees are recorded in the requirements document and rechecked before activation.

## 11. Phase 8 — Classes and calendar

| ID | Scope | Review gate |
|---|---|---|
| 8.1 | Batch/session structure and staff scheduling | Grade, batch and session concepts are separate; reschedule/cancel examples reviewed |
| 8.2 | Student calendar/list views and eligibility | Dates/timezones correct and unauthorized session details hidden |
| 8.3 | Agreed meeting-provider connection and join behavior | Eligible user joins correct session; provider cost and access boundaries documented |
| 8.4 | Required reminders, attendance and recordings | Delivery/retries, attendance source and protected recording access verified |

## 12. Phase 9 — Learning support and completion

| ID | Scope | Review gate |
|---|---|---|
| 9.1 | Private notes and timestamped video notes | Save/search/reopen and ownership verified |
| 9.2 | Wishlist and course reviews | Eligibility, persistence and moderation reviewed |
| 9.3 | Discussions/Q&A, announcements and notifications | Posting/reply/moderation permissions and notification preferences work |
| 9.4 | Gradebook and course completion | Agreed scoring/completion examples match source records |
| 9.5 | Certificates and retained historical awards | Eligibility, download/verification and revocation behavior reviewed |

## 13. Phase 10 — Cross-module administration

| ID | Scope | Review gate |
|---|---|---|
| 10.1 | Student/support lookup, staff assignments and access changes | Authorized staff can resolve realistic support cases with an audit trail |
| 10.2 | Enrollment/course/quiz reports | Sample totals and instructor visibility reconciled |
| 10.3 | Sales/refund reporting and exports | Written gross/net definitions match transactions; exports properly restricted |
| 10.4 | Job/notification/payment failure views and operational guides | Staff can identify/retry or escalate failures without direct database edits |

## 14. Phase 11 — Rehearsals, capacity and pilot

| ID | Scope | Review gate |
|---|---|---|
| 11.1 | Full snapshot import and reconciliation | Required records, active access, assets and historical outcomes accounted for |
| 11.2 | Repeat/delta import and cutover/rollback exercise | Edits/deletions/refunds handled; no duplicate effects; post-switch writes have a recovery plan |
| 11.3.1 | 500-user mixed workload | Agreed latency/error targets met on documented infrastructure |
| 11.3.2 | 500-attempt sustained exam and deadline burst | No lost acknowledged answers, duplicate finalization or deadline bypass |
| 11.3.3 | Headroom/recovery investigation and production sizing | Saturation/recovery behavior, cost estimate and production configuration reviewed |
| 11.4 | Mobile/themes/accessibility and security regression journeys | Priority journeys pass; dependency risks and authorization defects resolved |
| 11.5 | SEO/redirect checks and owner/staff/student pilot | User feedback resolved; evidence supports a release decision |

If a test fails, fix and rerun the affected item before acceptance. A failure does not authorize starting all later items in parallel.

## 15. Phase 12 — Launch, with separate checkpoints

| ID | Scope | Review gate |
|---|---|---|
| 12.1 | Launch checklist, backup evidence and window selection | Owner accepts runbook, freeze window, rollback triggers and responsibilities |
| 12.2 | Approved maintenance freeze, attempt drain and final import | Final data/payment reconciliation accepted before routing switch |
| 12.3 | Approved production switch and smoke verification | Login/access/purchase/quiz/video/redirect checks pass and monitoring is active |

These operational steps may occur close together within the agreed maintenance window, but the plan still requires their stated review checkpoints. Before selecting the window, agree who will review each checkpoint promptly and the contingency if that reviewer is unavailable. Do not leave students in indefinite maintenance awaiting an unspecified decision.

## 16. Phase 13 — Stabilization and retirement

| ID | Scope | Review gate |
|---|---|---|
| 13.1 | Launch monitoring and prioritized defect resolution | Critical access, assessment and payment issues resolved with evidence |
| 13.2 | Backup/restore, support handover and stability review | Recovery procedures and operational ownership confirmed |
| 13.3 | WordPress retirement decision and archival | Owner accepts retention/rollback needs are met before legacy services are retired |

## 17. Review record template

Use the [review template](../delivery/REVIEW-TEMPLATE.md) for each authorized item and save the completed record under [delivery/reviews](../delivery/reviews/README.md). Record status in the [progress tracker](../delivery/PROGRESS.md), with a link to that item's evidence. Keep this roadmap focused on scope and review gates.

Consult the [progress tracker](../delivery/PROGRESS.md) for the next item and the [delivery baseline](DELIVERY-BASELINE.md) for target windows/dependencies. Starting a leaf item never authorizes its whole parent phase. If the owner explicitly chooses to start scaffolding out of sequence, identify essential prerequisites and provisional assumptions, preserve the schema gate and label mock behavior clearly.
