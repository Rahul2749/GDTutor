# GD Tutor documentation

**Organized:** 15 October 2026  
Use this index to find the plan, requirements, evidence and current review item.

## Recommended reading order

1. [Progress tracker](delivery/PROGRESS.md) — what is active, awaiting review or accepted.
   Current checkpoint: [2.3.1 live frontend/API integration](delivery/reviews/2.3.1-live-api-integration.md) is accepted. [Guide](architecture/LIVE-API-INTEGRATION.md), [live preview](http://127.0.0.1:3000/connection-preview?phase=2.3.1) and [browser evidence](architecture/LIVE-INTEGRATION-CHECKS.json) remain available. Owner requested the GitHub checkpoint; next leaf 2.3.2 is not started.
2. [Master migration plan](planning/MIGRATION-PLAN.md) — overall scope, architecture, migration strategy and parent phases.
3. [Subphase roadmap](planning/SUBPHASE-ROADMAP.md) — exact work boundaries and review gates.
4. [Design and technical requirements](requirements/DESIGN-AND-TECHNICAL-REQUIREMENTS.md) — themes, responsiveness, formula authoring, capacity, packages and costs.
5. [Decision register](planning/DECISIONS.md) — confirmed choices, proposals and unresolved decisions.
6. [Screenshot evidence index](reference/SCREENSHOT-INDEX.md) — links to all 65 original screenshots and their visible features.

## Structure

```text
docs/
  README.md
  CHANGELOG.md
  planning/
    MIGRATION-PLAN.md
    SUBPHASE-ROADMAP.md
    DECISIONS.md
    DELIVERY-BASELINE.md
    DELIVERY-BACKLOG.json
  requirements/
    FEATURE-INVENTORY.md
    STANDALONE-REPLACEMENT-MAP.md
    BUSINESS-RULES.md
    DATA-MEDIA-AND-CAPACITY.md
    DESIGN-AND-TECHNICAL-REQUIREMENTS.md
    QUESTION-AUTHORING-CORPUS.md
  architecture/
    APPLICATION-ARCHITECTURE.md
    API-CONVENTIONS.md
  design/
    VISUAL-DIRECTION.md
    THEME-TOKENS.json
    CONTRAST-CHECKS.json
    PREVIEW-CHECKS.json
    NAVIGATION-AND-WIREFRAMES.md
    NAVIGATION-CHECKS.json
    LEARNING-AND-ASSESSMENT-FLOWS.md
    LEARNING-ASSESSMENT-CHECKS.json
    STAFF-AND-AUTHORING-FLOWS.md
    STAFF-AUTHORING-CHECKS.json
    QUESTION-EDITOR-CHECKS.json
    PASTE-EDITOR-REGRESSION-CHECKS.json
    PASTE-ROUNDTRIP-CHECKS.json
    FRONTEND-SCAFFOLD-CHECKS.json
    THEME-FOUNDATION.md
    APPEARANCE-CHECKS.json
    SHARED-UI-FOUNDATION.md
    OVERALL-DESIGN-REVISION.md
    UI-DESIGN-TOKENS.json
    COMPACT-DENSITY-CHECKS.json
    SHARED-UI-CHECKS.json
    UI-THEME-REGRESSION-CHECKS.json
    QUESTION-AUTHORING-DECISION.md
    previews/
  reference/
    SCREENSHOT-INDEX.md
    LOCAL-ASSET-INVENTORY.json
    EXPORT-INVENTORY.json
    QUESTION-CORPUS.json
    QUESTION-SOURCE-AUDIT.json
    PUBLIC-QUESTION-SOURCES.json
    QUESTION-EDITOR-PACKAGES.json
    QUESTION-EDITOR-NPM-AUDIT.json
    EDITOR-SELECTION-NPM-AUDIT.json
    EDITOR-RENDERER-SELECTION-PROBE.json
    FRONTEND-PACKAGES.json
    FRONTEND-NPM-AUDIT.json
    FRONTEND-BOUNDARY-CHECKS.json
    WORD-CLIPBOARD-PROBE.json
    WORD-TO-BROWSER-PROBE.json
    WORD-OUTBOUND-PROBE.json
  delivery/
    PROGRESS.md
    REVIEW-TEMPLATE.md
    reviews/
      README.md
```

## Where information belongs

| Document | Owns | Update when |
|---|---|---|
| [Master plan](planning/MIGRATION-PLAN.md) | Overall scope, parent-phase dependencies, migration and launch approach | Scope or strategy changes |
| [Application architecture](architecture/APPLICATION-ARCHITECTURE.md) / [API conventions](architecture/API-CONVENTIONS.md) | Framework/project boundaries, rendering, deployment topology, HTTP/auth/concurrency contracts | Architecture review or an implementation finding changes the agreed boundary |
| [Frontend scaffold](../apps/web/README.md) / [package register](reference/FRONTEND-PACKAGES.json) / [review](delivery/reviews/2.1.1-frontend-scaffold.md) | Running frontend structure, local commands, dependency admission and verification | Authorized frontend work or dependency changes |
| [Theme foundation](design/THEME-FOUNDATION.md) / [checks](design/APPEARANCE-CHECKS.json) | Common CSS/token ownership, browser appearance persistence and verified fallback behavior | Theme review or implementation changes |
| [Shared UI](design/SHARED-UI-FOUNDATION.md) / [checks](design/SHARED-UI-CHECKS.json) | Common component contracts, interaction examples and current theme regression | Shared component review or consuming integration changes |
| [Roadmap](planning/SUBPHASE-ROADMAP.md) | Leaf subphase IDs, work boundaries and acceptance gates | An item is split, reordered or its scope changes |
| [Delivery baseline](planning/DELIVERY-BASELINE.md) / [backlog](planning/DELIVERY-BACKLOG.json) | Scope coverage, sequential dependencies, six-week target timeboxes, risks and milestones | Scope/order/target assumptions change; regenerate backlog references when roadmap IDs change |
| [Requirements](requirements/DESIGN-AND-TECHNICAL-REQUIREMENTS.md) | Detailed design and technical acceptance requirements | Product or technical requirements change |
| [Visual direction](design/VISUAL-DIRECTION.md) / [tokens](design/THEME-TOKENS.json) | Concrete theme/style proposals, captures and verification limits | Owner reviews visual alternatives or changes branding/theme choices |
| [Navigation and wireframes](design/NAVIGATION-AND-WIREFRAMES.md) | Public/student navigation, representative page hierarchy, state samples and responsive evidence | Owner reviews navigation or changes page structure |
| [Learning and assessment flows](design/LEARNING-AND-ASSESSMENT-FLOWS.md) | Lesson/curriculum, quiz runner/submission/release proposals and simulation limits | Owner reviews learning/assessment interaction or changes those policies |
| [Staff and authoring flows](design/STAFF-AND-AUTHORING-FLOWS.md) | Staff navigation/roles, authoring/review proposals and limited equation/paste-repair concept | Owner reviews staff workflows; editor compatibility remains a separate experiment |
| [Question corpus](requirements/QUESTION-AUTHORING-CORPUS.md) / [cases](reference/QUESTION-CORPUS.json) / [source audit](reference/QUESTION-SOURCE-AUDIT.json) | Original-source intake, proposed compatibility coverage and evidence gaps | Source examples arrive or the corpus is reviewed; execution remains in the progress tracker |
| [Editor experiment](../experiments/question-editor/README.md) / [paste evidence](delivery/reviews/1.5.3-paste-roundtrip.md) | Isolated editor behavior, run instructions and browser/native evidence | Prototype changes or source compatibility evidence arrives |
| [Authoring selection](design/QUESTION-AUTHORING-DECISION.md) / [review](delivery/reviews/1.5.4-editor-selection.md) | Researched editor/renderer baseline, conversion scope, release gates and effort impact | Owner reviews selection or implementation evidence requires revision |
| [Feature inventory](requirements/FEATURE-INVENTORY.md) | Evidence-based capabilities, proposed launch priorities and actor journeys | Scope feedback changes capabilities or priorities |
| [Standalone map](requirements/STANDALONE-REPLACEMENT-MAP.md) | Independent replacements, direct integrations and assigned source unknowns | Integration boundaries or source evidence change |
| [Business rules](requirements/BUSINESS-RULES.md) | Confirmed product policies, proposed rules and worked acceptance examples | The owner selects or changes a business policy |
| [Data/media and capacity](requirements/DATA-MEDIA-AND-CAPACITY.md) | Measured source coverage, missing datasets and proposed workload contract | New source data arrives or test assumptions change |
| [Aggregate export audit](reference/EXPORT-INVENTORY.json) / [screenshot manifest](reference/LOCAL-ASSET-INVENTORY.json) | Reproducible counts/checksums without profile values | The audited source snapshot changes |
| [Decisions](planning/DECISIONS.md) | Decision status, rationale and the next decision point | A proposal is selected or a confirmed choice changes |
| [Progress](delivery/PROGRESS.md) | Current item and execution/review status | Work starts, is submitted for review, receives feedback or is accepted |
| [Review records](delivery/reviews/README.md) | Actual implementation evidence and owner feedback for an item | A named subphase is authorized and worked on |
| [Evidence index](reference/SCREENSHOT-INDEX.md) | Observations from original screenshots | New evidence is supplied or an observation is corrected |
| [Changelog](CHANGELOG.md) | Meaningful documentation changes | Documentation is revised or reorganized |

Avoid multiple competing status lists. The roadmap defines the work; the tracker records its state; each review record contains evidence. Confirmed requirements already recorded by the owner remain confirmed even while this revised documentation is being reviewed. Screenshots establish visible UI, not unobserved behavior.

## Working rules

- Follow the [project working agreement](../AGENTS.md) and execute one agreed leaf subphase at a time.
- Build an independent React/.NET platform; WordPress is only a migration source, never a required runtime, plugin, theme, CMS or API.
- Before coding, read the selected roadmap item, its requirements and relevant decisions.
- Finish that item, verify it, record the result, and stop for owner review. Do not infer acceptance from silence or elapsed time.
- **At 2.4.1, request the previous database/table structure and PostgreSQL details before persistent entities, mappings or migrations.**
- Record package/license/security checks and any service cost before adoption; do not silently add paid tools.
- Preserve `Project Files/`. Store source credentials and production exports outside tracked documents.
- Use relative links inside repository documentation. Keep numeric subphase IDs stable; add child IDs rather than silently renumbering accepted work.
- Create additional feature documents only as needed. Do not populate every future phase with speculative implementation files.

## Starting the next item

[2.3.1 live frontend/API integration](delivery/reviews/2.3.1-live-api-integration.md) is accepted. The [preview](http://127.0.0.1:3000/connection-preview?phase=2.3.1) and [guide](architecture/LIVE-API-INTEGRATION.md) remain available. Next proposed leaf is 2.3.2, build/dependency checks and repeatable local/staging setup; await separate authorization. The database input gate remains 2.4.1.
