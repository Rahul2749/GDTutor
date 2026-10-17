# Shared UI foundation — 2.1.3

**Status:** Accepted through owner “great go ahead” on 16 October 2026  
**Updated:** 16 October 2026  
[Review](../delivery/reviews/2.1.3-shared-ui.md) · [Progress](../delivery/PROGRESS.md) · [Component API](../../apps/web/src/components/ui/README.md)

## Current implementation

The accepted current visual foundation is [Compact Blue](OVERALL-DESIGN-REVISION.md), refined after the owner clarified that compactness means smaller components and type with consistent alignment, while retaining a fluid page width. [Palette/density roles](UI-DESIGN-TOKENS.json) define blue/slate accents, white/gray light surfaces and neutral charcoal dark surfaces. Previous Focus Workspace and Student Studio iterations remain historical, not current acceptance.

Reusable buttons, native input/select/textarea/checkbox, cards, keyboard tabs, notices/badges, loading skeletons, empty states and dialog/drawer wrappers use these shared roles. Desktop controls are at least 32px high; mobile/narrow/coarse-pointer controls stay at least 44px and field text is 16px. Related sample fields align side by side when space permits. Compact styling does not use CSS zoom or hide validation guidance.

The [review route](http://127.0.0.1:3000/ui-preview?phase=2.1.3&revision=refined-components) is excluded from indexing and contains local sample interactions. Its concise toolbar/introduction and component arrangement demonstrate density, not production public/student/staff navigation (2.1.4).

| Source | Responsibility |
|---|---|
| `apps/web/src/components/ui/` | Shared typed primitives/CSS; no feature or route imports |
| `apps/web/src/app/(public)/ui-preview/` | Local sample state, validation, field composition and preview layout |
| `apps/web/src/styles/tokens.css` | Light/dark color roles, typography and responsive density |
| `tools/frontend/verify-ui.cjs` | Production HTTP interaction/contrast/density checks and captures |
| `tools/frontend/verify-appearance.cjs` | Preference/fallback regression against the current palette, with separate report paths |

## Review walkthrough

1. Switch Light/Dark/System and resize. Inspect component proportions, text alignment and fluid page gutters. [Earlier page-height measurements](COMPACT-DENSITY-CHECKS.json) are historical.
2. Try enabled action styles; disabled/busy examples remain unavailable. Icons are decorative and actions remain text-labelled.
3. Submit an empty form, inspect linked errors and first-invalid focus, try an invalid email, correct it, and reset. All feedback is local; no data is sent.
4. Use Left/Right/Home/End on tabs. Disabled tabs are skipped; Notes retains local input when hidden.
5. Open dialog/drawer: Close starts focused, Tab/Shift+Tab wrap, Escape and visible actions close, background is inert/scroll-locked, and focus returns to the mounted trigger.
6. Inspect notices, pills, loading and empty states; color supplements meaningful words. Reduced motion stops spinner/skeleton animation.

## Component decisions

Buttons default to type button; consumers explicitly opt into submit/reset. Busy disables activation and exposes aria-busy. Fields use stable IDs, visible labels and linked hints/errors while preserving native required/type/autocomplete/disabled/read-only semantics. Client sample validation is not a server/business contract.

Tabs follow the [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) with automatic activation only for immediate local content. Inactive panels stay mounted and hidden. Modal layers use [native dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) with explicit boundary wrapping for the [modal keyboard pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Parent state controls opening/closure; backdrop clicks do not silently discard work. Complex portals, shadow-DOM/editor widgets and nested modal flows need integration-specific focus tests.

## Evidence and limitations

[Shared checks](SHARED-UI-CHECKS.json): 41 pass, 28 button contrast/state pairs meet 4.5:1. [Theme regression](UI-THEME-REGRESSION-CHECKS.json): 29 checks and 34 token pairs pass, preserving historical [2.1.2 evidence](APPEARANCE-CHECKS.json). Both include source/capture hashes; representative desktop/mobile/tablet/modal captures inspected, with per-capture review flags. Tests cover eight viewport widths, 200% text reflow, landscape modal fit, wide touch control policy, keyboard/focus/validation/recovery, reduced motion, saved/System/storage/cross-tab and no-script/initial rendering. Normal contexts show no page/console errors, external requests or write requests.

Chrome viewport/media emulation is not physical-device, other-engine, screen-reader or full accessibility certification. Native controls vary by platform. No backend, account preference synchronization, API client, persistence, providers, production editor or 500-student capacity claim is included.

## Reproducing checks

From `apps/web` run lint, format:check, typecheck, build and start; keep type generation/build sequential. From the repository root run `node tools/frontend/verify-ui.cjs`, using PLAYWRIGHT_MODULE/CHROME_PATH as needed and PREVIEW_URL for the running origin with trailing slash.

For `node tools/frontend/verify-appearance.cjs`, set APPEARANCE_REPORT=`docs/design/UI-THEME-REGRESSION-CHECKS.json` and APPEARANCE_CAPTURE_DIR=`docs/design/previews/shared-ui/theme-regression` to preserve historical evidence. Reruns reset visual-review flags; inspect new captures before setting them. Theme assertions use the current palette register rather than historical color literals.

Owner authorized 2.1.4 after accepting this leaf. Mandatory database input gate remains 2.4.1. Work remains local; last pushed checkpoint is 4d064ee.
