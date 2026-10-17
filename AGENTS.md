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

- The replacement must be independent of WordPress: no WordPress plugins, themes, PHP runtime, headless WordPress CMS, live WordPress database connection or WordPress API dependency. Legacy content/data may be read for a one-time migration only. Build equivalent capabilities in React/.NET; use direct Razorpay/R2 integrations. Owner clarified this on 15 October 2026.
- React/TypeScript frontend using the accepted Next.js App Router architecture; .NET backend organized with Clean Architecture. Owner accepted 1.6 through “go ahead” on 16 October 2026. Exact dependency/tool patches and runtime behavior still require admission and verification in implementation leaves.
- English-only application interface and preview copy: owner said not to use Hindi or Marathi on 16 October 2026. Preserve original source/export evidence; do not add Hindi/Marathi sample text to the application.
- Modern student-focused redesign, mobile-first responsive layouts, and Light/Dark/System appearance throughout the application.
- PostgreSQL is the database. **Before creating persistent entities, table definitions, EF mappings or migrations, ask the owner for the prior database/table structure and target database details, then review them.** This is subphase 2.4.1. Do not bypass it with an inferred schema.
- Razorpay for new payments; Cloudflare R2 for images. Video delivery is a separate decision.
- Design and load-test for approximately 500 concurrently active students, including simultaneous quiz attempts and submission bursts. Do not claim capacity without measured evidence.
- Prefer maintained, reputable open-source packages with no paid license. Review exact licenses, dependencies, advisories and costs before adoption. Document any proposed paid service/tool and free alternatives before enabling it.
- Question authoring must include rich text, visual formula/equation tools, editable LaTeX and validated Word/other-source paste workflows. Do not claim universal clipboard compatibility or silently drop unsupported formulas.
- Owner clarified on 16 October 2026: consider all question-source app/platform families and subjects/languages, including outbound Word reuse. Track representative coverage and gaps in `docs/requirements/QUESTION-AUTHORING-CORPUS.md`; original editable samples and per-configuration verification are required before compatibility claims. The owner subsequently authorized public internet/platform fixtures instead of waiting for private originals, and progression to 1.5.2 on 16 October; record provenance and keep actual teacher clipboard behavior unverified.
- Owner confirmed on 15 October 2026: course access configurable as lifetime or time-limited; marks/negative marking/pass score/retakes/answer release configurable per quiz; support both live online classes and offline coaching batches. The 0.3 business-rule baseline was subsequently accepted through the owner's "go ahead" after its handoff; implement accepted rules in `docs/requirements/BUSINESS-RULES.md`, leaving expressly unspecified settings/provider choices open.
- Owner supplied the offline XML export in 0.4, confirmed YouTube videos, and specified exams up to three hours with 200+ questions. Treat 250 questions as a proposed capacity-test fixture, not a product limit. Raw production exports remain local/untracked; aggregate inventory is in `docs/reference/EXPORT-INVENTORY.json`.
- Owner clarified during 0.5: implementation is the owner working with Codex, with no fixed launch date and an approximately one-and-a-half-month target. Use `docs/planning/DELIVERY-BASELINE.md` and `DELIVERY-BACKLOG.json` for the six-week stretch sequence; do not silently omit scope, skip reviews or claim readiness to meet the target. Reforecast from actual implementation and review pace.
- Preserve source screenshots. Keep credentials and sensitive production exports out of source control and planning documents.
