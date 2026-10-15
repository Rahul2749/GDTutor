# GD Tutor documentation

**Organized:** 15 October 2026  
Use this index to find the plan, requirements, evidence and current review item.

## Recommended reading order

1. [Progress tracker](delivery/PROGRESS.md) — what is active, awaiting review or accepted.
   Current review deliverable: [0.1 feature inventory and user journeys](requirements/FEATURE-INVENTORY.md).
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
  requirements/
    FEATURE-INVENTORY.md
    DESIGN-AND-TECHNICAL-REQUIREMENTS.md
  reference/
    SCREENSHOT-INDEX.md
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
| [Roadmap](planning/SUBPHASE-ROADMAP.md) | Leaf subphase IDs, work boundaries and acceptance gates | An item is split, reordered or its scope changes |
| [Requirements](requirements/DESIGN-AND-TECHNICAL-REQUIREMENTS.md) | Detailed design and technical acceptance requirements | Product or technical requirements change |
| [Feature inventory](requirements/FEATURE-INVENTORY.md) | Evidence-based capabilities, proposed launch priorities and actor journeys | Scope feedback changes capabilities or priorities |
| [Decisions](planning/DECISIONS.md) | Decision status, rationale and the next decision point | A proposal is selected or a confirmed choice changes |
| [Progress](delivery/PROGRESS.md) | Current item and execution/review status | Work starts, is submitted for review, receives feedback or is accepted |
| [Review records](delivery/reviews/README.md) | Actual implementation evidence and owner feedback for an item | A named subphase is authorized and worked on |
| [Evidence index](reference/SCREENSHOT-INDEX.md) | Observations from original screenshots | New evidence is supplied or an observation is corrected |
| [Changelog](CHANGELOG.md) | Meaningful documentation changes | Documentation is revised or reorganized |

Avoid multiple competing status lists. The roadmap defines the work; the tracker records its state; each review record contains evidence. Confirmed requirements already recorded by the owner remain confirmed even while this revised documentation is being reviewed. Screenshots establish visible UI, not unobserved behavior.

## Working rules

- Follow the [project working agreement](../AGENTS.md) and execute one agreed leaf subphase at a time.
- Before coding, read the selected roadmap item, its requirements and relevant decisions.
- Finish that item, verify it, record the result, and stop for owner review. Do not infer acceptance from silence or elapsed time.
- **At 2.4.1, request the previous database/table structure and PostgreSQL details before persistent entities, mappings or migrations.**
- Record package/license/security checks and any service cost before adoption; do not silently add paid tools.
- Preserve `Project Files/`. Store source credentials and production exports outside tracked documents.
- Use relative links inside repository documentation. Keep numeric subphase IDs stable; add child IDs rather than silently renumbering accepted work.
- Create additional feature documents only as needed. Do not populate every future phase with speculative implementation files.

## Starting the next item

Subphase **0.1 — feature inventory and user journeys** has an owner-authorized [review record](delivery/reviews/0.1-feature-inventory.md) and [scope deliverable](requirements/FEATURE-INVENTORY.md). Consult the tracker for its current state. The next proposed item is 0.2; acceptance and authorization to proceed must be recorded before it starts.
