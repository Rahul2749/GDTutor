# Subphase 1.1 — Visual direction proposal

[Documentation index](../README.md) · [Review record](../delivery/reviews/1.1-visual-direction.md) · [Progress](../delivery/PROGRESS.md)

**Prepared:** 15 October 2026  
**State:** Accepted visual baseline. Focus Workspace was selected in the preview before the owner's "go next" on 15 October 2026 and is carried forward. Application scaffolding has not started.

**16 October follow-up:** Owner requested an overall design revision during 2.1.3. [Compact Blue](OVERALL-DESIGN-REVISION.md) is proposed in the running frontend. Original alternatives and their acceptance history below remain unchanged; the new direction awaits owner review.

## Two directions to compare

| Direction | Visual character | Recommendation |
|---|---|---|
| Learning Studio | Slate surfaces, indigo actions, teal learning progress, restrained amber highlights; sans-serif headings, rounded cards and desktop sidebar | Recommended: approachable for students, clear learning actions and consistent with the proposed accent family |
| Focus Workspace | Warm neutral surfaces, teal actions, violet secondary accents; editorial serif headings, horizontal desktop navigation and a quieter composition | Alternative if the owner prefers a more understated academic identity |

The interactive sample in the review conversation compares the same illustrative learning content in both directions. Appearance can switch between Light, Dark and System. Continue/Open course and View practice open local sample panels; Back closes them. Navigation and content are style context, not accepted wireframes or functioning application routes. The provisional wordmark/tagline is not a finalized logo.

## Proposed semantic colors

The [theme tokens](THEME-TOKENS.json) retain both palettes and record Focus Workspace as `selected_direction`. The comparison below preserves the original alternatives and recommendation; the selected Focus Workspace palette takes precedence for subsequent design. These are design values, not installed application CSS.

| Role | Learning Studio light / dark | Focus Workspace light / dark |
|---|---|---|
| Canvas | `#F8FAFC` / `#0B1220` | `#F8F7F3` / `#0D1918` |
| Surface | `#FFFFFF` / `#111C2E` | `#FFFFFF` / `#152624` |
| Body text | `#0F172A` / `#E5EDF8` | `#172C27` / `#EBF3EE` |
| Secondary text | `#475569` / `#A7B4C8` | `#4F625B` / `#A9BDB5` |
| Primary action | `#4F46E5` / `#A5B4FC` | `#0F766E` / `#5EEAD4` |
| Text on primary | `#FFFFFF` / `#10162B` | `#FFFFFF` / `#0D2420` |
| Learning/secondary accent | `#0F766E` / `#5EEAD4` | `#5B4AB4` / `#C4B5FD` |
| Small warm highlight | `#92400E` / `#FBBF24` | `#92400E` / `#FBBF24` |
| Control boundary | `#64748B` / `#8191A9` | `#667B71` / `#8BA296` |

Use primary with its paired button text; use secondary and warm text on their respective soft surfaces. Decorative card borders are separate from essential control boundaries. Color accompanies visible labels and progress values. Save/error, validation, disabled, feedback and other component states must be specified and verified during the component and screen subphases; this study does not complete those items.

## Typography, spacing and responsive behavior

- Body: locally available Segoe UI Variable/Segoe UI/system sans-serif. Learning Studio headings use the same family; Focus Workspace display headings use locally available Georgia/Times New Roman/serif. No external or paid fonts.
- Body baseline 14px; control text uses 16px on mobile. Supporting annotations are at least 11px. Headings adapt to available width; weights are 400 and 500.
- Spacing scale: 4, 8, 12, 16, 24 and 32px. Default content gap 24px, card radius 20px and button radius 10px. Optional preview controls explore radius/spacing; they are not proposed student account settings.
- Main actions have at least 44px height; sample mobile controls and navigation have 44px targets. Desktop columns stack on small screens and navigation becomes compact. Final navigation choices belong to 1.2.
- Light and dark use paired semantic variables rather than image inversion. System follows the preview host/system appearance. Explicit choice updates both directions. Preview state can be remembered by the conversation host; application account/local preference persistence and flash prevention remain future implementation checks.
- Use restrained purposeful motion and honor reduced motion. Preserve native focus indication and accessible control labels. Full keyboard/screen-reader and zoom testing still belongs to the relevant implementation and accessibility reviews.

## Review captures

| Direction | Mobile, 390px | Desktop, 1024px |
|---|---|---|
| Learning Studio | [Light](previews/studio-light-390.png) · [Dark](previews/studio-dark-390.png) | [Light](previews/studio-light-1024.png) · [Dark](previews/studio-dark-1024.png) |
| Focus Workspace | [Light](previews/focus-light-390.png) · [Dark](previews/focus-dark-390.png) | [Light](previews/focus-light-1024.png) · [Dark](previews/focus-dark-1024.png) |

## Verification and limits

- Existing Chrome with Playwright checked both directions in Light and Dark at 320, 360, 390, 736, 768, 1024 and 1440 CSS-pixel product widths: **28 combinations**, no detected horizontal overflow, visible text below 11px or JavaScript runtime errors. Mobile control minimum height was 44px at tested phone widths. Both alternatives used equal stage heights at each width to avoid carousel jumps.
- System appearance changes and lesson/practice panel open/close behavior passed at all seven widths. [Browser results](PREVIEW-CHECKS.json) record the observations. Eight captures are linked above; visual inspection covered representative mobile and desktop/theme combinations.
- [Contrast results](CONTRAST-CHECKS.json): **40 default token pairs passed**, using 4.5:1 for normal text and 3:1 for the checked control boundaries. Learning Studio light primary-button contrast is 6.29:1; Focus Workspace is 5.47:1. This is a calculation of specific opaque token pairs, not full accessibility certification or validation of arbitrary preview edits.
- QA used the skill's local sandbox wrapper, with external requests blocked. Host-supplied Lucide icons were not evaluated in this offline run, so screenshots contain their reserved spaces. Labels and essential actions remain visible. Verify icons in the conversation preview and again when implementing approved components.
- All student/course/progress/session data is synthetic and visibly labeled as a design sample. No real authentication, lesson playback, quizzes, payments, database, WordPress runtime or services are connected. No application dependency was installed; no paid tool or service was enabled.

## Owner review boundary

Focus Workspace is carried forward following the selected preview variant and the owner's progression instruction. **1.2** covers mobile navigation and representative public/student wireframes. Lesson/quiz and staff authoring flows retain their separate 1.3/1.4 reviews; this selection does not authorize application scaffolding.
