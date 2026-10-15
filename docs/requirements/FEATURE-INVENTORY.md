# Subphase 0.1 — Feature inventory and user journeys

[Documentation index](../README.md) · [Progress tracker](../delivery/PROGRESS.md) · [0.1 review record](../delivery/reviews/0.1-feature-inventory.md)

**Prepared:** 15 October 2026  
**Version:** 1.0 — proposed scope for owner review  
**Purpose:** Agree what GD Tutor must support and who uses it before deeper discovery and implementation.

This inventory reuses the [65-screenshot evidence index](../reference/SCREENSHOT-INDEX.md) and the owner's requirements. It describes intended product capabilities. It does not verify the old application end to end, select packages, finalize grading rules, or approve database entities.

## 1. Review summary

The proposed product has four experiences: public discovery, student learning, instructor authoring, and administrator operations. A person can hold more than one role. The staff screenshots do not prove how instructor and global-administrator access differ today; the permissions below are a proposed target for review.

The core launch journeys are: discover a course, register/sign in, enroll free or pay, study/resume, take/review assessments, attend agreed classes, and allow staff to publish and operate all of this. Migration must preserve existing access and relevant history.

For this review, confirm the feature list and priorities. Detailed plugin identification belongs to **0.2**, business rules to **0.3**, data/capacity measurements to **0.4**, and the consolidated launch backlog/estimate to **0.5**. Existing database/table structures must be requested before persistent entity design at **2.4.1**.

## 2. Evidence and priority labels

**Basis:**

- **Owner:** explicitly requested by the owner; does not require reconfirming the requirement.
- **Visible:** interface/content appears in screenshots, with no claim of complete operational verification.
- **Empty/menu:** a screen, tab, lock or menu is visible but usage/data is not established.
- **Proposed:** recommended behavior needed for the target workflows; not established as old behavior.

**Proposed priority:**

- **L0 — launch essential:** required for a confirmed requirement, complete core journey, or safe preservation of existing access/history.
- **L1 — parity pending detail:** retained in the launch candidate scope. Confirm actual use and required depth; do not defer or retire it without an owner decision.
- **L2 — enhancement:** excluded from the launch candidate by default unless the owner requests it or discovery proves an existing dependency.

Priority is not execution order. An L0 item can be implemented later in the roadmap, and an L1 item remains planned until its disposition is agreed. Every priority here is a proposal; confirmed owner requirements remain mandatory regardless of the labels.

### Screenshot evidence groups

These shorthand references point to selected originals. The evidence index supplies the full collection and further examples.

| Ref | Evidence | What it establishes |
|---|---|---|
| E01 | [Home](<../../Project Files/HomePage_1.png>), [category tabs](<../../Project Files/HomePage_2.png>), [navigation dropdown](<../../Project Files/Screenshot 2026-10-14 194643.png>) | Brand, public navigation and grade/exam categories |
| E02 | [Course cards](<../../Project Files/HomePage_3.png>), [test series](<../../Project Files/Screenshot 2026-10-14 194654.png>), [course detail](<../../Project Files/Common/Screenshot 2026-10-14 195723.png>) | Free/paid presentation, course information and enrollment actions |
| E03 | [Login](<../../Project Files/login.png>), [billing](<../../Project Files/Student Panel/Screenshot 2026-10-14 195050.png>), [preferences](<../../Project Files/Student Panel/Screenshot 2026-10-14 195059.png>) | Account entry/recovery link and student settings |
| E04 | [Student dashboard](<../../Project Files/Student Panel/Screenshot 2026-10-14 194825.png>), [continue learning](<../../Project Files/Student Panel/Screenshot 2026-10-14 194833.png>), [my courses](<../../Project Files/Student Panel/Screenshot 2026-10-14 195112.png>) | Enrollment states, progress and resume actions |
| E05 | [Course builder](<../../Project Files/Admin Panel/Screenshot 2026-10-14 194313.png>), [settings tabs](<../../Project Files/Admin Panel/Screenshot 2026-10-14 194323.png>), [paid settings](<../../Project Files/Admin Panel/Screenshot 2026-10-14 194335.png>) | Staff editing, publication, pricing and configurable course fields |
| E06 | [Curriculum](<../../Project Files/Common/Screenshot 2026-10-14 195742.png>), [lesson player](<../../Project Files/Common/Screenshot 2026-10-14 195842.png>) | Ordered recorded lessons, locks, video and note-taking entry |
| E07 | [Quiz overview](<../../Project Files/Student Panel/Screenshot 2026-10-14 194900.png>), [runner](<../../Project Files/Student Panel/Screenshot 2026-10-14 194926.png>), [chemistry](<../../Project Files/Student Panel/Screenshot 2026-10-14 194936.png>), [mathematics](<../../Project Files/Student Panel/Screenshot 2026-10-14 195237.png>) | Timed questions, choice options, navigation and scientific notation |
| E08 | [Attempt history](<../../Project Files/Student Panel/Screenshot 2026-10-14 195006.png>), [summary anomaly](<../../Project Files/Student Panel/Screenshot 2026-10-14 195255.png>), [timeout](<../../Project Files/Student Panel/Screenshot 2026-10-14 195319.png>) | Retakes/history, score summary and timeout dialog; elapsed-time anomaly needs investigation |
| E09 | [Resources](<../../Project Files/Student Panel/Screenshot 2026-10-14 195352.png>), [live classes](<../../Project Files/Student Panel/Screenshot 2026-10-14 195423.png>), [gradebook](<../../Project Files/Student Panel/Screenshot 2026-10-14 195431.png>), [certificate](<../../Project Files/Student Panel/Screenshot 2026-10-14 195438.png>) | Empty support screens and completion-locked certificate |
| E10 | [Staff dashboard](<../../Project Files/Admin Panel/Screenshot 2026-10-14 194225.png>), [course metrics](<../../Project Files/Admin Panel/Screenshot 2026-10-14 194238.png>), [staff attempts](<../../Project Files/Admin Panel/Screenshot 2026-10-14 194404.png>) | Staff earnings/enrollment/assessment reporting interfaces |
| E11 | [Testimonials](<../../Project Files/HomePage_7.png>), [blogs](<../../Project Files/HomePage_8.png>), [FAQ](<../../Project Files/HomePage_9.png>), [counselling](<../../Project Files/HomePage_6.png>), [about](<../../Project Files/Screenshot 2026-10-14 194707.png>) | Public content and contact/demo calls to action |
| E12 | [Notes](<../../Project Files/Student Panel/Screenshot 2026-10-14 195122.png>), [student Q&A](<../../Project Files/Student Panel/Screenshot 2026-10-14 195132.png>), [staff announcements](<../../Project Files/Admin Panel/Screenshot 2026-10-14 194352.png>), [reviews](<../../Project Files/Student Panel/Screenshot 2026-10-14 195414.png>) | Notes, discussions, announcement management and review entry; views are empty |

## 3. Feature checklist

### Public website and discovery

| ID | Capability and intended boundary | Basis | Priority | Delivery reference |
|---|---|---|---|---|
| PUB-01 | Modern homepage, branding, navigation and footer; attractive entry to learning | Visible E01 + Owner | L0 | 1.1–1.3; 4.1 |
| PUB-02 | Course/test-series catalog with Classes 8–12 and entrance-exam categories; search/filter/pagination | Visible E01/E02; search/filter depth proposed | L0 | 4.4 |
| PUB-03 | Course detail with curriculum preview, authors, pricing and correct enrollment action | Visible E02/E06 | L0 | 4.5–4.7 |
| PUB-04 | About, FAQ, testimonials and contact/counselling enquiry; staff-editable content | Visible E11; editing/enquiry handling proposed | L1 | 4.2 |
| PUB-05 | Blog list/detail and staff draft/publish workflow | Visible E11; publishing flow proposed | L1 | 4.3 |
| PUB-06 | Share/wishlist entry and logged-in navigation to learning/cart | Visible E02/E04; cart flow not demonstrated | L1 | 4.5; 7.1; 9.2 |

### Accounts and permissions

| ID | Capability and intended boundary | Basis | Priority | Delivery reference |
|---|---|---|---|---|
| ACC-01 | Register, sign in/out and recover account access; session/security controls | Visible links E03 + Proposed complete flow | L0 | 3.1–3.2 |
| ACC-02 | Student profile, avatar, contact/billing information and timezone | Visible E03 and account screens in index | L0 | 3.4 |
| ACC-03 | Student/instructor/admin authorization and ownership checks | Proposed; staff/student views visible E04/E10 | L0 | 3.3; 10.1 |
| ACC-04 | Appearance/accessibility preferences; autoplay and motion preferences to agreed depth | Visible E03 + Owner themes | L0 for themes/accessibility; other preferences L1 | 2.1.2–2.1.4; 3.4 |

Social-account navigation is visible elsewhere in settings, but social sign-in is not established; treat that capability as L2 until confirmed.

### Course creation and enrollment

| ID | Capability and intended boundary | Basis | Priority | Delivery reference |
|---|---|---|---|---|
| CRS-01 | Staff creates/edits course title, description, thumbnail, author, level, categories and tags | Visible E05 | L0 | 4.5 |
| CRS-02 | Ordered subject/section curriculum containing recorded/text lessons and quizzes | Visible E06/E07; curriculum editing proposed | L0 | 4.6; 6.2.2 |
| CRS-03 | Draft, preview, publish/archive and controlled public visibility | Visible draft/publish E05 + Proposed complete lifecycle | L0 | 4.7 |
| CRS-04 | Course/lesson resources and introduction media | Visible E05/E09; resources empty | L1 | 4.5–4.6; 5.5 |
| CRS-05 | Scheduled publication, content drip, prerequisites and enrollment controls | Visible settings E05; detailed rules unknown | L1 | 4.7; 5.5 |
| ENR-01 | Authenticated free enrollment and correct access to free learning content | Visible E02; enforcement proposed | L0 | 5.1 |
| ENR-02 | Paid offers, regular/sale prices, Razorpay checkout and server-verified access | Visible E02/E05 + Owner Razorpay | L0 | 7.1–7.3 |
| ENR-03 | Manual/offline grants, expiry/revocation and multiple grant sources | Proposed preservation/operations need; verify old usage | L0 for existing entitlements; optional variations L1 | 5.1; 7.5; 10.1 |
| ENR-04 | Order/payment history, receipts, failed/pending payments, reconciliation and refunds | Proposed complete paid workflow | L0 | 7.3–7.4 |
| ENR-05 | Cart, coupons, bundles or other purchase variations only to agreed depth | Cart menu visible; other variations proposed | L1 for cart; other variations conditional | 7.1; 7.5 |

One-time payment options are visible, but access duration and possible recurring plans remain unresolved. Confirm any existing subscription dependency in 0.2/0.3 before deciding it can be omitted.

### Learning and assessments

| ID | Capability and intended boundary | Basis | Priority | Delivery reference |
|---|---|---|---|---|
| LRN-01 | Student dashboard, enrolled/active/completed courses and continue-learning links | Visible E04 | L0 | 5.2 |
| LRN-02 | Responsive recorded/text lesson player and curriculum navigation | Visible E06 + Owner mobile design | L0 | 5.3 |
| LRN-03 | Persistent lesson progress, completion and resume position | Visible progress E04; persistence behavior proposed | L0 | 5.4 |
| QST-01 | Rich-text question/options/explanation editor with visual formula tools and editable LaTeX | Owner; notation visible E07 | L0 | 1.5.1–1.5.4; 6.1.1 |
| QST-02 | Validated Word/LaTeX/other-source paste, preview, repair and save/reopen fidelity | Owner; new workflow | L0 | 1.5.1–1.5.4; 6.1.2–6.1.4 |
| QST-03 | Question bank with versioning and required answer types; single-choice visibly used | Visible E07; bank/types beyond single-choice proposed | L0 for observed/required types | 6.2.1 |
| QST-04 | Quiz assembly and configurable marks, duration, passing threshold, retakes and release policy | Visible E07/E08; configuration flow proposed | L0 | 6.2.2 |
| ASM-01 | Quiz overview/instructions and attempt eligibility before starting | Visible E07 | L0 | 6.3.1 |
| ASM-02 | Question runner with formula/image display, choice selection, back/next/skip and progress | Visible E07 | L0 | 6.3.2 |
| ASM-03 | Server timing, acknowledged answer saves, reconnect handling and duplicate-safe submission/timeout | Timeout visible E08; reliability behavior proposed | L0 | 6.3.1–6.3.3 |
| ASM-04 | Correct grading and results according to agreed exam rules; no early answer-key disclosure | Visible E08; precise rules unresolved | L0 | 6.3.3; 6.4 |
| ASM-05 | Student attempt history/retakes and authorized staff inspection/corrections | Visible E08/E10; correction audit proposed | L0 | 6.4–6.5 |

Visual formula authoring is mandatory. Automatic symbolic equivalence grading, handwriting recognition and equation OCR are separate enhancements unless the business-rule audit establishes a requirement. The historical time anomaly in E08 is an issue to investigate, not behavior to reproduce.

### Classes, support tools and completion

| ID | Capability and intended boundary | Basis | Priority | Delivery reference |
|---|---|---|---|---|
| CLS-01 | Staff schedules agreed classes; student calendar/list and eligibility-controlled join | Owner classes + Empty E09; scheduling/join flow proposed | L0 for agreed class model | 8.1–8.3 |
| CLS-02 | Batches, reminders, attendance and recording follow-up | Proposed; required depth unknown | L1 | 8.1; 8.4 |
| SUP-01 | Private notes and timestamped video notes with search/course filtering | Empty/menu E06/E12 | L1 | 9.1 |
| SUP-02 | Wishlist and enrolled-student course reviews/moderation | Visible/empty E04/E12; eligibility proposed | L1 | 9.2 |
| SUP-03 | Course discussions/Q&A and staff replies/moderation | Empty/menu E12 | L1 | 9.3 |
| SUP-04 | Course announcements and relevant notifications | Empty/menu E09/E12 | L1 | 9.3 |
| CMP-01 | Course completion and gradebook aggregation to agreed rules | Visible progress E04; Empty E09 gradebook | L0 for completion; gradebook depth L1 | 5.4; 9.4 |
| CMP-02 | Completion-eligible certificates and retained historical awards | Locked E09; issuance flow not demonstrated | L1; existing award retention L0 | 9.5 |

"Class" may mean a school grade, a recorded course, a coaching batch, an online meeting or an offline session. Grade categories and recorded lessons are clearly visible; the delivery model for scheduled classes must be confirmed in 0.3. External live meeting integration is conditional on that decision.

### Staff operations, migration and cross-cutting requirements

| ID | Capability and intended boundary | Basis | Priority | Delivery reference |
|---|---|---|---|---|
| OPS-01 | Staff learner lookup, course assignments, access adjustments and audit trail | Proposed complete operations workflow | L0 | 10.1 |
| OPS-02 | Course/enrollment/quiz metrics and sales/refund reports with consistent definitions | Visible E10; financial definitions proposed | L0 for operational totals; advanced analytics L1 | 10.2–10.3 |
| OPS-03 | Staff image/content management, failure visibility and operational guides | Proposed replacement of WordPress operations | L0 | 2.5.1; 4.2–4.7; 10.4 |
| MIG-01 | User/content/media migration with traceable legacy references and reviewed mappings | Owner whole-app migration + Proposed safeguards | L0 | 2.5.3; 3.5; 4.7; 11.1–11.2 |
| MIG-02 | Existing paid/free/manual access, payment and refund history preservation | Owner migration + Proposed preservation rules | L0 | 5.5; 7.5; 11.1–11.2 |
| MIG-03 | Relevant progress, quiz attempts and existing awards preserved; limitations visible | Visible E04/E08/E09 + Owner migration | L0 | 5.5; 6.5; 9.5; 11.1 |
| MIG-04 | Public content URLs, redirects, metadata and launch checks | Proposed continuity requirement | L0 | 4.7; 11.5; 12.1–12.3 |
| NFR-01 | Modern coherent design, light/dark/system appearance, accessibility and responsive mobile workflows | Owner | L0 | 1.1–1.4; 2.1.2–2.1.4; 11.4 |
| NFR-02 | Protected student/staff data, safe rich content/uploads and server-side authorization | Proposed essential security requirements | L0 | 3.3; 6.1; 11.4 |
| NFR-03 | Approximately 500 active students, including sustained exams and submission bursts | Owner | L0 | 0.4; 6.5; 11.3.1–11.3.3 |
| NFR-04 | Reviewed open-source dependencies, disclosed service costs and maintainable foundations | Owner | L0 | 1.5; 2.1–2.3; relevant feature reviews |
| NFR-05 | Reliable deployments, backups, restore, monitoring and recoverable migration | Proposed essential operations requirements | L0 | 2.3.2; 10.4; 11.2; 12–13 |

These references identify existing roadmap ownership. They do not start those later items or finalize their implementation.

### L2 enhancement boundary

Keep native apps, custom conferencing, advanced proctoring, AI tutoring/question generation, symbolic answer grading, OCR, instructor marketplaces/payouts, multi-institution tenancy and advanced recommendation/gamification systems outside the proposed launch baseline. Social login, parent accounts, subscriptions and WhatsApp/SMS automation require a separate decision; move any of them into required scope if discovery shows an existing dependency or the owner requests it.

## 4. Proposed actor responsibilities

These are target responsibilities for review, not a final permission specification or a description of existing WordPress roles.

| Actor | Primary responsibilities | Access boundary |
|---|---|---|
| Visitor | Browse public pages/catalog and previews; initiate registration or an enquiry | No private lessons, attempts, billing records or staff operations |
| Student | Manage own profile; enroll/pay; learn; attempt quizzes; use entitled classes and support tools | Own records and authorized course content only |
| Instructor/content author | Draft/manage assigned course content, author questions, inspect allowed attempts and respond to course questions | Assigned courses; publication and correction powers require policy in 0.3 |
| Administrator | Manage roles/assignments, publication, learners, access, payments/refunds and site operations | Sensitive actions explicitly authorized and audited |

Finance/support/content editing can later become narrower permissions; separate staff roles are not yet mandated. A staff member enrolled as a student should retain a clear learner view. Neither client-side navigation nor knowing a record URL grants permission.

## 5. End-to-end user journeys

Each journey includes intended behavior and exceptions to review. Its failure handling is a proposed target unless explicitly visible in evidence.

### J01 — Visitor finds a suitable course

**Features:** PUB-01–PUB-03, NFR-01. **Roadmap:** 4.1, 4.4, 4.7.

Visitor opens the site → chooses grade/exam or searches → compares course/test-series cards → opens a detail page → reviews curriculum, price, instructor and access action.

Review empty search results, unavailable/archived courses, missing images and returning from detail to preserved filters. Draft course URLs must not expose unpublished content. Mobile users need usable filtering and readable long titles.

### J02 — Student registers and enrolls in a free course

**Features:** ACC-01, ENR-01, LRN-01. **Roadmap:** 3.1–3.2, 5.1–5.2.

Visitor selects Enroll Free → authenticates through the agreed flow → returns to the chosen course → enrollment is recorded once → course appears under My Courses → student starts learning.

Review existing account recovery, interrupted authentication, already-enrolled state and unavailable course. Public previews and authenticated free enrollment must be distinguished. Do not assume that guest checkout or guest learning is required.

### J03 — Student buys paid access

**Features:** ENR-02–ENR-04, ACC-02. **Roadmap:** 7.1–7.4.

Student chooses paid course → reviews price/billing details → starts Razorpay checkout → backend verifies successful payment state → access is granted → order/receipt and course access become visible.

Review cancellation, failure, pending verification, closed browser after payment, duplicate callback and price change. Paid access must be recoverable through reconciliation when browser confirmation is lost. Refunded access follows the agreed policy; another valid grant may still give access.

### J04 — Student studies and resumes later

**Features:** LRN-01–LRN-03, CRS-04. **Roadmap:** 5.2–5.5.

Student opens Continue Learning → navigates the curriculum → studies a lesson/video and permitted resources → progress/resume state is saved → returns on a later session/device → continues from the stored point.

Review slow media, disconnected progress saves, expired access and unavailable resources. A dashboard percentage must follow agreed completion rules rather than the learner's browser claiming completion. Acknowledged progress must not disappear on sign-out.

### J05 — Student takes a timed quiz

**Features:** QST-03–QST-04, ASM-01–ASM-05. **Roadmap:** 6.2–6.5.

Eligible student reviews instructions and attempt limits → starts an attempt → answers formula/image questions with navigation and save feedback → submits or reaches the deadline → sees the permitted result → views attempt history and retries if eligible.

Review refresh, clock changes, multiple tabs, connection loss, exhausted retakes and simultaneous timeout/submission. Keep already acknowledged answers and finalize once. Correct answers/explanations appear only under the agreed release policy. Distinguish failed score, expired attempt and unsaved answers.

### J06 — Instructor creates and publishes learning content

**Features:** CRS-01–CRS-05, ACC-03. **Roadmap:** 4.5–4.7.

Assigned staff creates a draft → enters metadata and R2 thumbnail → orders sections/lessons → sets permitted pricing/visibility → previews → publishes directly or obtains publication approval according to policy.

Review incomplete required fields, unsupported uploads, conflicting edits and unassigned-course access. Pricing edits must not rewrite earlier orders. Adding/removing required curriculum items must have an agreed effect on existing progress and certificates.

### J07 — Teacher creates a question with equations

**Features:** QST-01–QST-04, NFR-02. **Roadmap:** 1.5.1–1.5.4, 6.1.1–6.2.2.

Teacher creates a question → types or pastes mixed text/math → inserts or edits a formula visually or in LaTeX → adds options/explanation → repairs any paste warnings → previews student view → saves/reopens editable content → places the question in a quiz.

Review Word-native equations, plain LaTeX, chemistry, matrices, diagrams, unsupported macros and malformed clipboard HTML. Unsupported content must be visible to the teacher before publication; no silent conversion loss. Changing a question later must not alter the historical question served to an earlier attempt.

### J08 — Staff schedules a class and a student attends

**Features:** CLS-01–CLS-02. **Roadmap:** 8.1–8.4.

Staff schedules the agreed type of session → associates course/batch and eligible students → session appears in the student's calendar/list → eligible student views session details and joins/attends → recording or attendance is available if required.

Review rescheduling, cancellation, timezones, expired enrollment and private join information. Clicking Join is not proof of attendance. Online/offline delivery and provider choices remain decisions for 0.3 and later integration review.

### J09 — Student asks for help and saves learning material

**Features:** SUP-01–SUP-04. **Roadmap:** 9.1–9.3.

Student writes a private note or posts an allowed course question → staff replies to the course discussion → student sees relevant announcements/notifications → student can find notes again and manage wishlist/review actions where enabled.

Review private-note ownership, moderated/removed content, inaccessible courses and notification preferences. Private notes and public-to-course discussion are distinct scopes. These capabilities remain launch candidates even though the screenshots show empty lists.

### J10 — Student completes a course and receives an award

**Features:** CMP-01–CMP-02, MIG-03. **Roadmap:** 5.4, 9.4–9.5.

Student meets required learning/assessment rules → server records completion → gradebook reflects agreed aggregation → certificate becomes available when eligible → student downloads/views the retained award.

Review partial completion, failed required assessments, changed curricula, already-issued legacy awards and permitted correction/revocation. Do not equate a visible Complete Course button with a decision to allow unrestricted self-certification.

### J11 — Administrator resolves an access or assessment problem

**Features:** OPS-01–OPS-03, ENR-03–ENR-04, ASM-05. **Roadmap:** 6.4, 7.4, 10.1–10.4.

Authorized staff locates a learner → reviews relevant enrollment, payment or attempt history → reconciles a missing payment/access event or applies an allowed correction → confirms the student outcome → records operator/reason and audit evidence.

Review insufficient staff permissions, duplicate grants/refunds, disputed marks and conflicts with preserved legacy records. Define gross/net/enrollment metrics before relying on staff charts. Normal support operations should be possible without editing the database directly.

## 6. Proposed launch boundaries

The first complete staging learning milestone is a staff-published free course with enrolled learning and resume. Add a reliable quiz workflow and then the Razorpay paid-access workflow through their individual review items. These are staging milestones; they do not by themselves satisfy full migration launch scope.

Production launch requires L0 capabilities, all confirmed active parity features, migrated access/history, and the agreed quality/capacity gates. The L1 candidates require explicit dispositions during discovery: retain for launch, retain history with limited UI, defer, or retire. No L1 capability is currently approved for omission.

The proposed L2 boundary avoids adding a new product line while replacing existing workflows. If a capability proves necessary for current students, revise this inventory and the roadmap through owner review before implementation.

## 7. Open questions and later ownership

| ID | Detail still needed | Why it matters | Resolve in |
|---|---|---|---|
| OQ-01 | Which L1 tools are used today, and which may be deferred/retired? | Establish launch parity without silently removing empty-screen features | Scope feedback in 0.1; usage validation 0.2; final baseline 0.5 |
| OQ-02 | Are scheduled classes online, offline, batch-based, or mixed? | Determines calendar, meeting, attendance and reminder depth | 0.3; provider inventory 0.2 |
| OQ-03 | Who can publish courses, edit prices, issue refunds or correct grades? | Sets instructor/admin responsibilities | 0.3; permission implementation 3.3 |
| OQ-04 | Current plugins/custom code and old payment/video/meeting services | Reveals hidden dependencies and extraction options | 0.2 |
| OQ-05 | Access duration, manual enrollments, commercial variations and refund effects | Avoids changing what existing purchases entitle students to use | 0.3 |
| OQ-06 | Required question types, negative/partial marks, retakes and result visibility | Determines assessment behavior and historical interpretation | 0.3 |
| OQ-07 | Formula source applications, representative Word questions and unsupported formats | Defines testable paste compatibility rather than a universal assumption | 1.5.1–1.5.4 |
| OQ-08 | Completeness of historical progress/answers/certificates and public URL inventory | Determines import, preservation and exception reports | 0.4; detailed mapping after 2.4.1 |
| OQ-09 | Activity mix, longest exams, media usage and budget for 500 active students | Turns capacity requirement into representative load tests and hosting cost | 0.4; measured validation 11.3 |
| OQ-10 | Prior tables/relationships and target PostgreSQL details | Required before persistent entities/mappings/migrations | Ask explicitly at 2.4.1 |

Unknown details are recorded, not guessed. This item can be reviewed without supplying production credentials, database schemas or full plugin inventories now.

## 8. Owner review checklist

- [ ] The feature list covers the expected visitor, student, instructor and administrator experiences.
- [ ] The proposed L0 core and L1 launch candidates are appropriate; any additions/deferrals are named explicitly.
- [ ] J01–J11 describe the intended journeys and identify the right exceptions.
- [ ] Proposed instructor/admin responsibilities are a suitable starting point for detailed permissions.
- [ ] OQ-01–OQ-10 capture the remaining decisions at the correct later steps.

Useful feedback can be brief: identify a feature ID to add/change/defer, or a journey ID whose behavior should differ. Accepting 0.1 approves this scope baseline; it does not select the proposed palette/editor packages or finalize unknown grading/access rules.

After review, the next proposed item is **0.2 — WordPress plugins, custom code and integrations**. It remains unstarted until authorized.
