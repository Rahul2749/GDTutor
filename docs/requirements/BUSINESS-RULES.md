# Subphase 0.3 — Business rules and acceptance examples

[Documentation index](../README.md) · [Progress tracker](../delivery/PROGRESS.md) · [Review record](../delivery/reviews/0.3-business-rules.md)

**Version:** 1.0, 15 October 2026  
**Purpose:** Define intended product behavior before implementing workflows.  
**Review state:** Accepted working baseline on 15 October 2026 following the owner's "go ahead" after the review handoff; explicitly conditional settings remain to be supplied.

## 1. Confirmed decisions and evidence boundaries

On 15 October 2026, the owner selected:

| ID | Confirmed rule | Consequence |
|---|---|---|
| C-01 | Course access is configurable: lifetime or time-limited | Do not hard-code lifetime access or a universal expiry |
| C-02 | Each quiz configures marks, negative marking, pass score, retakes and answer release | Do not hard-code one exam scoring formula or attempt limit |
| C-03 | Support live online classes and offline coaching batches | Model meeting sessions and physical-session details appropriately; recorded lessons remain a separate delivery mode |

Previously confirmed constraints continue to apply: independent React/.NET/PostgreSQL platform, direct Razorpay payments, R2 images, visual/LaTeX question authoring, mobile/light/dark experiences, approximately 500 concurrent students, and open-source-first packages. See the [decision register](../planning/DECISIONS.md) and [technical requirements](DESIGN-AND-TECHNICAL-REQUIREMENTS.md).

The screenshots show sample passing grades, attempt counts, course percentages and pricing. Those values are observations, not universal defaults. The exact legacy rules and data have not been independently verified. New policies must not silently change existing purchased entitlements or historical scores.

**Status legend for the remaining document:** C-01–C-03 were explicit owner answers. R-01–R-40 and the recommended Q-01–Q-06 policies were subsequently accepted as the working baseline through the owner's "go ahead" after the completed review handoff. Proposal/review wording in the original sections records how the baseline was presented; it is not a statement that review is still pending. Examples remain illustrative rather than universal values. Conditional scope (such as additional answer types, offline-payment usage, exact attendance needs, refund eligibility and provider choice) remains unresolved where the rule explicitly leaves it open.

## 2. Roles, content ownership and publishing

| ID | Proposed rule |
|---|---|
| R-01 | Visitors see published public content and designated previews. Students see their own account, enrollment, billing, notes and attempts plus content they are entitled to access |
| R-02 | Instructors author/manage assigned courses and review attempts for those courses. Drafting does not imply permission to publish, change commercial prices, issue refunds or change staff roles |
| R-03 | Administrators manage publication, course assignments, commercial settings, grants, refunds and staff roles. Narrower permissions can be delegated explicitly; no teacher receives global powers by default |
| R-04 | Course changes use draft/preview/publish validation. An enrolled course is archived or revised rather than hard-deleted with its learning and purchase history |
| R-05 | Sensitive changes record operator, time, reason and relevant before/after state. Grade corrections and manual access grants are visible in the relevant staff history |

**EX-01 — Instructor boundary:** A teacher assigned to Course A can edit its draft and inspect its permitted attempts. Requesting Course B by URL is denied. A refund request by that teacher is denied unless a refund permission was explicitly delegated.

**EX-02 — Publication:** A course with missing required curriculum/offer fields cannot be published. Editing the draft of an already published course does not expose unfinished content until the publication workflow applies it.

**Review choice Q-01:** Recommended starting policy is administrator-controlled publication, prices, refunds and grade corrections, with instructors authoring assigned content. Confirm or identify exceptions before 3.3/4.7/6.4/7.4 implementation.

## 3. Course access, enrollment and expiry

| ID | Proposed rule |
|---|---|
| R-06 | Keep public preview, free authenticated enrollment and paid enrollment distinct. A free price does not automatically make every lesson public |
| R-07 | A time-limited offer chooses either a fixed end date/time or a duration after its access grant activates. Lifetime offers have no automatic time expiry, subject to account/access enforcement |
| R-08 | For new paid purchases, duration starts when payment is server-verified and access becomes active. Manual grants have an explicit effective start; imported grants retain the mapped original validity |
| R-09 | Snapshot the purchased access terms and price. Later edits affect new purchases; changing existing access requires an explicit audited action. Display access terms before purchase |
| R-10 | Access is allowed during the half-open interval `start <= now < expiry`. If more than one valid grant covers the course, any one sufficient active grant can provide access. Duplicate callbacks do not duplicate a grant |
| R-11 | Expiry/revocation stops new protected learning actions but preserves learning/order history. Renewing access can resume existing progress; refunding one purchase must not remove an unrelated valid grant |
| R-12 | A quiz validly started before normal course expiry may finish by its existing deadline; normal expiry does not authorize new attempts or extend time. Account suspension/security revocation can terminate access immediately under an audited staff action |

**EX-03 — Duration:** Under a hypothetical 30-day offer, access activated at `2027-01-01 10:00 UTC` expires at `2027-01-31 10:00 UTC`. It works just before that timestamp and is expired exactly at it. A lifetime offer has no equivalent automatic timestamp.

**EX-04 — Existing purchase terms:** A student buys a 180-day offer. Staff later changes the advertised offer to 90 days. The student's original 180-day entitlement remains unless an explicit authorized adjustment is made.

**EX-05 — Multiple grants:** A paid grant is refunded, but the student also has a still-valid manual grant. The student retains the access provided by the manual grant; the refunded order remains in history.

**EX-06 — Expiry during a quiz:** A permitted attempt begins at 11:55, course access expires at 12:00, and its quiz deadline is 12:25. Under R-12, answers can be saved until 12:25 for that attempt, while starting another attempt or opening a different protected lesson after 12:00 is denied.

**Review choice Q-02:** Confirm time-limited variants, activation point, purchase-term snapshots and the active-attempt expiry exception. C-01 already confirms configurable access; Q-02 selects the details. Define final day/time display clearly in the site's Asia/Kolkata default timezone.

## 4. Checkout, orders, refunds and offline payments

| ID | Proposed rule |
|---|---|
| R-13 | The backend calculates price/discount/currency and records purchase-time totals and terms. A browser-supplied amount cannot override the offer. Regular/sale prices are distinct fields with explicit validity where scheduled |
| R-14 | New paid access requires server-verified successful payment state. Pending/failed/cancelled checkout does not create paid access; late success is reconciled even if the student closes the browser |
| R-15 | Payment processing and access activation are retryable and deduplicated. Staff can investigate a verified successful payment with delayed access; the learner sees pending processing rather than an instruction to pay again |
| R-16 | Refund requests require an authorized staff decision. A confirmed full refund removes the grant funded by that order line under the agreed policy; a failed/pending refund does not masquerade as completed. Partial refunds require an explicit line/access decision |
| R-17 | Offline/manual enrollment records the learner, course, validity, operator, reason and any payment reference. It must not fabricate a successful Razorpay transaction. No automatic renewal or recurring charge is enabled without separate agreed scope |

**EX-07 — Closed browser:** A student pays, closes checkout, and later returns. A verified payment event or reconciliation activates the original order exactly once. Repeated events create neither a second charge nor extra access time.

**EX-08 — Tampered amount:** Checkout submits a smaller amount than the backend's quoted order amount. The request is rejected or corrected through a fresh valid quote; access is not granted from the client claim.

**EX-09 — Refund state:** A refund request is submitted but provider completion is pending. Staff and the student see its actual state. When a full refund completes, its funded grant is removed once, while any independent valid grant survives.

**EX-10 — Offline payment:** Staff records a coaching-center cash/bank payment and grants the appropriate course/batch access with an audit reference. It appears as an offline source, not as a Razorpay capture.

**Review choice Q-03:** Confirm whether offline payment recording is needed and how full/partial refunds affect access. Refund eligibility, refund windows, fees and commercial/legal wording are owner policies; this draft sets no automatic eligibility promise. Existing recurring-payment dependencies must be identified before migration decisions.

## 5. Quiz configuration, timing and scoring

| ID | Proposed rule |
|---|---|
| R-18 | Each published quiz has a validated configuration for question marks, wrong-answer penalties, pass threshold, duration, attempt cap/cooldown and result/answer-release policy. Zero negative marking is supported. Missing required settings block publication |
| R-19 | Start with visibly used single-choice questions. Add other answer types only after their need and exact scoring semantics are agreed. For multiple-answer or numeric types, define partial credit, tolerance, units and rounding before implementation |
| R-20 | Starting an attempt atomically checks eligibility/limits and snapshots questions, option order, correct scoring context, rules and deadline. Editing the quiz later affects new attempts, not the original attempt snapshot |
| R-21 | At most one active attempt per learner/quiz. Reopening from another device resumes that attempt. Conflicting writes are detected; an old tab cannot silently overwrite a newer acknowledged answer |
| R-22 | Time runs on the server and continues during disconnect/refresh. Save acknowledgments distinguish persisted from pending answers. Default proposal is no client-clock-based grace; an authorized time accommodation is recorded server-side |
| R-23 | Deadline and manual submission finalize the attempt once using acknowledged answers. Answers arriving after the deadline are not silently backdated. An unsubmitted expired attempt is finalized by API/job enforcement and remains in history |
| R-24 | Blank answers score zero. Wrong-answer penalties apply only as configured. Preserve the calculated score, including a negative total when the formula produces one; apply a minimum floor only if explicitly configured for that quiz. Compare the unrounded score to the pass threshold and round percentages only for display |
| R-25 | The attempt cap counts starts, including abandonment/time expiry. Resuming an active attempt does not consume another slot. Staff can void a technical-failure attempt with a reason; the original record remains auditable |
| R-26 | Preserve every attempt. Proposed course-grade default is highest finalized non-voided score, with per-quiz alternatives latest/first where needed. Passing does not erase failed history; retakes remain subject to the configured policy |
| R-27 | A result-release policy separately controls score availability and answer/explanation availability. Proposed assessment default is immediate score with answers held until a configured release point; practice quizzes may release answers immediately |
| R-28 | Corrections do not overwrite original submissions. Record revised scores and reasons; any cohort-wide regrade requires preview, authorization and traceable affected attempts. Re-evaluate completion/certificate consequences explicitly |

C-02 confirms configurability, not particular numerical settings. The pass threshold and ten-attempt values visible in screenshots are not universal defaults. The recommended publishing form requires staff to review the actual settings instead of inheriting hidden example numbers.

**EX-11 — Negative marking:** An illustrative five-question quiz has `+4` for correct, `-1` for wrong and `0` for blank. Three correct, one wrong and one blank gives `11/20 = 55%`. At a hypothetical 50% pass threshold it passes. With no penalty configured, the same answers earn `12/20 = 60%`.

**EX-12 — Below-zero raw score:** Under R-24, an illustrative total of `-3/20` remains `-3/20` unless that quiz explicitly configures a zero minimum. With a zero minimum, final marks are `0/20` and the raw calculation remains explained. The UI and grader must use the same published rule.

**EX-13 — Threshold precision:** At an 80% threshold, a raw `79.999%` fails even if a two-decimal display rounds to `80.00%`. The UI must explain the actual threshold comparison; display formatting must not change the outcome.

**EX-14 — Retakes:** With a three-start cap, refreshing Attempt 1 resumes it. Timing it out uses one slot. Starting Attempts 2 and 3 uses the rest; a fourth start is denied unless the policy changes or a technical attempt is voided by authorized staff.

**EX-15 — Snapshot:** A student starts under a 45-minute rule. Staff changes the quiz to 30 minutes. The existing attempt retains its 45-minute snapshot; future attempts use the new published rule.

**EX-16 — Deadline collision:** An illustrative attempt has a deadline at 10:45:00 UTC. A finalization job and a manual submit arrive together. One finalized result is persisted, including answers acknowledged before the cutoff. An answer first received after 10:45:00 is not counted merely because the browser timestamp is earlier.

**EX-17 — Result release:** A mock exam configured for immediate scores and answers released tomorrow shows today's score/status without sending answer keys in the student API response. Tomorrow's authorized review reveals the permitted explanations.

**Review choice Q-04:** Confirm required answer types, optional minimum-score rules, attempt counting/technical voids, grade aggregation and answer-release defaults. Keep time/retake/mark values configurable as already confirmed. If the legacy exam rules differ, provide examples to map deliberately rather than recomputing old results from new rules.

## 6. Learning progress, completion and certificates

| ID | Proposed rule |
|---|---|
| R-29 | Courses identify required versus optional items. Track lesson completion separately from quiz passing; a failed required quiz does not satisfy a pass requirement merely because it was submitted |
| R-30 | Proposed lesson rule: text lessons allow explicit Mark Complete; recorded lessons can use self-marked completion initially unless verified watch tracking is required. Video playback position is not proof of attention or attendance |
| R-31 | Course completion requires all configured required items and any explicit grade/attendance requirements. Compute progress from those rules; elapsed time alone does not certify completion |
| R-32 | Certificate eligibility is evaluated server-side after completion. Generate an award only when enabled and eligible; retain identifier and issue history. Existing valid awards remain traceable across migration |
| R-33 | Curriculum changes do not silently revoke an earned completion/award. Decide whether added requirements apply to in-progress learners; explicit correction/revocation is audited and communicated |

**EX-18 — Failed required assessment:** A learner completes nine lessons but fails the required quiz. Their lesson progress remains saved, while the course and certificate remain incomplete under a pass-required rule.

**EX-19 — Optional item:** A course has eight required lessons, one required quiz and one optional practice test. Completing required items under their configured rules can complete the course without passing the optional test.

**EX-20 — Changed curriculum:** A learner already earned a certificate. Staff adds a new lesson. The award remains valid under R-33; it is not revoked just because the live curriculum count changed.

**Review choice Q-05:** Confirm self-marked versus watch-based lesson completion, whether required quizzes must be passed, and whether attendance/aggregate grades are required for particular courses. The screenshot's 100%-completion certificate lock is evidence of an interface, not proof of every underlying rule.

## 7. Live online classes and offline batches

| ID | Proposed rule |
|---|---|
| R-34 | Separate course content, coaching-batch membership and scheduled sessions. Each session is online or offline. A batch can contain the approved session mix; do not assume purchase automatically enrolls a student into every batch |
| R-35 | An online session contains authorized join details; an offline session contains venue/room and relevant instructions. Student calendar/list shows only appropriate enrolled-course/batch information, displayed in the user's timezone |
| R-36 | Eligibility requires the configured course entitlement and/or batch membership. Staff explicitly defines that relation; initial proposal requires both for a paid batch tied to a paid course. Batch capacity, joining cutoff and waitlisting are enabled only if required |
| R-37 | Reschedule/cancellation retains history and updates the calendar. Reminders are delivered according to agreed preferences; duplicate event processing does not send repeated notifications |
| R-38 | Attendance is recorded by an agreed provider signal or authorized staff, with manual correction history. Clicking Join is not attendance. Protected recordings, where available, follow the configured course/session access policy |

**EX-21 — Offline batch:** A student assigned to the Saturday coaching batch sees the venue and room, not an irrelevant Join Video Call button. An unrelated batch member cannot retrieve that batch's protected details through the API.

**EX-22 — Online session:** A student has Course A access but is not assigned to the session's paid batch. Under R-36's proposed rule, they cannot retrieve the private join link. Authorized staff can assign membership explicitly.

**EX-23 — Reschedule:** A class moves from Saturday to Sunday. The session identity/history remains, the old schedule is visibly replaced, and the revised notification is sent once per intended recipient through the agreed mechanism.

**Review choice Q-06:** Confirm batch/course eligibility, whether capacities and attendance matter, who records offline attendance, and whether recordings should stay accessible after course expiry. C-03 already confirms both delivery types; a specific online meeting provider is not selected.

## 8. Migration and reporting invariants

The existing migration/technical plans already require traceability, server authorization and source-data reconciliation. The following operational definitions are proposals to make that behavior reviewable.

| ID | Proposed rule |
|---|---|
| R-39 | Import known historical scores and entitlement periods as source facts; do not apply new policy defaults to rewrite them. Missing detail is labeled as unavailable, not invented. No import triggers charging, bulk receipts or learner notifications |
| R-40 | Report unique students separately from enrollments; distinguish successful payments, completed refunds and pending events. Label gross collected, refunded and net collected totals; separately identify provider fees/taxes if reporting them |

**EX-24 — Enrollment count:** One learner enrolled in three courses contributes one unique learner and three enrollments. A historical order import does not count as a new cash collection today or charge the student again.

Accounting/tax treatment and formal revenue recognition are not defined here. The operational report labels above must be reconciled with actual transaction records and the owner's required reporting definitions before 10.3.

## 9. Decisions for this review

The three initial questions were answered as C-01–C-03, followed by acceptance of the recommended baseline below on 15 October 2026. Use Q/R IDs to request later changes. Values and conditional branches left explicitly unspecified are not invented by that acceptance.

| Bundle | Review focus | Recommended starting proposal | Decision state |
|---|---|---|---|
| Q-01 | Staff powers and publishing | Assigned-course instructors draft; administrators control publishing, commercial changes and sensitive corrections | Accepted baseline |
| Q-02 | Access-term details | Lifetime or fixed/date-duration variants; activate paid duration on verified access; preserve purchased terms; let valid active quizzes finish normal expiry | Accepted baseline; individual offer values configurable |
| Q-03 | Payment/refund/manual operations | Verified payment activates access; staff handles refunds; preserve independent grants; offline sources explicit if used | Accepted baseline; refund eligibility/partial-access exceptions unspecified |
| Q-04 | Assessment details | Explicit per-quiz settings; one active attempt; attempts count starts; highest score by default; no implicit score floor; controlled answer release | Accepted baseline; required extra answer types and quiz settings to be supplied |
| Q-05 | Completion/certificates | Required items + configured quiz pass rules; explicit lesson completion initially; preserve earned awards on later curriculum additions | Accepted baseline; course-specific requirements configurable |
| Q-06 | Classes/batches | Separate online/offline sessions, assigned-batch eligibility, authorized attendance and reviewed recording access | Accepted baseline; exact attendance/recording scope/provider unresolved |

R-39/R-40 are part of the accepted operational baseline; raise any source-specific migration/reporting exceptions before implementing affected work. Existing confirmed technical requirements remain in force.

No rule here creates a database table or chooses a package. At **2.4.1**, ask for the previous database/table structure and target PostgreSQL information before persistent entities, mappings or migrations. Implementation must trace its tests back to the accepted rule/example IDs.

The owner accepted 0.3 and authorized 0.4 on 15 October 2026. Consult the progress tracker for current work. Later source findings can lead to explicit revisions; they must not silently rewrite historical access or scores.
