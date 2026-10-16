# Subphase 1.3 — Lesson player and assessment flow

[Documentation index](../README.md) · [Review record](../delivery/reviews/1.3-learning-assessment.md) · [Progress](../delivery/PROGRESS.md)

**Prepared:** 15 October 2026  
**Visual/navigation baseline:** Accepted Focus Workspace and [1.2 navigation](NAVIGATION-AND-WIREFRAMES.md).  
**State:** Accepted design baseline through the owner's "go next" after the 1.3 handoff on 15 October 2026; no production learning or assessment services have been implemented.

## Review scope and demonstration

The conversation sample connects Lesson player → Quiz instructions → Runner → Submission review → Result/answer review → Retake instructions. The Screen picker opens representative stages. Sample condition explores failure/access/release states; Question fixture switches between 250 repeated synthetic questions and a five-question scoring example. Reset sample clears local learning/attempt state. These review controls are not student settings or permission controls.

The sample uses **a fixed illustrative clock and local save/grade simulations**. It does not play a YouTube video, contact a server, durably save an answer, validate enrollment, enforce a real deadline or establish concurrency. Opening the runner/result through review controls can create a synthetic attempt/result for inspection; production users do not receive those controls. All prompts, settings, dates, progress and scores are examples, not imported exam records.

The 250-item fixture repeats five question templates to test navigation and layout. It is not an exam-ready question bank, an upper product limit, or evidence of 500-user backend capacity. The five-question fixture preserves the same illustrative rules to make arithmetic easy to review. Production marks, penalties, thresholds, retakes, duration and release settings remain configurable per quiz under the accepted business baseline.

## Lesson player and learning context

| Region/action | Proposed behavior | Prototype and implementation boundary |
|---|---|---|
| Context | Course, chapter, lesson title, Back to my learning | Uses the accepted learning navigation; overview return is a local boundary notice |
| Curriculum | Current lesson, next lesson, quiz entry, locked future chapter | Desktop side panel; compact screens use a collapsed native disclosure before the lesson. No hidden prerequisite enforcement is claimed |
| Recorded lesson | YouTube player area, meaningful loading/failure feedback, accessible transcript/resources | Clearly labeled placeholder. Play/Pause sample changes local presentation only; actual YouTube integration/visibility/captions/resume checks remain in 5.3 |
| Transcript/resources | Keep permitted text/resources discoverable if video fails | Native disclosure and worksheet entry. No protected media/download is fetched |
| Completion | Explicit Mark lesson complete; do not equate playback with attendance or quiz passing | Local lesson completion remains when switching between the two sample lessons. Progress is labeled as lesson progress; a required quiz can still prevent overall completion |
| Offline/media failure | Explain unconfirmed completion/notes or video failure; retry | Offline completion is not counted as confirmed. A video error does not automatically mark a lesson complete |
| Expired access | Retain history, explain expiry and offer access review | Protected player/content controls are hidden or disabled in the illustrated state. Production API checks and previously loaded content behavior need feature-level validation |
| Private notes | Clearly labeled lesson note, save status and ownership | Sample text stays in memory and is excluded from host-state snapshots. No upload or persistent note store; production belongs to 9.1 |

The example starts at 12/42 completed lessons (29% rounded). Completing one sample lesson shows 13/42 (31%); completing both shows 14/42 (33%). These figures do not certify course completion, attendance, watch time or certificate eligibility. Required/optional lesson and quiz rules remain R-29–R-33. YouTube delivery/access details remain unresolved where recorded in D-018; this preview does not settle them.

## Instructions, eligibility and attempt start

Before starting, show duration, question count, marks for correct/wrong/blank answers, pass threshold, attempt usage, score/answer-release rules and the consequences of submission/deadline. The example is 180 minutes, +4/−1/0, 50% passing, three starts, highest finalized non-voided score, immediate score after grading and held answers. These are explicitly examples, not application defaults.

| State | Learner action |
|---|---|
| Eligible, no active attempt | Read rules, acknowledge them and Start attempt; acknowledgment is required in the sample |
| Existing active attempt | Resume attempt with its original deadline; do not consume another start or require a new acknowledgment |
| Attempt limit reached | Explain used starts; block a new start and keep support/history reachable |
| Cooldown | Show the configured next-start date/time in a labeled timezone; block early starts |
| Course expired | Block a new attempt while retaining history |

The actual backend must atomically check account/course eligibility, attempt limits and active-attempt uniqueness, then snapshot question/option order, marking/release rules and the authoritative deadline (R-18–R-21). Changing published settings later must not rewrite an existing attempt. The sample does not implement atomicity, authentication or an attempt API. Start/resume controls illustrate the contract; they are not security enforcement.

## Runner and question navigation

- Keep a compact exam status bar with a tabular time display, answer-save status and Review & submit action. Essential exam actions do not depend on hover, animation or color alone.
- Show one single-choice question, clear mark rules, native labeled radio choices, Clear answer and Mark/remove review. Back/Next preserve local choices and review marks. Keyboard radio-arrow interaction retains focus after a choice.
- Question navigation displays **25 numbers per page**, with Previous/Next page and a validated Go to question field. Question 250 remains directly reachable. It does not create 250 full question cards or an unbounded mobile number strip.
- Navigator status codes supplement labels: A answered, B visited blank, N new, R marked for review, P pending save. An answered local draft may show A·P; it must not be described as server-saved. Accessible number labels describe these states in words.
- A review flag is independent from the selected answer. Clearing an acknowledged answer while disconnected is itself an unsent change until acknowledged; it must not silently remove the saved choice in a final result.
- Only saved/acknowledged answers feed the sample's final grade. Submission review reports answered, unanswered, review-marked and pending counts; unanswered is allowed, pending changes block manual confirmation until reconciled.

### Formula space

The isolated sample uses native MathML for logic, fractions, an integral, a matrix and chemical subscripts. Question 3 includes a deliberately wide expression within a **bounded horizontal equation region**, with a native Read equation as text disclosure and spoken label. The page itself must fit the viewport; the equation retains readable size instead of shrinking the entire question. Formula styles are theme-aware.

This establishes a layout proposal only. It does not select a production renderer/editor, validate all browsers/assistive technologies, import LaTeX, sanitize untrusted content or solve Word paste. Those decisions remain at 1.5.1–1.5.4 using real owner samples. No editor/math library has been adopted in this item; the H₂O question is an explicitly cross-subject rendering example.

## Saves, conflicts, deadlines and submission

| State | Learner-facing behavior | Required production contract / sample limit |
|---|---|---|
| Acknowledged | All changes saved only after acknowledgment | Real acknowledgment must follow durable persistence; local sample acknowledgment is not evidence of durability |
| Save pending | Show pending rather than saved; preserve selected choice | No blind success message or automatic advance that drops an unsent edit |
| Offline | Keep local draft, show pending count, retry; deadline continues | Actual supported local recovery/expiry storage must be designed, secured and tested during implementation |
| Another-tab conflict | Pause editing and compare the newer saved revision before replacement | Sample Review newer version reports this boundary without overwriting the draft; production diff/resolution must use revision checks |
| Final minute | Visible textual warning; existing deadline unchanged | No flashing/focus stealing or answer leakage |
| Normal course expiry during a valid attempt | Allow that attempt to finish by its existing deadline | R-12 exception; no new attempt or unrelated protected lesson access is granted |
| Suspension/security revocation | Stop new edits/submission and direct to support | Needs an authoritative backend transition, audit and interruption policy |
| Manual submit | In-flow confirmation with counts, pending status, Keep reviewing and Confirm submission | Requires an idempotent finalized submission or explicit persisted-submission state; sample does not model network requests |
| Deadline while connected | Stop editing at zero; check submission status using saved answers | Server/API/job finalizes independently of an open browser. Check status must not start another attempt |
| Deadline while offline | Stop editing, retain uncertainty/pending warning, reconnect then check status | Reconnect does not backdate or flush late unsent answers into the expired attempt |

The local deadline path deliberately requires **Check submission status** rather than claiming completion from the browser alone. In the offline example, an earlier saved correct choice and a later unsent wrong choice produce the result from the saved choice. Reconnection preserves the pending warning until status is checked; no post-deadline save is fabricated. Real server timing, race handling, deadline jobs, retries and duplicate-safe finalization remain 6.3.1–6.3.3 and the 11.3 workload tests.

Production must derive the displayed clock from the authoritative attempt deadline and re-synchronize on resume/reconnect; client clock changes, reloads or theme switches must not add time. A configured accommodation is a backend policy, not a browser timer adjustment. The static sample clock is **not** a timing algorithm or proof of any of these guarantees.

Leaving/resuming an active sample retains its attempt number and current choices. For production navigation/close warnings, offer a meaningful warning when edits are unsent while keeping keyboard/back navigation usable; never rely on a warning to keep a deadline running. The prototype's review pickers/reset can bypass simulated states, so it is unsuitable as a permission or anti-cheating implementation.

## Results, answer release and history

| State | Display and next steps |
|---|---|
| Received, grading pending | Confirm the distinct received/submission state; no fabricated final score or new attempt while grading |
| Score released, answers held | Marks/percentage/pass status and aggregate counts; no question keys/explanations in the rendered review region |
| Score and answers held | Hide marks, percentage, pass status, keys and explanations until the policy permits them |
| Answers released | Submitted answer, correct answer and explanation; previous/next review across the attempt |
| Attempt voided | Clearly label excluded status/reason and preserved history; do not silently delete the attempt |
| Retake available | Return to current instructions; a new start uses another slot and preserves earlier history |
| Cooldown/limit reached | Explain the restriction/date, disable new start and retain learning/history |

The five-question worked flow checks three correct, one wrong and one blank: `3 × 4 − 1 = 11/20 = 55%`. A wrong-only submission can show `−1/20 = −5%`, without an invented zero floor. Blank answers score zero. Compare exact marks to the threshold; display rounding must not change passing. The sample tests simple integer settings, not the full future decimal/rounding/regrade engine.

Result release is simulated by the external review condition. Withholding the rendered answer-review region is **not a security boundary**: synthetic templates/keys exist in the local preview code. Production must omit unreleased keys/explanations from student API responses, enforce release/ownership on the server and prevent preloading/caching leaks. This item demonstrates visible states, not answer-key security. Corrections, authorized regrades, all historical types and certificate consequences remain 6.4/6.5 and their accepted policies.

## Responsive and accessibility details

- Review widths: 320, 360, 390, 736, 768, 1024 and 1440 CSS pixels in both themes. Curriculum collapses on compact layouts; runner content stacks before the question navigator on phones. No full-page horizontal scrolling is intended.
- Product controls/choice labels have at least 44px height in checked layouts. Navigator buttons retain textual state codes; radio/checkbox targets are their wrapping labels. Mobile text-entry/select controls use 16px where editable.
- Native disclosures and controls preserve tab order and focus indication. The current question describes its choice group; formula alternatives and non-color status labels remain available. Full screen-reader/high-contrast/zoom/device testing is still required.
- The exam status bar uses a sticky layout within the product document. The conversation iframe grows with its content; its outer-page scrolling does not establish real-device sticky behavior. Production must test short/landscape viewports, browser chrome, focus, device keyboard and safe areas so timer/actions remain reachable without covering questions.
- Reduced motion disables transitions/animations. The timer sample is static and does not repeatedly announce seconds. Production announcements should prioritize material save/warning/submission transitions over constant screen-reader interruptions.
- Host state can restore validated attempt drafts, saved choices, flags and lesson/history state for review. The full 250-item fixture snapshot is checked against the host's 16KiB budget. It is not the design for storing production exam answers or private notes.

## Captures and evidence

| Screen | Mobile 390px | Desktop 1024px |
|---|---|---|
| Lesson | [Light](previews/learning/learn-lesson-light-390.png) · [Dark](previews/learning/learn-lesson-dark-390.png) | [Light](previews/learning/learn-lesson-light-1024.png) · [Dark](previews/learning/learn-lesson-dark-1024.png) |
| Instructions | [Light](previews/learning/learn-overview-light-390.png) · [Dark](previews/learning/learn-overview-dark-390.png) | [Light](previews/learning/learn-overview-light-1024.png) · [Dark](previews/learning/learn-overview-dark-1024.png) |
| Runner | [Light](previews/learning/learn-runner-light-390.png) · [Dark](previews/learning/learn-runner-dark-390.png) | [Light](previews/learning/learn-runner-light-1024.png) · [Dark](previews/learning/learn-runner-dark-1024.png) |
| Result | [Light](previews/learning/learn-result-light-390.png) · [Dark](previews/learning/learn-result-dark-390.png) | [Light](previews/learning/learn-result-light-1024.png) · [Dark](previews/learning/learn-result-dark-1024.png) |

Also review the [wide-equation mobile capture](previews/learning/learn-runner-wide-390.png). The [browser report](LEARNING-ASSESSMENT-CHECKS.json) records **364 passing layout observations**, seven-width interactions, **32 text/background pairs meeting 4.5:1**, zero runtime errors, worked scoring/recovery assertions and the exact preview-source checksum. A fully populated 250-item host-review snapshot was 9,505 bytes. External requests were blocked during QA. No video delivery, real persistence, backend timing/authorization or 500-student load was tested.

Feature trace: LRN-02/03, CRS-02/04/05 and J04 inform lesson/curriculum; ASM-01–05 and J05 inform assessment; ENR-03/R-12 inform access expiry; QST-01/02 inform formula-space needs while actual editor/paste work remains 1.5. Later implementation items and source-data gaps remain open; this design does not close them.

## Owner review boundary

Review lesson/curriculum hierarchy, question navigation, save/pending warnings, submission confirmation and result-release wording. Changes stay in 1.3. After acceptance and progression authorization, **1.4** covers instructor/admin layout and authoring interaction design. Formula corpus/editor/paste exploration follows at 1.5; application foundations and owner-gated schema work remain later.
