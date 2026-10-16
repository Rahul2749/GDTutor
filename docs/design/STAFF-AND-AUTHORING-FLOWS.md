# Subphase 1.4 — Staff workspace and authoring interactions

[Documentation index](../README.md) · [Review record](../delivery/reviews/1.4-staff-authoring.md) · [Progress](../delivery/PROGRESS.md)

**Prepared:** 15 October 2026  
**State:** Accepted design baseline through the owner's "go ahead" on 16 October 2026.  
**Baseline:** Focus Workspace; accepted public/student navigation and learning/assessment designs; R-02–R-05 staff ownership/publication rules.

## Review scope

Four connected screens cover Course management, Course workspace, Question authoring and Review/approvals. Use the conversation's Screen, Role sample and Sample condition controls to compare staff responsibilities and failure states. Appearance supports Light/Dark/System. Reset sample restores synthetic data. Role switching is a design fixture outside the product, not a way for a real account to gain permissions.

The preview is a local simulation. Save, review request, publication, archive and activity entries affect only its synthetic in-memory state. Nothing is uploaded to R2, published, emailed, written to a database or sent to another person. Arbitrary course/question/review text stays in memory; host restoration retains only view preferences. There is no production draft recovery or account system yet.

The equation panel demonstrates three deliberately limited interactions. It is **not the package/editor experiment, a complete rich-text editor or a Word converter**. Those remain 1.5.1–1.5.4. No WordPress component/runtime/API, application package, paid tool or external service is introduced.

## Staff navigation and responsibilities

The desktop workspace has a compact sidebar. At 900px and below the same navigation becomes one Menu disclosure, with Escape closing it and returning focus. Primary entries are Courses, Question bank, Reviews & approvals, Learner attempts and Classes & batches. More tools contains Media/resources and Discussions; authorized administrators additionally see Learners/access, Orders/refunds and Site/permissions. Switch to learning keeps the staff and student contexts distinct.

Course and question actions stay in their assigned context. Account/session/MFA, exact delegated permission names and staff assignment management remain implementation decisions at 1.6/3.3 and the related feature reviews. Default instructor/admin responsibilities follow the accepted business baseline; no global power is inferred from being able to draft content.

| Capability | Instructor default | Administrator default | Prototype evidence / later enforcement |
|---|---|---|---|
| Course list | Assigned courses | Authorized wider course scope | Two versus three synthetic records; no production authorization established |
| Create/edit draft | Own/assigned authoring scope | Authorized content scope | New draft is unpublished; assignment policy must be enforced by the backend |
| Curriculum/lesson/question draft | Assigned course content | Authorized course content | Local draft controls; missing assignment state hides content |
| Quiz configuration | Prepare assigned quiz settings for review | Review/approve authorized settings | Existing attempts must retain snapshots |
| Price/access terms | Inspect; request authorized change | Edit commercial settings | Instructor fields disabled with an explanation; purchased terms remain a separate obligation |
| Publication | Submit for review | Publish reviewed version | Instructor has no Publish/Archive action; admin publication checks draft readiness and review acknowledgment |
| Return with changes/archive | No default power | Authorized reasoned action | Explicit action reason; archive has a second confirmation and retains history |
| Refund/access/role/regrade operations | No implied global permission | Separately authorized operations | Navigation boundary only; actual modules and audit controls are not built here |

UI visibility is not an authorization boundary. Production must check role, assignment, resource ownership, field/action permission and current version on every relevant API call, including URLs outside navigation. The external role fixture and local checks demonstrate the design only.

## Course management and authoring

| Screen/section | Information and action hierarchy | Important boundary |
|---|---|---|
| Course management | Assigned/all-authorized scope → title/status search → course status/current live version → Open draft/Create course | Search is local; server filtering/pagination and bulk operations remain future feature work |
| Basics | Title, description, category, level, learning outcomes, cover and alternative text | Cover is a labeled sample, not an uploaded image. Real uploads require direct R2 adapter/security checks |
| Curriculum | Ordered chapter items, Edit lesson, Move up/down, Add lesson, chapter quiz settings | Button reordering works on touch/keyboard without requiring drag-and-drop |
| Lesson details | Title, recorded/text type, YouTube reference or lesson text, Check lesson | A new or changed item stays a draft until checked. A source reference is not proof of video existence, visibility, playback or entitlement |
| Access & pricing | Free/paid, price, lifetime/duration/fixed end, labeled Asia/Kolkata date/time | Admin editing only; free access still requires authenticated enrollment. No actual Razorpay checkout |
| Student preview | Unpublished title/description, price, terms and ordered outline | Does not change the current public course or an existing purchase |
| Review & approvals | Live/draft distinction → readiness checks → reason/acknowledgment → authorized action → activity | Real versioning, publication atomicity and audit recording remain backend work |

A new course starts with incomplete required fields and no curriculum. Saving an incomplete draft is allowed; publishing is not. Adding a lesson creates a draft item. Its text/reference must be supplied and checked before the sample readiness list calls it ready. Editing/reordering keeps the selected item associated with its identity, rather than accidentally editing the item that moves into the same index.

The readiness list illustrates title/description, outcomes, cover/alternative text, checked curriculum, offer/validity, quiz settings, question readiness and current saved revision. These are **proposed design checks, not a complete publication validator or database schema**. Final required fields, content validation and all configuration cases must be settled/tested in 4.5–4.7 and 6.x. No persistent entity/table design is created; the owner-input gate at 2.4.1 remains mandatory.

The quiz section shows example duration, marks, wrong-answer deduction, pass percentage, start cap and common score/answer-release policy choices. Empty/malformed required values block the sample readiness check. Complete release schedules/conditions, attempt snapshot validation, minimum-score variants and quiz assembly are still required in 6.2.2; this small settings panel does not replace them. A 250-question fixture from 1.3 remains a navigation/capacity assumption, not a new upper bound.

## Drafts, saves and review handoff

| Trigger/state | Expected visible behavior | Demonstrated behavior / limit |
|---|---|---|
| Edit | Mark the current revision unsaved without replacing the live course | Local form state and unpublished preview; not persisted version isolation |
| Leave with edits | Save draft & continue, Discard edits, or Stay here | Applies to workspace navigation and the external role fixture. Discard explicitly restores the last local saved sample |
| Save invalid/incomplete draft | Retain author work and show readiness issues | Invalid drafts can be saved locally; they cannot pass publication checks |
| Offline/save failure | Keep edits visible; no false saved acknowledgment; retry | Save/approval blocked; a failed Save & continue stays on the current screen with its draft |
| Newer revision conflict | Pause editing; compare versions before explicit resolution | Compare versions reports the boundary and does not overwrite local changes. Production diff/merge is not implemented |
| Instructor review request | Require current saved draft, readiness, note and acknowledgment | Sets In review and adds a sample activity entry; no message or real review assignment is sent |
| Administrator publish | Require authorized action on a reviewed saved version | Advances the synthetic live-version label; no actual public course or immutable published record exists here |
| Return with changes | Reasoned review feedback | Adds sample Changes requested status/activity; no email/notification |
| Archive | Explain effect, require reason and explicit confirmation; retain history | Local archive/cancel state. No hard delete, refund, entitlement change or migration operation |

Sensitive production actions must record the authenticated operator, server time, affected resource/version, reason and relevant before/after state. Review requests and publishing must be protected against stale versions and duplicate operations. Published revisions, purchased terms and existing attempt/question snapshots must survive later draft edits. The activity list is a **visual sample**, not an audit implementation or evidence of those guarantees.

The prototype saves its course/question fixture as one local snapshot for convenience. This does not select aggregate boundaries, API contracts or persistence models. Production must define explicit save/validation/revision semantics during architecture and feature implementation, without bypassing the legacy-schema review gate.

## Question authoring and formula interaction

The question screen groups prompt → equation/diagram/paste actions → four single-choice options → correct choice → explanation → save, with a student-style draft preview and a separate staff answer check. On mobile the preview stacks after the authoring controls. The sample rejects blank prompt/options/explanation, duplicate option text, an invalid correct-choice key, unsupported equation source and unresolved paste issues for readiness. Saving an unfinished question draft is still possible.

| Interaction | Demonstrated concept | Not claimed |
|---|---|---|
| Plain question/options/explanation | Editable text and live safe text preview | Full rich text, cursor-positioned math nodes, lists/tables, undo/redo or production sanitization |
| Visual template | Fraction, power or square root, with letter/digit values | Full symbol palette, matrices/integrals/chemistry editing or symbolic algebra validation |
| LaTeX source | Small supported subset synchronized with visual values and native MathML preview | General LaTeX parser, macro support, legacy compatibility or package selection |
| Unsupported source | Keep original source text, show repair feedback and block application/readiness | Silent removal, replacement with incorrect math or successful conversion |
| Diagram | Visible entry for image selection/alternative text | Actual file upload, resize, malware/content checks or R2 access |
| Paste example | Preserve synthetic original text plus an unresolved native-equation marker; compare/recreate/explicitly resolve | Actual clipboard inspection, Word equation decoding, DOCX import or round-trip fidelity |

The formula subset accepts 1–12 letters/digits per value, using `\frac{a}{b}`, `{x}^{2}` and `\sqrt{x}`. It uses browser-native MathML and text nodes. Unsupported source remains available in the equation field; the preview does not execute it as HTML. Bounded formula overflow is local to the preview if needed. Human authors must still compare mathematical meaning, correct answers and explanations; a syntactically supported expression is not proof that the question is correct.

Opening Review paste example intentionally introduces a blocking unresolved issue. Keep unresolved for later retains it. Recreate equation opens the visual panel. Resolve after comparison requires explicit comparison acknowledgment and a supported sample expression; changing it back to unsupported source disables resolution again. This is the proposed **repair interaction**, not a semantic conversion test. Original example content remains available; no unsupported equation is silently discarded.

Production must support math in prompts, options and explanations, structured rich content, editable source, previews, safe rendering and verified paste/reopen behavior as already required. This concept has one equation slot; it does not satisfy that production feature by itself. Real question/source samples and platform/version details are the next separately authorized item, 1.5.1. Exact OSS editor/renderer versions, licenses, advisories, costs and compatibility must be reviewed in 1.5.2–1.5.4 before adoption.

## Navigation boundaries and future modules

Proposed route groups are `/staff/courses`, course draft/curriculum/access/preview sections, `/staff/questions` and assigned question editing, and staff review/approval queues. Paths/framework contracts remain proposals until 1.6. The prototype has no browser routing/deep-link/session behavior.

Learner attempts, assigned analytics, classes/batches, resources, moderation, learner support/access, payment/refund reconciliation, site content and role administration have navigation entries so the staff workspace is coherent. Their destination actions report a review notice; this item does not implement those modules. Actual operations remain in their original roadmap items and must preserve role/resource restrictions. Nothing is removed from the parity backlog because this design uses representative screens.

## Responsive and accessibility review

- Seven product widths: 320, 360, 390, 736, 768, 1024 and 1440 CSS pixels. Both role fixtures and Light/Dark appearance were checked; System switching was exercised at each width.
- Sidebar becomes one in-flow Menu at compact widths. Its native controls, expanded state, Escape handling and focus return are reviewable without an overlay focus trap or competing bottom navigation.
- Forms stack to one column on phones; headers put status below the title. Curriculum uses Edit and labeled Move up/down buttons. Reordering restores focus to a relevant control.
- Controls/checkbox labels have at least 44px height in checked layouts. Mobile editable fields use 16px text. Textual readiness, permission and save labels accompany color.
- Native focus indication and reduced-motion preferences are preserved. Full screen-reader, high-contrast, zoom, soft-keyboard/safe-area, navigation-close recovery and real-device coverage still belong to implementation reviews.
- Host state restores only validated screen/role-fixture/condition/theme/section preferences. Draft content, notes, audit text and dirty edits are not stored in host snapshots. Production durable save/recovery must be tested separately.

## Captures and verification

| Screen / role shown | Mobile 390px | Desktop 1024px |
|---|---|---|
| Courses / instructor | [Light](previews/staff/staff-courses-light-390.png) · [Dark](previews/staff/staff-courses-dark-390.png) | [Light](previews/staff/staff-courses-light-1024.png) · [Dark](previews/staff/staff-courses-dark-1024.png) |
| Course workspace / instructor | [Light](previews/staff/staff-builder-light-390.png) · [Dark](previews/staff/staff-builder-dark-390.png) | [Light](previews/staff/staff-builder-light-1024.png) · [Dark](previews/staff/staff-builder-dark-1024.png) |
| Question authoring / instructor | [Light](previews/staff/staff-question-light-390.png) · [Dark](previews/staff/staff-question-dark-390.png) | [Light](previews/staff/staff-question-light-1024.png) · [Dark](previews/staff/staff-question-dark-1024.png) |
| Review / administrator | [Light](previews/staff/staff-review-light-390.png) · [Dark](previews/staff/staff-review-dark-390.png) | [Light](previews/staff/staff-review-light-1024.png) · [Dark](previews/staff/staff-review-dark-1024.png) |

Additional mobile captures: [curriculum](previews/staff/staff-curriculum-instructor-dark-390.png), [administrator access settings](previews/staff/staff-access-admin-dark-390.png), [equation panel](previews/staff/staff-equation-light-390.png), [paste repair panel](previews/staff/staff-paste-dark-390.png).

The [browser report](STAFF-AUTHORING-CHECKS.json) records **929 passing layout observations**, seven-width role/interaction flows, **32 observed text/background pairs meeting 4.5:1**, zero runtime errors and the exact tested-source checksum. No detected page overflow outside the bounded formula preview, visible leaf text below 11px or checked product target height below 44px was observed. Captures and representative visual inspection cover mobile/desktop and both appearances. These checks are not full accessibility certification, backend authorization, durable-save, file-security, mathematical conversion or capacity evidence. External requests were blocked throughout QA.

Feature trace: CRS-01–05/J06 inform courses/curriculum/publication; QST-01–04/J07 inform question/quiz controls and future editor needs; OPS-01–03/J11 inform permission/operation boundaries; NFR-01/02 inform responsive/accessibility and future server security. R-02–R-05 and R-09/R-20/R-28 preserve ownership, commercial/attempt history and correction requirements.

## Review boundary

Review staff navigation, role separation, course authoring steps, mobile curriculum editing, question/equation/paste-repair interactions and publication checks. Changes stay in 1.4. After acceptance and progression authorization, **1.5.1** gathers real Word/LaTeX questions, source applications/versions and required equation cases. No editor/package experiment or database work starts through this handoff.
