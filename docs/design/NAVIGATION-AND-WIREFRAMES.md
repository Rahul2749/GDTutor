# Subphase 1.2 — Navigation and representative wireframes

[Documentation index](../README.md) · [Review record](../delivery/reviews/1.2-navigation-wireframes.md) · [Progress](../delivery/PROGRESS.md)

**Prepared:** 15 October 2026  
**State:** Accepted navigation baseline through the owner's "ok great, continue" after the 1.2 handoff on 15 October 2026.  
**Visual baseline:** Focus Workspace, carried forward from the selected 1.1 preview and the owner's subsequent "go next". Teal actions, warm neutral surfaces, violet secondary accents and editorial headings; [theme tokens](THEME-TOKENS.json).

## Review scope

Four connected wireframes establish public discovery and the student learning workspace. The conversation preview has a Screen picker, sample-state controls and Light/Dark/System appearance. They are review controls; Sample state and Course access will not be student settings. All course titles, prices, validity periods, progress and schedules are illustrative, not imported catalog or policy values.

This item specifies information hierarchy and navigation. It does not implement React/.NET, account permissions, enrollment, checkout, video playback, question authoring or a working class service. Lesson/quiz design is 1.3; staff design is 1.4. Source migration and the database-input gate at 2.4.1 remain unchanged.

## Navigation proposal

Use one shared header with GD Tutor branding, Home, Courses and My learning. Appearance stays reachable in the header. Menu reveals grouped secondary destinations. On narrow screens the three primary links move into that same menu: **one disclosure menu, without a second bottom navigation bar**. The student workspace also has local navigation for Overview, My courses, My classes and More tools; these describe learning sections rather than duplicate global navigation.

The preview allows My learning to open a synthetic signed-in workspace. In the application a visitor must sign in first; the menu must reflect the actual authentication state. Sign in/register is currently a menu destination; authenticated account controls replace it. Staff workspace switching is permission-dependent and will be designed in 1.4, rather than displaying staff capabilities to all students.

| Group | Proposed destinations | Entry and visibility |
|---|---|---|
| Global primary | Home, Courses, My learning | Desktop header; same links in mobile menu. My learning requires an account in production |
| Discover | Classes 8–12; JEE/NEET/MHT-CET; test series; classes/batches | Catalog goal shortcuts plus future public class listing |
| Learning workspace | Overview, My courses, My classes | Student sections; only the learner's own records |
| More tools | Quiz history/results, private notes, wishlist, course discussions, certificates | Student workspace; course/attempt eligibility still enforced by the API |
| Account | Profile, billing/orders, security, appearance/accessibility, sign out | Authenticated account menu/settings; details remain in account implementation |
| GD Tutor | About, Blog, Help/FAQ, contact/counselling enquiry | Public secondary navigation; counselling is an enquiry, not an assumed booking system |
| Footer | Help, Privacy, Terms and refunds | Public/legal navigation available on all four representative screens |

The menu sample groups related links to keep it short. Group labels such as Notes & wishlist and Account & billing lead to the relevant tools/settings in production; they do not merge private/public data or imply a shared permission. Detailed resource, announcement, review, calendar and award capabilities remain in their feature phases, reachable from course/workspace context.

## Proposed route and access contract

Paths below are design proposals, not created routes or an accepted framework decision. Existing URL preservation/redirect mapping is still required. Prototype clicks change local views; they do not establish browser Back, deep linking, authentication or network behavior.

| Path/group | Purpose | Access and return behavior |
|---|---|---|
| `/` | Public home | Public |
| `/courses` with search/goal/access query parameters | Catalog and test-series discovery | Public; production should preserve filters, page and return position |
| `/courses/{slug}` | Published course detail, curriculum and current offer | Public metadata/designated preview; protected content requires entitlement |
| `/classes`, `/about`, `/blog`, `/faq`, `/contact` | Supporting public discovery/help | Public; only navigation destinations in this item |
| `/sign-in`, `/register`, `/account/recovery` | Account entry and recovery | Sanitize internal return targets; no open redirects |
| `/learn`, `/learn/courses`, `/learn/classes` | Student workspace sections | Sign-in required; production should restore the intended internal destination |
| `/learn/attempts`, `/learn/notes`, `/learn/wishlist`, `/learn/certificates` | Secondary student tools | Account ownership and release/eligibility checks |
| Course discussion/resource/announcement destinations | Course-context tools | Entitlement and moderation policies, not unrestricted public routes |
| `/account` and billing/security/preferences sections | Student account operations | Sign-in, ownership and sensitive-action controls |
| Checkout/order/status destinations | Purchase and payment recovery | Sign-in; backend prices and verifies payments. Separate 7.x delivery |
| Lesson/quiz destinations | Continue learning and practice | Entitlement/attempt validation; interaction design deferred to 1.3 |

The application must enforce authorization independently of visible navigation. Access-denied, unpublished/missing course, session expiry, loading cancellation and safe return behavior must be implemented and tested in their feature phases. No account or production API exists in this prototype.

## Representative screen structure

| Screen | Information order | Primary journey |
|---|---|---|
| Public home | Learning proposition → course/class actions → school/exam/test goals → featured free/paid courses → enquiry → footer | Home → goal shortcut or Explore courses → catalog |
| Catalog | Title → labeled search/goal/access controls → count and Clear filters → course cards → empty/loading/error region when needed | Search/filter → View course; no-result recovery keeps discovery reachable |
| Course detail | Breadcrumb → title/category/description/author → access panel → outcomes and collapsible outline on mobile; panel beside content on desktop | Understand offer and validity → correct enrollment/continue/support action |
| Student overview | Continue-learning action → My courses → upcoming online/offline sessions; local navigation exposes full courses/classes/tools | Resume learning, review access, find the next class or secondary tool |

Course cards expose category, title, short description, content summary, price and validity before detail. The four-course fixture has no pagination; server-side search, result sorting/pagination and larger-dataset behavior stay in 4.4. Card artwork is a placeholder treatment, not finalized R2 thumbnails. Final publication needs actual outcomes, curriculum, instructor and commercial text; no invented testimonials, student counts or ratings are used.

The course outline distinguishes a designated introduction preview from enrollment-required learning. It is not a complete source syllabus. The learner's active course shows progress and an expiry date; free lifetime access is visibly different. Exact time-bearing expiry terms belong in the detail/order views in the site's timezone. An expired course remains in My courses with history retained and a Review access action. The workspace prioritizes continuing learning; complete counts/history/completed-course filters and accurate definitions remain required in 5.2.

## State and action review

| Context | Proposed visible behavior | Preview behavior / later boundary |
|---|---|---|
| Catalog search/goals/access | Explicit Search button or Enter; result count; Clear filters | Filters the synthetic fixture locally; no external requests |
| Catalog no results | Clear explanation and Clear filters | Recovers to all four sample courses |
| Catalog loading/error | Readable loading message; retry after error; preserve filters | Simulated by Sample state; successful retry restores results |
| New student | Explain where courses/classes will appear; Explore courses action | Empty workspace returns to catalog |
| Workspace loading/error | Do not show fabricated zero totals or overwrite progress; retry | Simulated only; persistence is not demonstrated |
| Paid visitor | Price, one-time purchase, activation/validity terms and Buy course | Navigation boundary shown outside product; no Razorpay operation |
| Free visitor | Free, lifetime terms, account required, Enroll for free | Navigation boundary only; free is not equivalent to all lessons public |
| Active enrollment | Enrolled, exact sample validity, Continue learning | Leads to the 1.3 lesson-player boundary |
| Expired access | Retained history; Review current offer without automatic charging | Can inspect the current paid offer; does not reactivate access |
| Payment processing | Wait for verification; do not pay again; processing action disabled | No client-side paid access grant or duplicate checkout action |
| Access removed | Protected learning unavailable; Contact support | No attempt to renew or override a revocation locally |
| Online/offline sessions | Delivery type, date, time/timezone, eligible class context | Illustrative rows only; no assumed meeting provider or offline check-in workflow |

The normal-expiry exception for an already valid quiz attempt remains R-12; this item does not design or change the quiz runner. Renewals, receipts, refunds, grants and history retain the accepted business-rule boundaries.

Secondary navigation and checkout/player/support destinations report a local review notice rather than fabricate a completed operation. Public classes and help remain discoverable, but their destination screens are outside these four wireframes. No message, payment, enrollment or support request is sent.

## Mobile and interaction details

- Header primary links collapse into Menu below 900px; narrow screen content stacks below 600px. Native select/button/link controls remain at least 44px high in the checked product layouts. Mobile inputs use 16px text.
- Menu uses `aria-expanded`/`aria-controls`; Escape closes it and returns focus to its trigger. It expands in document flow, so it does not cover quiz content or require a modal focus trap. Navigation closes it after a selection.
- Course detail puts introduction, access panel and curriculum in the same reading/keyboard order used on mobile. Desktop CSS places enrollment beside the content; no fixed purchase strip overlays the page.
- Workspace section buttons use current-page indication. They are navigation controls, not a custom ARIA tab widget requiring arrow-key behavior. Native curriculum disclosures support keyboard and touch.
- Essential labels and state explanations are visible without hover. Colors use the selected theme's semantic pairs. Native focus indication is preserved and reduced motion is respected.
- Review-state restoration is supported through the conversation host. Actual application theme persistence, initial-render flash prevention, browser history, deep links, full zoom/high-contrast/screen-reader coverage and API authorization are future implementation checks.

## Captures and verification

| Screen | Mobile 390px | Desktop 1024px |
|---|---|---|
| Home | [Light](previews/navigation/nav-home-light-390.png) · [Dark](previews/navigation/nav-home-dark-390.png) | [Light](previews/navigation/nav-home-light-1024.png) · [Dark](previews/navigation/nav-home-dark-1024.png) |
| Catalog | [Light](previews/navigation/nav-catalog-light-390.png) · [Dark](previews/navigation/nav-catalog-dark-390.png) | [Light](previews/navigation/nav-catalog-light-1024.png) · [Dark](previews/navigation/nav-catalog-dark-1024.png) |
| Course detail | [Light](previews/navigation/nav-course-light-390.png) · [Dark](previews/navigation/nav-course-dark-390.png) | [Light](previews/navigation/nav-course-light-1024.png) · [Dark](previews/navigation/nav-course-dark-1024.png) |
| Student overview | [Light](previews/navigation/nav-dashboard-light-390.png) · [Dark](previews/navigation/nav-dashboard-dark-390.png) | [Light](previews/navigation/nav-dashboard-light-1024.png) · [Dark](previews/navigation/nav-dashboard-dark-1024.png) |

The [browser report](NAVIGATION-CHECKS.json) records **259 passing layout observations**, interactions at all seven widths, **26 observed text/background pairs meeting 4.5:1**, valid host-state restoration, zero runtime errors and the source checksum. Checked product widths are 320, 360, 390, 736, 768, 1024 and 1440 CSS pixels in both themes. Captures are review evidence, not finalized page designs. Offline QA blocks external resources, so host-supplied icons are not verified; visible labels carry essential actions. These checks do not establish complete accessibility, authorization, backend capacity or production readiness.

Feature trace: PUB-01/02/03 and J01 cover discovery/detail; ENR-01/02/03/04 and J02/J03 inform access wording; LRN-01/03 and J04 inform the student workspace; class/support tools are navigation entry points for J08/J09. This review does not close their later implementation items or remove features from the accepted backlog.

## Review boundary

Review the public and student navigation labels, page hierarchy, mobile course access placement and free/paid/expired/processing wording. Changes stay in 1.2. After acceptance and progression authorization, the next item is **1.3 — lesson player and quiz flow in mobile/desktop, light/dark**.
