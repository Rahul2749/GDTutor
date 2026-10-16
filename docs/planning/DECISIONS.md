# Decision register

**Updated:** 16 October 2026  
**Sources:** Owner instructions on 14 October 2026, the [master plan](MIGRATION-PLAN.md), and [technical requirements](../requirements/DESIGN-AND-TECHNICAL-REQUIREMENTS.md).

Confirmed means selected by the owner, not implemented or verified. Proposed means recommended for review. Open means further input or investigation is required. Change a confirmed choice only with an explicit owner decision and record the reason/date here.

## Confirmed decisions

| ID | Decision | Implication / review point |
|---|---|---|
| D-001 | One reviewed leaf subphase at a time | No automatic progression; record feedback and acceptance |
| D-002 | React frontend and .NET backend | Establish frontend and Clean Architecture backend foundations separately |
| D-003 | PostgreSQL | Request existing schema and database details at 2.4.1 before persistent entity work |
| D-004 | Razorpay for new payments | Test mode first; server verification and reconciliation required |
| D-005 | Cloudflare R2 for images | Video delivery remains a separate decision |
| D-006 | Modern design with light/dark switching | Include System preference; Focus Workspace visual baseline is recorded in D-013 |
| D-007 | Responsive, mobile-friendly application | Review learner and staff workflows on small screens, including math input |
| D-008 | Approximately 500 concurrent students | Demonstrate capacity through realistic learning and exam workloads |
| D-009 | Prefer secure, maintained open-source packages and avoid paid tools | Audit specific versions; disclose unavoidable operating costs and alternatives |
| D-010 | Dynamic formula/question authoring with Word/other-source copy/paste | Validate real source samples; expose unsupported content instead of silently losing it |
| D-021 | Fully independent replacement; no WordPress components or runtime/API dependency | Owner clarification on 15 October 2026. Legacy system is a migration source only; rebuild capabilities in React/.NET and integrate services directly |
| D-022 | Course access configurable: lifetime or time-limited | Owner answer on 15 October 2026; Q-02 baseline subsequently accepted, offer-specific values configurable |
| D-023 | Marks, negative marking, pass score, retakes and answer release configurable per quiz | Owner answer on 15 October 2026; Q-04 baseline subsequently accepted, exact quiz settings remain configurable |
| D-024 | Both live online classes and offline coaching batches | Owner answer on 15 October 2026; Q-06 baseline accepted, attendance/recording scope and meeting provider remain open |
| D-025 | 0.3 R-01–R-40 working policy baseline accepted | Owner said "go ahead" after the review handoff on 15 October 2026; explicit conditional/unspecified choices remain unresolved |
| D-026 | Current recorded videos are on YouTube | Owner answer during 0.4; 57 lesson metadata entries corroborate references. Accessibility/visibility and four other lessons need review |
| D-027 | Exams up to 180 minutes with 200+ questions | Owner answer during 0.4; 500 active students still required; no exact upper question bound supplied |
| D-028 | 250-question test fixture and synthetic data scale accepted as capacity-planning assumptions | Acceptance of 0.4 on 15 October 2026; not a fixed product cap or measured source history |
| D-029 | Owner working with Codex; no fixed launch date; approximately one-and-a-half-month planning target | Owner answer during 0.5. Six-week stretch sequence proposed; readiness gates and review boundaries remain mandatory |
| D-013 | Focus Workspace visual baseline: teal actions, violet secondary accents, warm neutrals and editorial headings | Selected preview variant followed by owner "go next" on 15 October 2026; carried forward into 1.2. [Visual direction](../design/VISUAL-DIRECTION.md) and [tokens](../design/THEME-TOKENS.json). Layout/navigation proposals still require their own reviews |
| D-014 | Tiptap OSS + MathLive + custom equation nodes + KaTeX authoring baseline, with bundled mhchem planned | Owner accepted 1.5.4 through subsequent “ok go ahead” on 16 October. [Selection](../design/QUESTION-AUTHORING-DECISION.md) retains exact-version admission, production integration, notices and notation/accessibility gates; no compatibility certification |

| D-011 | Next.js App Router for React frontend | Owner accepted 1.6 through “go ahead” on 16 October. 2.1.1 pins Next 16.4.2/React 19.3.1; public/private API boundaries remain in the [architecture](../architecture/APPLICATION-ARCHITECTURE.md) |
| D-012 | .NET 10 LTS backend baseline | Owner accepted 1.6; exact supported SDK/runtime patch admission remains 2.2.1, not the installed older runtime |
| D-030 | Clean Architecture modular monolith with durable .NET Worker and bounded trusted Node content tool | Accepted 1.6; PostgreSQL coordination after schema review, converter only after admission, no default microservices/message broker |
| D-031 | Same-origin versioned .NET API, Identity cookies/antiforgery, ProblemDetails, ETags and durable scoped idempotency | Accepted 1.6 [API conventions](../architecture/API-CONVENTIONS.md); security/durability/runtime evidence remains implementation work |

## Proposals and open decisions

| ID | Status | Decision | Resolve in |
|---|---|---|---|
| D-015 | Approach accepted; compatibility partial | Owner accepted 1.5.4: reviewed paste plus required DOCX import/repair in 6.1.3; Pandoc is the preferred engine to prove, with exact-release/GPL/security admission pending. Direct clipboard, teacher configurations and full fidelity remain unverified. Copy LaTeX and qualified MathML; DOCX export separate | [Corpus](../requirements/QUESTION-AUTHORING-CORPUS.md), [accepted scope](../design/QUESTION-AUTHORING-DECISION.md); no converter installed |
| D-016 | Partially resolved | Supplied WXR content/enrollment/media counts audited; full identity/question/attempt/payment coverage and source structure unresolved | [0.4 inventory](../requirements/DATA-MEDIA-AND-CAPACITY.md), G-01–G-06; schema review at 2.4.1 |
| D-017 | Partially resolved | 0.3 baseline accepted; required extra question types, refund eligibility and explicitly conditional commercial variations remain unresolved | [Business rules](../requirements/BUSINESS-RULES.md) |
| D-018 | Partially resolved | YouTube source and online/offline classes confirmed; visibility/access, four lesson sources, meeting provider and attendance/recording depth remain open | [0.4 media audit](../requirements/DATA-MEDIA-AND-CAPACITY.md); provider approval before implementation |
| D-019 | Boundaries accepted; provider/budget open | Self-hostable Next/API/worker behind one TLS origin; private PostgreSQL and isolated environments. No provider, sizing or recovery target selected | [1.6 deployment](../architecture/APPLICATION-ARCHITECTURE.md); setup review before provisioning, measured sizing/cost at 11.3.3 |
| D-020 | Partially resolved | Six-week owner-plus-Codex target and scope coverage proposed; fixed launch date not requested, source gaps and conditional variations remain | [0.5 delivery baseline](DELIVERY-BASELINE.md); reforecast from implementation/review evidence |

Detailed palette values, package candidates, performance targets and published cost examples live in the [requirements](../requirements/DESIGN-AND-TECHNICAL-REQUIREMENTS.md). This register records their decision state without replacing those specifications. No proposal is accepted simply because it appears in a plan.
