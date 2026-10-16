# Subphase 0.5 — Delivery baseline, backlog, risks and target estimate

[Documentation index](../README.md) · [Progress tracker](../delivery/PROGRESS.md) · [Review record](../delivery/reviews/0.5-delivery-baseline.md)

**Prepared:** 15 October 2026  
**Owner direction:** No fixed launch date; implementation by the owner working with Codex; plan for approximately one and a half months.  
**State:** Accepted planning baseline through the owner's subsequent progression instruction. No design or application implementation starts through this document alone; live execution state belongs to the progress tracker.

## 1. Target and confidence

Use **six working weeks**, assumed to contain **30 working days**, as the target for a release candidate covering the agreed application scope. This replaces the earlier conventional-team calendar estimate as the active planning model. It is a **stretch target**, not a measured guarantee or a fixed public launch date.

The target includes the modern responsive light/dark application, staff authoring, learning, configurable quizzes, payments, online/offline classes, agreed support tools, reporting and system validation. Production migration can occur only after source-data, reconciliation, pilot, security and capacity gates pass. Stabilization and legacy retirement have their own reviewed steps after launch; they are not silently squeezed into the build estimate.

Current confidence is low until the formula/paste prototype, first running foundations and missing-data feasibility are checked. The XML does not establish complete identities, questions, answers, attempts, payments or production media binaries. Those gaps may extend migration work even if the new application is otherwise functional.

The target is a planning budget rather than an independent bottom-up duration forecast: there are no measured implementation-throughput results yet. Record actual work/review time on the first coded subphases and replace these timeboxes with evidence as it becomes available.

## 2. Baseline and scope protection

Use these accepted inputs:

- [0.1 feature inventory](../requirements/FEATURE-INVENTORY.md): 52 feature IDs, actor journeys and L0/L1/L2 boundaries.
- [0.2 standalone replacement map](../requirements/STANDALONE-REPLACEMENT-MAP.md): React/.NET ownership and direct services, with no WordPress runtime dependency.
- [0.3 business rules](../requirements/BUSINESS-RULES.md): configurable access/quizzes, online/offline classes and accepted operational policies; explicitly unspecified details stay open.
- [0.4 source/capacity baseline](../requirements/DATA-MEDIA-AND-CAPACITY.md): measured export records, G-01–G-07 source gaps and the 500-student/180-minute/200+ question workload. The accepted 250-question fixture is a test assumption, not a product cap.

All L0 capabilities and confirmed active parity features remain required. L1 capabilities remain launch candidates until the owner explicitly selects retain, limited historical access, defer or retire. No L1 feature has been silently removed to meet six weeks. L2 enhancements remain outside the baseline unless separately requested or shown to be an existing dependency.

## 3. Consolidated backlog and traceability

The [machine-readable backlog](DELIVERY-BACKLOG.json) contains all **89 existing leaf subphase IDs**, their scopes and review gates from the roadmap, sequential predecessors, target week, uncertainty and additional input gates. It does not duplicate execution status; the progress tracker owns that.

| Stream | Coverage | Main roadmap ownership |
|---|---|---|
| B-01 Design/foundations | NFR-01, NFR-04 | Phase 1, frontend 2.1, backend 2.2, integration/database/adapter foundations 2.3–2.5 |
| B-02 Accounts/permissions | ACC-01–ACC-04 | Phase 3 |
| B-03 Public website/discovery | PUB-01–PUB-06 | Phase 4; cart/share/wishlist connections in Phases 7/9 |
| B-04 Course authoring | CRS-01–CRS-05 | Phases 4/5 |
| B-05 Enrollment/learning | ENR-01, ENR-03, LRN-01–LRN-03 | Phase 5 |
| B-06 Formula authoring/assessment | QST-01–QST-04, ASM-01–ASM-05 | Prototype 1.5; Phase 6 |
| B-07 Commerce/access operations | ENR-02–ENR-05 | Phase 7; access grant rules also in 5.1 |
| B-08 Classes/batches | CLS-01–CLS-02 | Phase 8 |
| B-09 Learning support | SUP-01–SUP-04 | Phase 9 |
| B-10 Completion/awards | CMP-01–CMP-02 | Phase 9; learning rules in 5.4 |
| B-11 Staff operations/reporting | OPS-01–OPS-03 | Phase 10, with basic administration delivered alongside each feature |
| B-12 Migration/public continuity | MIG-01–MIG-04 | Import slices throughout Phases 2–9; rehearsals in 11; cutover in 12 |
| B-13 Quality/operations | NFR-01–NFR-05 | Throughout implementation; consolidated checks in 11–13 |

All 52 feature IDs are covered; overlap indicates cross-cutting ownership rather than duplicate work. Feature and rule details stay in their original specifications. This backlog does not select proposed frameworks, libraries or providers merely by naming a stream.

## 4. Six-week target sequence

Week numbers are relative planning windows, not calendar bookings. Execute one agreed leaf at a time and stop at every review. A week containing several phases does not authorize them together.

| Window | Target outcome and scope | Leaf reviews | Workday timebox |
|---|---|---:|---:|
| Week 1 | Approved visual direction/mobile flows, formula-paste investigation and architecture: Phase 1 | 9 | 5 |
| Week 2 | Frontend foundation, then backend Clean Architecture, integration setup, owner-gated PostgreSQL slice, and identity: Phases 2/3 | 21 | 5 |
| Week 3 | Public content/catalog/course authoring, free enrollment, learning/resume: Phases 4/5 | 12 | 5 |
| Week 4 | Production formula editor, quiz authoring/timing/grading/history and Razorpay/access workflows: Phases 6/7 | 16 | 5 |
| Week 5 | Online/offline classes, learning support/completion and cross-module staff operations: Phases 8–10 | 13 | 5 |
| Week 6 | Data rehearsals, full capacity/security/mobile/SEO checks, pilot fixes and readiness report: Phase 11 | 7 | 3 + 2 reserve |

The phase timeboxes underlying the total are: Phase 1 **5 days**; Phase 2 **3**; Phase 3 **2**; Phase 4 **3**; Phase 5 **2**; Phase 6 **3**; Phase 7 **2**; Phase 8 **1.5**; Phase 9 **1.5**; Phase 10 **2**; Phase 11 **3**, plus **2 days** of shared integration/fix reserve. They sum to 30 working days.

Weeks 2 and 4 are especially aggressive. They depend on small review packets, prompt feedback, usable source inputs, no major editor/provider surprises, and successful integration. Three hours of exam testing also consumes real wall-clock time and cannot be claimed from a short smoke test.

**16 October, 1.5.4 accepted reforecast input (no revised launch commitment):** The [authoring selection](../design/QUESTION-AUTHORING-DECISION.md#8-delivery-impact-and-review-boundaries) identifies required DOCX conversion/repair and native-platform verification. Provisional focused effort for 6.1.1–6.1.4 is **7–12 workdays before the rest of Phase 6 assessments**, exceeding the original three-day Phase 6 timebox. These are engineering allowances, not measured throughput. The accepted 30-day target and backlog JSON timeboxes above remain the historical stretch baseline; they are not a current proof of feasibility. Reforecast after foundations and converter proof; extend the schedule or obtain an explicit scope decision if necessary. Do not silently omit Word/formula capability or skip review gates.

There are **78** leaf review items across Phases 1–11, averaging **2.6 per working day** over the six-week window. Week 2 needs 21 reviews over five days. If the owner can review only one item per day, reviews alone require at least 78 working days; the six-week target would need revision. No unattended automatic acceptance is assumed.

This is an owner-plus-Codex workflow, not a claim of a separate developer team or parallel agents. Within an authorized item, normal implementation and verification can proceed autonomously. Every next leaf still requires owner direction.

### Release and stabilization boundary

Phase 12 is conditional: select the maintenance window only after readiness evidence is accepted. It can fall near the end of week 6 if prerequisites are met; otherwise move it rather than bypass data/payment/assessment checks. Phase 13 follows actual launch. Its monitored stabilization/retention period must be agreed before retirement; it has no fabricated date in this plan.

If required migration data remains unavailable, the week-6 outcome may be a staging candidate with synthetic/partial source data. That must be labeled as such; it does not count as a completed production migration and does not remove the outstanding scope.

## 5. Milestones and completion evidence

| ID | Milestone | Evidence required |
|---|---|---|
| M-01 | Design and architecture accepted | 1.1–1.6 reviews, both themes/mobile samples, formula compatibility findings, selected framework/architecture decisions |
| M-02 | Frontend foundation | 2.1.1–2.1.5: buildable structure, common CSS/tokens/components/layouts and request/error conventions |
| M-03 | Backend foundation | 2.2.1–2.2.3: correct project boundaries, service/config wiring, errors/logging/health/API conventions |
| M-04 | First approved persistence/import slice | Owner input at 2.4.1, reviewed mapping, development-only migration, rerunnable sample import; no inferred schema bypass |
| M-05 | First complete learning flow | Staff publishes a free course; student enrolls, studies and resumes saved progress |
| M-06 | Reliable assessment flow | Editable/pasted formulas, configurable quiz, saved answers, server deadline, grading/history and early capacity evidence |
| M-07 | Complete paid-access flow | Razorpay test purchase → verified payment → grant → receipt/history; late/duplicate/refund cases reconciled |
| M-08 | Remaining parity workflows | Agreed class/support/completion/reporting features operate through the standalone application |
| M-09 | Release candidate | Migration coverage accounted for, full three-hour 500-user exam tests and other quality gates pass, pilot issues resolved |
| M-10 | Production and handover | Approved Phase 12 window/cutover evidence, reconciliation, operational ownership and post-launch monitoring |

Milestones describe evidence, not automatic approval. A polished screenshot alone cannot complete an API/persistence/payment milestone.

## 6. Risk and dependency register

| ID | Risk / current evidence | Owner and action | Blocking gate |
|---|---|---|---|
| RK-01 | Complete question/options/answer keys absent from supplied WXR coverage | Owner/source maintainer provides available source data; implementation validates samples | Historical question import 6.1.4/6.5 and final migration reconciliation; does not block palette/scaffold work |
| RK-02 | Author profiles are not verified learner accounts; role/password data incomplete | Owner supplies account scope; implementation reviews identity/reset approach and maps legacy IDs | 3.5 and launch identity/access reconciliation |
| RK-03 | Attempt/answer/progress history incomplete | Owner supplies data or explicitly selects preserved-history exceptions; implementation verifies | 5.5/6.5, 11.1; new synthetic test workflows may be built earlier |
| RK-04 | Order/refund details missing despite enrollment references | Owner/source maintainer supplies historical financial/grant information | 7.5 and launch active-access/financial reconciliation |
| RK-05 | 15,066 attachment references are not binaries/known bytes; duplicates and four lesson sources need review | Owner supplies assets/access; implementation validates copying, rewriting and YouTube behavior | Affected content/media import, cost sizing and 11.1; R2 adapter development can use test assets |
| RK-06 | Word/native equations may not paste losslessly | Owner supplies representative documents; implementation evaluates open-source tools and explicit repair/fallback | 1.5 decision and 6.1 authoring acceptance; do not quietly buy a converter |
| RK-07 | 500 three-hour exams with 200+ questions have not been run | Implementation measures seed/payload/DB/API behavior, saves, starts and deadline bursts | 6.5 early check; 11.3 release gate |
| RK-08 | Meeting/email/download hosting providers and access details are undecided | Owner selects through cost/security review; implementation uses replaceable direct adapters | Corresponding integration items, not unrelated UI work |
| RK-09 | Database structures are intentionally not yet supplied | Ask the owner at 2.4.1, review before entities/mappings/migrations | Persistent business schema; frontend and infrastructure-free backend scaffolds may proceed first |
| RK-10 | Six-week budget may not fit actual implementation/review pace | Owner and Codex record first-item actuals and update forecast; no silent scope cuts | Target-date confidence; one-item review discipline remains mandatory |
| RK-11 | Mixed public/private/draft/trash course states and unusual quiz parentage | Implementation uses audited relation/visibility rules and reconciliation | Imports must not expose private/trash content or lose the 47 directly referenced quizzes |
| RK-12 | Cutover after new writes cannot be reversed by routing alone | Implementation rehearses event draining, final delta and recovery of post-switch writes; owner approves runbook | 11.2 and 12.1–12.3 |

G-01–G-07 in the source inventory are carried forward in the JSON backlog. Missing datasets are not marked complete merely because this planning phase is accepted. None of these risks justifies introducing WordPress into the new runtime.

## 7. Reforecast and change policy

Record each item's actual work, verification result, owner review turnaround, dependency wait and requested changes in its review record. Update the forecast after the formula investigation, frontend/backend foundations, first learning flow, early exam load check and full rehearsal.

If an item exceeds its timebox, exposes a new source gap or needs a paid provider, record the impact before selecting the next item. Choose an explicit owner-reviewed outcome: extend the target, simplify an unconfirmed variation, or defer a named capability with its history/access implications. Preserve all other scope and acceptance checks. Two reserve days do not cover unknown unlimited data recovery or a new feature line.

The older 28–44-week estimate assumed a conventional frontend/backend team and is retained only as historical context. It is not mixed into this owner-plus-Codex budget. Neither estimate is a contractual promise or an inference that code generation eliminates integration/review work.

No new monthly cost estimate is credible from the current asset references alone. Reuse the service cost register, measure real resources/media, and review exact paid usage before enabling it. Open-source packages still require version/license/security review at their installation subphase.

## 8. Next authorized boundary

The next proposed item is **1.1 — Brand direction, accent palette, typography and light/dark token proposal**. It should deliver a concrete visual style sample for review, with modern student-focused design and readable mobile/theme combinations. Palette values in the current requirements are a starting proposal; they have not been selected merely by accepting discovery.

Starting 1.1 does not authorize the whole design phase or application scaffolding. First application structure remains **2.1.1**, followed by the rest of frontend foundation and then separately reviewed backend foundation. The mandatory database input checkpoint remains **2.4.1**.

Phase 0 is accepted as a discovery baseline with assigned unresolved dependencies. It does not certify production readiness or erase the source-data gaps. The subsequently authorized 1.1 study is submitted separately in its [review record](../delivery/reviews/1.1-visual-direction.md); follow the tracker for its status and the next boundary.
