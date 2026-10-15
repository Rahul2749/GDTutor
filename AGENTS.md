# GD Tutor project working agreement

Start with `docs/README.md` and `docs/delivery/PROGRESS.md`. Before implementation, read `docs/planning/MIGRATION-PLAN.md`, the selected item in `docs/planning/SUBPHASE-ROADMAP.md`, and relevant sections of `docs/requirements/DESIGN-AND-TECHNICAL-REQUIREMENTS.md`. Confirmed/proposed decisions are tracked in `docs/planning/DECISIONS.md`. These preserve the owner's instructions from 14 October 2026; documentation was organized on 15 October 2026.

## Execution and review

- Execute one explicitly agreed leaf subphase at a time. Split an item further when useful.
- Finish that item's work and appropriate validation, present the result, and stop for owner review. Do not implement the next subphase automatically or work ahead while waiting.
- Fix review feedback inside the current item. Proceed only when the owner authorizes the next item; approval of the overall plan is not authorization for all implementation.
- No implementation subphase has started merely because these planning documents exist. Keep a review record when work begins.
- Use `docs/delivery/PROGRESS.md` as the single execution-status tracker. Create a record under `docs/delivery/reviews/` from `docs/delivery/REVIEW-TEMPLATE.md` for each authorized item, and record actual verification and owner feedback.
- Keep roadmap scope, requirements and execution state in their respective documents; update cross-links and `docs/CHANGELOG.md` when reorganizing documentation.

## Confirmed requirements

- React/TypeScript frontend; .NET backend organized with Clean Architecture. Next.js remains the proposed React framework until reviewed.
- Modern student-focused redesign, mobile-first responsive layouts, and Light/Dark/System appearance throughout the application.
- PostgreSQL is the database. **Before creating persistent entities, table definitions, EF mappings or migrations, ask the owner for the prior database/table structure and target database details, then review them.** This is subphase 2.4.1. Do not bypass it with an inferred schema.
- Razorpay for new payments; Cloudflare R2 for images. Video delivery is a separate decision.
- Design and load-test for approximately 500 concurrently active students, including simultaneous quiz attempts and submission bursts. Do not claim capacity without measured evidence.
- Prefer maintained, reputable open-source packages with no paid license. Review exact licenses, dependencies, advisories and costs before adoption. Document any proposed paid service/tool and free alternatives before enabling it.
- Question authoring must include rich text, visual formula/equation tools, editable LaTeX and validated Word/other-source paste workflows. Do not claim universal clipboard compatibility or silently drop unsupported formulas.
- Preserve source screenshots. Keep credentials and sensitive production exports out of source control and planning documents.
