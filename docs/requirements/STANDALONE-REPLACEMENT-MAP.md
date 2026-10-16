# Subphase 0.2 — Standalone replacements and integrations

[Documentation index](../README.md) · [Progress tracker](../delivery/PROGRESS.md) · [Review record](../delivery/reviews/0.2-standalone-replacements.md)

**Prepared:** 15 October 2026  
**Status:** Accepted for progression on 15 October 2026 — assigned source unknowns remain unresolved.

## 1. Decision and scope

The replacement is an independent React/TypeScript and .NET application with PostgreSQL. It must not require WordPress plugins, themes, PHP, a headless WordPress CMS, WordPress APIs, or live access to the old database.

This applies to public pages as well as student and staff features. Staff must author courses, questions, blogs and other agreed content inside the new application. Razorpay and Cloudflare R2 are direct integrations, not WordPress integrations.

The old site remains a migration source. Courses, users, purchases, entitlements and learning history can be extracted into controlled files and imported through standalone utilities. Retaining an isolated old backup during migration does not make it a service used by the replacement.

This item maps capabilities and assigns integration questions. It does not identify every installed old plugin, choose new packages, perform extraction, design tables or configure services.

## 2. Available evidence

The repository contains 65 screenshots, planning documents and Git metadata. No PHP application source, installed-plugin/theme report, custom-code export, database dump or service configuration was supplied locally.

**Subsequent evidence, 0.4:** The owner supplied an offline WXR XML export, now audited in the [data/media inventory](DATA-MEDIA-AND-CAPACITY.md). It provides content, enrollment and media-reference records but does not establish complete question/attempt/payment coverage or current installed versions. The original 0.2 evidence boundary above describes what was available at that review.

| Finding | Confidence and boundary | Evidence |
|---|---|---|
| Existing site uses WordPress | Owner-confirmed and visible admin bar; version unknown | [Staff dashboard](<../../Project Files/Admin Panel/Screenshot 2026-10-14 194225.png>) |
| Elementor editing entry appears | Visible edit link; edition/version and active template configuration unknown | [Public course detail while signed in](<../../Project Files/Common/Screenshot 2026-10-14 195723.png>) |
| Existing LMS course builder and learner workspace | Visible behavior; exact vendor/version/add-ons unverified | [Course builder](<../../Project Files/Admin Panel/Screenshot 2026-10-14 194313.png>), [lesson player](<../../Project Files/Common/Screenshot 2026-10-14 195842.png>) |
| Free and paid offers exist | Visible pricing/actions; old transaction processor unverified | [Course cards](<../../Project Files/HomePage_3.png>), [pricing settings](<../../Project Files/Admin Panel/Screenshot 2026-10-14 194335.png>) |
| Mathematical/chemical content is displayed | Visible notation; complete source macro format and renderer version unknown | [Math question](<../../Project Files/Student Panel/Screenshot 2026-10-14 195237.png>), [chemistry question](<../../Project Files/Student Panel/Screenshot 2026-10-14 194936.png>) |
| Recorded lessons exist | Player visible; source hosting, access model and ownership need confirmation | [Video lesson](<../../Project Files/Common/Screenshot 2026-10-14 195842.png>) |
| Calendar/live-class/support views exist | Empty interfaces do not establish provider configuration or active use | [Full evidence index](../reference/SCREENSHOT-INDEX.md) |

Names such as Tutor LMS or WooCommerce in earlier planning are hypotheses or conditional examples, not verified source dependencies and never selected target components.

## 3. Capability replacement map

Feature IDs refer to the accepted-for-progression [0.1 inventory](FEATURE-INVENTORY.md). The existing [roadmap](../planning/SUBPHASE-ROADMAP.md) owns detailed review gates.

| ID | Legacy capability | Standalone owner and replacement | Preserve or investigate | Delivery |
|---|---|---|---|---|
| R-01 | Theme/page-builder presentation | React layouts and shared design components with theme tokens | Branding assets, public copy and useful navigation; redesign the presentation | PUB-01; 1.1–1.4, 2.1, 4.1 |
| R-02 | WordPress pages/blog/content editing | New staff content editor, .NET publishing APIs and PostgreSQL content records | Titles, slugs, posts, metadata and required editing workflow | PUB-04–PUB-05; 4.2–4.3 |
| R-03 | LMS catalog and course builder | React course editor plus .NET catalog/curriculum use cases | Categories, authors, descriptions, prices, section order and publish state | CRS-01–CRS-05; 4.4–4.7 |
| R-04 | WordPress/LMS account access | New identity/session management and resource authorization in .NET | Identity mapping, recovery process and legacy password formats if available | ACC-01–ACC-03; 3.1–3.5 |
| R-05 | Enrollment and paid-content permissions | .NET enrollment/access rules, independent of purchase record storage | Free/manual/paid grant sources, dates, expiry and revocation rules | ENR-01–ENR-03; 5.1, 7.3, 10.1 |
| R-06 | Existing commerce/plugin workflow | New orders, billing, price validation, refunds and direct Razorpay integration | Historical provider references and amounts; existing subscriptions if any | ENR-02–ENR-05; 7.1–7.5 |
| R-07 | WordPress media library and image links | Direct Cloudflare R2 storage with new staff upload/media management | Original assets, ownership, image references and public/private classification | OPS-03; 2.5.1, 4.5 |
| R-08 | Recorded video embeds/player | React player integrated with an agreed direct video source/provider | Hosting rights, source IDs, protected playback and accessible recordings | LRN-02; 5.3; provider decision open |
| R-09 | LMS progress and resume | .NET progress/completion use cases and PostgreSQL records | Completed items, resume points and definition of completion/time spent | LRN-01–LRN-03; 5.2–5.5 |
| R-10 | Question entry and formula display | Reviewed standalone rich-text/math libraries embedded in the new authoring UI | Original LaTeX/math content, images, answer options and explanations | QST-01–QST-04; 1.5, 6.1–6.2 |
| R-11 | Timed quizzes, scores and attempts | .NET server deadlines, saved answers, grading and attempt snapshots; React runner | Historical attempt outcomes, actual scoring/retake rules and anomalies | ASM-01–ASM-05; 6.3–6.5 |
| R-12 | Calendar/live-class integration | New session/batch management with a direct meeting provider if required | Current delivery model, schedules, joins, attendance and recordings | CLS-01–CLS-02; 8.1–8.4 |
| R-13 | Notes, wishlist, discussions and reviews | New course-scoped APIs and student/staff interfaces | Private versus shared visibility; existing records if any | SUP-01–SUP-03; 9.1–9.3 |
| R-14 | Announcements, emails and scheduled tasks | .NET notifications and durable jobs using a direct email provider | Sender settings, message types, existing scheduled business actions | SUP-04, OPS-03; 2.5.2, 9.3, 10.4 |
| R-15 | Gradebook and certificates | Server-side completion/award rules, new report/download UI | Award history, certificate identifiers, templates and eligibility rules | CMP-01–CMP-02; 9.4–9.5 |
| R-16 | Staff charts and reports | .NET reporting queries and React dashboards | Metric definitions, historical financial totals and staff visibility | OPS-01–OPS-02; 10.1–10.3 |
| R-17 | SEO, redirects, caching and maintenance plugins | New route/metadata/sitemap handling plus hosting cache, deployment and monitoring configuration | Important URLs, redirect rules and behavior needed by users | MIG-04, NFR-05; 4.7, 11.5, 12–13 |
| R-18 | Custom hooks/snippets and undocumented plugin behavior | Explicit standalone business rules in the appropriate .NET module | Discounts, redirects, automatic access or grading exceptions, if actually used | Identify in 0.3/0.4; assign implementation only after the behavior is known |

Public content cannot remain dependent on old Elementor shortcodes, WordPress script bundles or an old uploads endpoint. Convert content into supported structured content, copy agreed assets and rewrite references. A new frontend that retrieves live course/account data from WordPress would not meet the requirement.

## 4. Direct integrations and open decisions

| ID | Integration | Target decision | Remaining information | Owner and decision point |
|---|---|---|---|---|
| I-01 | Database | PostgreSQL confirmed | Previous tables/relationships and target database details | Owner supplies; implementation reviews at 2.4.1 before persistent entities |
| I-02 | Payments | Razorpay confirmed | Merchant/test setup later; old processor, refunds and recurring-payment dependencies for migration | Owner/source maintainer supplies old details in 0.3/0.4; test setup in 7.2 |
| I-03 | Images | Cloudflare R2 confirmed | Existing asset sources, ownership, public/private treatment and later account/bucket setup | Owner supplies asset details in 0.4; direct integration reviewed in 2.5.1 |
| I-04 | Recorded video | Provider not selected | Existing host, source access, privacy, playback and costs | Owner supplies in 0.3/0.4; implementation proposes an approach before 5.3 |
| I-05 | Live meetings | Online sessions and offline batches confirmed in 0.3; direct meeting provider undecided | Current meeting service and required recording/attendance depth | Owner confirmed delivery types on 15 October 2026; provider review before 8.3 |
| I-06 | Email | Direct service/SMTP approach not selected | Existing sender/domain, email types and volume | Owner supplies needs in 0.3/0.4; adapter/cost review in 2.5.2 |
| I-07 | Hosting, DNS and TLS | Provider not selected | Budget, deployment access, existing URLs and recovery needs | Owner + implementation at 1.6; capacity sizing in 11.3.3 |
| I-08 | Formula tools | Standalone OSS editor/renderer candidates remain proposed | Real Word/LaTeX samples, macros and source applications | Owner supplies in 1.5.1; implementation evaluates in 1.5.2–1.5.4 |

No new provider, library or subscription is selected in 0.2. Selected services will be connected directly from the new application's appropriate frontend/backend boundary; credentials stay server-side where required.

## 5. Migration boundary

The intended flow is:

```text
Existing site's approved content/data exports and media originals
                         |
              Standalone validation/conversion/import
                         |
                  PostgreSQL + R2
                         |
               React UI <-> .NET API
                         |
          Direct Razorpay / agreed video-email-meeting services
```

Extraction occurs only to move data. The deployed platform must not read the old database for normal requests, proxy old LMS endpoints, redirect sign-in to WordPress, or depend on an old plugin license for course access.

Use source information only to preserve required meaning:

- Map old user IDs to new accounts and choose an independent password migration/reset approach after inspecting actual formats.
- Preserve purchase records and effective access separately; do not repurchase or recharge imported courses.
- Keep questions, options, marks and attempt context together; preserve original formulas and report unsupported conversion cases.
- Convert page-builder/shortcode content into the new supported content model instead of carrying executable plugin markup forward.
- Migrate or directly reconfigure approved media sources. Moving a thumbnail to R2 does not automatically migrate a video or establish protected streaming.
- Retain the existing database-structure checkpoint at 2.4.1. This map introduces no tables, mappings or entities.

The export format and extraction method remain open until source information is available. We do not need to install or purchase WordPress plugins for this planning step. Later extraction choices must respect the owner's independent-platform requirement.

## 6. Source unknowns and follow-up ownership

| ID | Unknown | Why it matters | Required follow-up and owner |
|---|---|---|---|
| U-01 | Exact old LMS/commerce storage layout and custom fields | Export completeness and historical interpretation | Source maintainer/owner provides relevant source metadata or exports during 0.4; table structure requested at 2.4.1 |
| U-02 | Custom behaviors and scheduled automations | Rebuilding visible screens alone may omit access/price/notification rules | Owner describes exceptions in 0.3; source maintainer supplies relevant code/configuration only if needed to explain them |
| U-03 | Old payment processor and any recurring agreements | Historical references and future renewal handling may need separate migration | Owner confirms in 0.3/0.4; do not assume old subscriptions transfer to Razorpay |
| U-04 | Video, meeting, email and image origins | Correct replacement integration, ownership and operational cost | Owner supplies service names/usage in 0.3/0.4; implementation reviews corresponding I-03–I-06 |
| U-05 | Available exports and completeness of attempt/progress/award history | Determines migration coverage and exceptions | Owner/source maintainer supplies sample availability in 0.4; importer feasibility checked after schema review |
| U-06 | Redirects, embedded asset URLs and public publishing dependencies | Prevents broken content or ongoing calls into the old site | Owner/source maintainer supplies route/content inventory in 0.4; implementation validates in 4.7/11.5 |

These are assigned questions, not verified findings. No installed-plugin version or custom-code inventory is claimed. We can review the replacement boundaries now; the unresolved source details must be resolved before the affected migration/integration work is accepted.

## 7. Later independence verification

Add these checks to the relevant implementation and release reviews:

- Runtime package, configuration and deployment review finds no WordPress/PHP/plugin requirement.
- Public pages, authentication, catalog, authoring, enrollment, quizzes and support operations run against the new API/database.
- Network inspection finds no required calls to WordPress REST/admin/AJAX/LMS endpoints or old media paths. Approved external media services are identified explicitly.
- A controlled staging test makes the legacy source unavailable and exercises the critical user journeys successfully. Do not disable the real legacy site just to run this test.
- Staff can operate the agreed features without logging into WordPress.
- Migration imports can be rerun from approved source exports with no ongoing source dependency; cutover keeps the agreed one-writer rule.

These are future acceptance checks, not tests completed in this documentation subphase.

## 8. Review outcome requested

Review that R-01–R-18 assign the required capabilities to standalone replacements, I-01–I-08 correctly separate confirmed services from undecided ones, and U-01–U-06 have appropriate follow-up ownership.

The no-WordPress requirement is confirmed. The owner accepted progression to **0.3 — business rules** on 15 October 2026. This does not certify unknown legacy configuration or choose undecided providers; see the tracker for current work.
