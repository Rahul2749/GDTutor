# Decision register

**Updated:** 15 October 2026  
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
| D-006 | Modern design with light/dark switching | Include System preference; exact palette is proposed below |
| D-007 | Responsive, mobile-friendly application | Review learner and staff workflows on small screens, including math input |
| D-008 | Approximately 500 concurrent students | Demonstrate capacity through realistic learning and exam workloads |
| D-009 | Prefer secure, maintained open-source packages and avoid paid tools | Audit specific versions; disclose unavoidable operating costs and alternatives |
| D-010 | Dynamic formula/question authoring with Word/other-source copy/paste | Validate real source samples; expose unsupported content instead of silently losing it |

## Proposals and open decisions

| ID | Status | Decision | Resolve in |
|---|---|---|---|
| D-011 | Proposed | Next.js as the React framework | 1.6, before 2.1.1 |
| D-012 | Proposed | .NET 10 supported patch baseline | 1.6 / 2.2.1, check support again at installation |
| D-013 | Proposed | Indigo/teal accents, amber highlights and slate surfaces | 1.1 visual review |
| D-014 | Proposed | Tiptap OSS + MathLive, with KaTeX or MathJax selected through testing | 1.5.1–1.5.4 |
| D-015 | Open | Exact Word/source-app compatibility and need for DOCX fallback | 1.5.1–1.5.4 using owner samples |
| D-016 | Open | Legacy LMS/plugins, old gateway, data layout and extraction approach | 0.2 / 0.4; detailed schema review at 2.4.1 |
| D-017 | Open | Access duration, quiz rules, completion and required commercial variations | 0.3 |
| D-018 | Open | Video hosting, live-class provider and required integration depth | 0.2 / 0.3; provider approval before implementation |
| D-019 | Open | Hosting, resource sizing, backups and monthly budget | Initial boundaries in 1.6; measured sizing and cost review in 11.3.3 |
| D-020 | Open | Final launch scope and revised calendar estimate | 0.5 and ongoing named subphase reviews |

Detailed palette values, package candidates, performance targets and published cost examples live in the [requirements](../requirements/DESIGN-AND-TECHNICAL-REQUIREMENTS.md). This register records their decision state without replacing those specifications. No proposal is accepted simply because it appears in a plan.
