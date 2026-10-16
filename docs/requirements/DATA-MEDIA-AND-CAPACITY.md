# Subphase 0.4 — Data/media inventory and capacity definition

[Documentation index](../README.md) · [Progress tracker](../delivery/PROGRESS.md) · [Review record](../delivery/reviews/0.4-data-media-capacity.md)

**Audited:** 15 October 2026  
**Scope:** Supplied local screenshots and WXR export; no live application/database/media downloads.  
**State:** Accepted audit/workload planning baseline on 15 October 2026; missing migration datasets explicitly unresolved.

## 1. Owner input and evidence

During this item, the owner provided `Project Files/gdtutor.WordPress.2026-10-14.xml`, confirmed **YouTube** hosts recorded videos, and specified exams up to **three hours with 200+ questions**. The required concurrency remains **500 active students**.

The XML is an offline migration input, not a WordPress runtime dependency. It is excluded from Git because it contains production profiles/content. The checked-in reports contain aggregate measurements, field names, source checksums and no profile values or full media URLs.

| Artifact | Measured contents | Verification reference |
|---|---|---|
| Screenshot collection | 65 PNGs, 16,684,524 bytes; dimensions and SHA-256 recorded per file | [Local screenshot manifest](../reference/LOCAL-ASSET-INVENTORY.json) |
| Supplied content export | WXR 1.2, 43,302,495 bytes, 16,039 items with 16,039 distinct item IDs | [Aggregate export audit](../reference/EXPORT-INVENTORY.json) |
| Source export SHA-256 | `60d0cec9e0ce6c649d00edeb8c60caf616424f3a1a2c19ad47763c1659b23ef1` | Recheck against the local source before later extraction |

The earlier 0.2 screenshot-only evidence boundary is superseded for source-content coverage by this audit. Installed versions, custom application code and full database structures still have not been inspected.

## 2. Measured source inventory

Counts describe the supplied export snapshot, not a verified current production database. Null/unavailable means unknown, not zero.

| ID | Dataset | Export measurement | Interpretation / migration action |
|---|---|---|---|
| DS-01 | Account/profile candidates | 3,804 author profiles | Not 3,804 verified students. Author records contain identifiers/contact fields, but no exported account-password hashes or role assignments in those author fields. Reconcile identity scope before import |
| DS-02 | Courses | 44: 9 published, 2 private, 3 draft, 30 trash | Preserve states in the audit; do not publish drafts/private/trash by accident. Owner decides archival scope |
| DS-03 | Curriculum topics | 87 topic records | All topic parents resolve to course records in this file |
| DS-04 | Lessons | 61 published lesson records | All lesson parents resolve to topic records. Do not infer that post body contains all lesson content; metadata/video references matter |
| DS-05 | Quiz definitions | 271 records marked published | 224 resolve through topic parents; 47 resolve through explicit course metadata. Owning course status: 207 published, 35 private, 6 draft, 23 trash |
| DS-06 | Question bank/options/answer keys | Not determinable from this export | No explicit question/answer row collections or question/attempt/answer-named post metadata found by this audit. Quiz definitions are not question rows. Additional source data is required before full assessment import |
| DS-07 | Enrollment relationships | 429 records: 407 `completed`, 22 `cancel`; 131 distinct creator references | These are source enrollment states, not 407 completed courses or 131 verified total students. All creator references match an exported author login; final identity/access semantics still need mapping |
| DS-08 | Attempts, answer history and detailed progress | Not determinable; 61 `course_completed` comments observed | A completion comment is not full lesson progress or an attempt/answer log. No complete attempt collection was identified |
| DS-09 | Orders, payments and refunds | No complete order/payment/refund collection identified | Some enrollment order/product references exist, but they do not provide transaction totals, status or refund reconciliation. Do not fabricate orders from an ID reference |
| DS-10 | Public content/navigation | 31 published pages; 9 posts (8 published, 1 draft); 28 menu items | Convert relevant structured content, preserve chosen slugs, replace legacy layout/shortcode behavior and rewrite asset references |
| DS-11 | Media references | 15,066 attachment records; 15,024 distinct URLs and file-metadata paths | Metadata/reference coverage only. 42 repeated references need reconciliation; do not blindly charge/store every record as a unique file |
| DS-12 | Reviews, support, classes and awards | 4 rating comments and 1 ordinary comment; no complete class/attendance/certificate/notes dataset established | Counts are observed comment records, not proof other tools are unused. Retain open source-data coverage questions |

All 16,039 items are counted in the JSON audit. Remaining types include legacy layout/form/style/navigation artifacts. Those are source-conversion clues and are not components selected for the new platform.

**Important source relationship finding:** Every exported quiz can be associated with a source course using the two observed paths. A parent-only importer would miss 47 quizzes. Conversely, importing all published quiz records as public would leak quizzes attached to private/draft/trash courses. Resolve effective visibility through the course and accepted access rules.

## 3. Media inventory and storage boundary

### Screenshot references

| Group | Files | Bytes |
|---|---:|---:|
| Public website/login | 17 | 7,538,873 |
| Admin Panel | 10 | 1,816,174 |
| Student Panel | 30 | 4,979,922 |
| Common | 8 | 2,349,555 |
| Total | 65 | 16,684,524 |

These files document the old UI. They are not a replacement for the 15,066 attachment references or the production study library.

### Production media references in XML

- Extension-based counts: **7,755 PNG**, **5,371 JPG**, **1,556 JPEG**, **381 WEBP**, **1 AVIF**, **1 PDF**, **1 ZIP**. These are URL suffix classifications; actual file signatures have not been verified.
- All attachment URLs point to `gdtutor.com`. The XML does not contain their image/PDF/ZIP binaries, and no download was performed in this item.
- `_video` metadata has a YouTube reference on **57 lessons**. The remaining **4 lessons** have no equivalent `_video` entry in this audit and need source review. There are also 27 course-level video metadata entries classified as other/empty, not established recorded videos.
- YouTube is owner-confirmed as the existing video source. Whether every video remains accessible, its visibility and the account's ability to manage it are still unverified. A locked course page alone does not establish video-link protection.

**Confirmed target:** Cloudflare R2 for images. Keep YouTube video IDs/references through the agreed direct player integration if they satisfy the reviewed delivery requirements. Do not copy videos into R2 or select a new video service as a side effect of this audit. The owner has not yet selected final hosting for downloadable PDF/ZIP study materials; decide that before protected-resource implementation.

Later media preparation must capture original asset identity, actual bytes/type/dimensions, ownership, links, duplicate disposition and new object key. Count missing originals and broken references separately. Convert/render formulas and question images without making private material public. The screenshot bytes and XML size cannot be used to estimate R2 storage for the production library.

## 4. Outstanding source coverage and ownership

| ID | Missing or unresolved detail | Responsible input / verification | Required before |
|---|---|---|---|
| G-01 | Verified users/roles, password recovery approach and which author profiles are real learners/staff | Owner/source maintainer supplies identity scope and available account export information; implementation reconciles it | Identity import acceptance in 3.5; structure review at 2.4.1 |
| G-02 | Actual questions, options, answer keys, scoring context and any diagrams | Owner/source maintainer provides available question data; implementation verifies a representative sample | Full question/assessment import in 6.1/6.5 |
| G-03 | Attempts, learner answers and full lesson-progress records | Owner/source maintainer supplies available history; agree archive/exception handling for unavailable detail | Progress/history import and release reconciliation |
| G-04 | Historical order/payment/refund records and validity terms | Owner/source maintainer provides financial/access data; verify relationship references against source | 7.5 and production access/financial reconciliation |
| G-05 | Media binaries, actual storage bytes, duplicates and ownership/accessibility | Owner supplies asset access; implementation performs a separately scoped acquisition/verification step | R2 migration, protected resources and cost sizing |
| G-06 | Required class/batch, attendance, notes and award history | Owner confirms use/available records; implementation validates evidence | Corresponding Phase 8/9 import acceptance |
| G-07 | 200+ question upper-bound cases and full media/typical-user activity mix | Keep question count configurable; use the explicit synthetic profile below until source/usage measurements justify revisions | Final production sizing and 11.3 acceptance |

These are migration dependencies, not claims that the source has no such data. Request **previous table structures and target PostgreSQL details at 2.4.1**, as already agreed; this item requests no tables or credentials and creates no entities. Additional source data must be accounted for before promising full migration or fixed delivery dates in 0.5.

## 5. Capacity contract and synthetic data profile

**Owner-confirmed:** 500 concurrently active students; longest stated exam 180 minutes; question count 200+. **Proposed test fixture:** 250 questions per representative long exam, plus a 200-question fixture and a larger boundary fixture after a practical upper bound is agreed. **250 is a test choice, not a product cap.** Do not hard-code 200 as the maximum.

Use test-owned synthetic accounts/content. Do not seed real profile values from the local XML into shared/public performance reports. Dataset assumptions below are proposed test scale, not measured source counts or tables.

| Test data | Proposed seed scale | Purpose |
|---|---:|---|
| Student accounts | 1,000 | Unique identities for 500-user acceptance and 750-user diagnostic runs |
| Courses | 50 mixed visibility/access states | Cover free, paid, time-limited, private, draft and archived behavior; exceed the current published-course count |
| Curriculum items | 2,000 lessons/topics | Exercise navigation, ordering and pagination with history present |
| Media metadata | 20,000 references | Exceed the observed 15,066 reference records; no 20,000-file production download implied |
| Questions | 15,000 synthetic questions with representative formulas/images | Question count remains an assumption because the export omits complete question collections |
| Historical attempts | 50,000, with approximately 2.5 million answer records | Exercise queries/indexes with old history; volume is not inferred from production |
| Current long exam | 500 attempts × 250 questions = 125,000 served-question instances | Validate stable question order/snapshots, timing, saving and grading under concurrency |

Record actual seed counts, payload bytes, image/formula complexity and visibility distribution with every result. Adjust this profile when more source history arrives. Do not create this database or load-test harness during 0.4; this document defines its future requirements.

## 6. Workload scenarios

| ID | Scenario | Load and timing | Required behavior |
|---|---|---|---|
| W-01 | Mixed learning | Ramp to 500 over 5 minutes, sustain 30 minutes: 200 learning/progress, 200 quizzes, 75 navigation/dashboard, 25 enrollment/order-flow users | Real work with documented pacing, not 500 idle sessions; private data and course visibility correct |
| W-02 | Long exam | 500 active attempts, 180-minute exam, 250-question fixture; stagger normal answer/navigation actions | No timer extension, lost acknowledged answers or exposed answer keys; query/serialization costs measured |
| W-03 | Synchronized start | 500 attempts begin over 10 seconds (average 50 starts/s); include duplicate/retry requests | Eligibility/attempt slots checked atomically; exactly one intended active attempt per learner/quiz |
| W-04 | Save load | 500 users each issue a meaningful save/edit every 15 seconds in a defined busy-window profile (~33.3 saves/s); separately burst 500 saves over 5 seconds (100/s average) | Save acknowledgment follows durable persistence; revisions/resume remain consistent |
| W-05 | Deadline/submit burst | 500 final submissions over 10 seconds (50/s average), including collisions with timeout finalization and retries | One result per attempt; valid saved answers graded under the attempt snapshot |
| W-06 | Recovery | Repeat 500-user flow with controlled DB/worker/provider interruptions; record failure/retry/recovery windows separately | No false success acknowledgment or duplicated payment/grading effects; accepted writes survive supported recovery |
| W-07 | Headroom diagnostic | Explore 750 active users after acceptance runs | Identify saturation, backlogs and graceful overload; this is not a promised 750-student SLA |
| W-08 | Representative browser/media | Small set of real browser/device checks during/alongside server load; test long formulas, 250-question navigation, YouTube player and image/resource delivery | Full UI remains usable at reviewed mobile widths/themes; distinguish API capacity from video/provider and client-rendering behavior |

In W-01, the 25 enrollment-flow users perform paced stub/sandbox order operations, not continuous real charges. Use controlled provider stubs for bulk load and limited approved sandbox cases separately. Do not load-test external payment, video or meeting services without respecting their testing rules.

W-04's interval is test pacing, not a requirement to delay frontend saving for 15 seconds. Across a full three-hour busy-save soak, this pattern produces approximately **360,000 save operations**; it includes revisions/updates, not 360,000 new questions. Also run a more natural answer pace in W-02. Record pauses and per-action delays so results are reproducible.

For W-05, acknowledgment should confirm a durably finalized attempt and authoritative result within the target where synchronous grading is used. If grading is asynchronous, define a distinct persisted-submission state and explicit result-ready latency before calling the run successful; a queued job alone is not evidence that grading completed.

## 7. Pass criteria and evidence

| Metric | Proposed acceptance threshold at 500 active users |
|---|---|
| Common internal API latency | p95 below 500 ms on the agreed environment and defined action set |
| Quiz-save latency | p95 below 1 second, measured through durable acknowledgment |
| Submit/finalize latency | p95 below 2 seconds; report result-ready latency separately if asynchronous |
| Unexpected server/transport failures | Below 1% overall and for each critical action, with deliberate fault-injection windows reported separately |
| Lost acknowledged answers | **Zero** |
| Duplicate active attempts/finalizations or unauthorized access | **Zero** |
| Deadline correctness | No client-clock or refresh extension; grade accepted answers against the server deadline |
| Reconciliation | All test attempts/payments/grants reconcile; valid independent grants survive unrelated refunds |

Successful requests and error latency must be reported separately; expected validation/denied-access responses do not disappear from the report. Capture p50/p95/p99, throughput, timeouts, CPU/RAM, DB connections/query waits, worker backlog and test-generator saturation. A bottlenecked load generator cannot establish server capacity.

Report dataset version, source-audit reference, application build, topology, machine resources, connection-pool limits, worker configuration, provider stub behavior, request mix, ramp/hold times and recovery results. Make warm/cold-cache conditions explicit. Run the long exam without resetting deadlines; snapshot question configuration before starting.

A server load test does not prove that 500 video streams or online meeting seats work. Assess video/meeting delivery and costs separately. Self-marked completion also does not prove watch attendance, per the accepted business baseline.

## 8. Sizing, cost and next gate

Do not choose a server specification or quote production storage cost from this XML alone. The data/history gaps and missing media binaries prevent reliable final sizing. Begin with measured staging resources and iterate in 6.5/11.3; document any proposed paid infrastructure before activation.

For the 0.5 backlog/estimate, carry forward G-01–G-07 explicitly. Known export records provide a useful content baseline, but full questions/history/payments and actual asset bytes remain dependencies for migration estimates.

The owner accepted this **audited content inventory and workload planning baseline** on 15 October 2026 and authorized 0.5. It is not a completed data migration or a verified 500-user performance result. Synthetic data values are test assumptions, not production facts or fixed product limits. See the tracker for current work.
