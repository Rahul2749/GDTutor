# Theme foundation — 2.1.2

**Prepared:** 16 October 2026 · **State:** Accepted through the owner’s subsequent “go for next phase”; future feature/device gates remain.

[Progress](../delivery/PROGRESS.md) · [Review](../delivery/reviews/2.1.2-theme-foundation.md) · [Preview](http://127.0.0.1:3000/) · [Browser evidence](APPEARANCE-CHECKS.json)

**Current implementation note:** The owner requested overall design improvements during 2.1.3. [Compact Blue](OVERALL-DESIGN-REVISION.md) is the current visual proposal; this document and APPEARANCE-CHECKS.json preserve the accepted 2.1.2 handoff. Current behavior/palette checks are in [UI-THEME-REGRESSION-CHECKS.json](UI-THEME-REGRESSION-CHECKS.json).

## Delivered behavior

The frontend now uses the accepted **Focus Workspace** palette: teal primary, violet secondary, warm neutral light surfaces and forest dark surfaces. Common CSS supplies box sizing/reset, body/display typography, spacing, radii, native control font inheritance, visible focus, selection colors, responsive media limits and reduced-motion overrides. A small native appearance selector demonstrates **Light, Dark and System**. It is a theme-specific control, not the shared component suite scheduled in 2.1.3.

| Source | Responsibility |
|---|---|
| [tokens.css](../../apps/web/src/styles/tokens.css) | Semantic light/dark color pairs, typography/spacing/radii/focus/motion values; System CSS fallback |
| [globals.css](../../apps/web/src/styles/globals.css) | Shared reset/base typography and accessible focus/media/motion behavior |
| [appearance.ts](../../apps/web/src/lib/appearance.ts) | Typed preference, validated storage, early initialization and device/cross-tab subscriptions |
| [AppearanceSelect](../../apps/web/src/components/appearance/appearance-select.tsx) | Labelled native selector, hydration readiness and persistence-failure feedback |
| [Root layout](../../apps/web/src/app/layout.tsx) | Loads shared CSS and the fixed early script for every route |

The original [design token snapshot](THEME-TOKENS.json) remains the baseline. Production tokens use `secondary` rather than its historical violet `teal` slot name. All 14 mapped color roles match the accepted source values in both themes. Additional success/danger/disabled/focus aliases have checked opaque contrast pairs; their eventual component states still need testing. Body copy uses a readable 16px base, with 14px support text and system fonts; no font requests or packages are added.

## Preference and initial rendering

First visit defaults to **System**, without forcing a stored choice. The browser's `prefers-color-scheme` determines the palette. Selecting a mode stores `gdtutor.appearance` in localStorage; only `light`, `dark` and `system` are accepted. Explicit choices override device changes, while System follows them live. Other tabs receive preference changes, removal and storage-clear updates.

A fixed trusted inline script runs in the document head before visible content and sets only root `data-appearance`/`data-theme` attributes. It never interpolates stored text as executable code. Root-only `suppressHydrationWarning` covers those deliberate pre-hydration attribute changes; it does not hide mismatches throughout the tree. The selector uses React's external-store subscription with a stable server snapshot and remains disabled until hydration is ready. Verified saved Dark still renders correctly when application JS bundles are blocked.

If storage reads are blocked or a value is invalid, default safely to System. If writes fail, apply the selected mode in memory for the visit and announce that it could not be saved; an old stored choice does not override this temporary selection. Reload then falls back to the actual available stored/System preference. With JavaScript disabled, CSS follows the device palette and the inactive selector stays disabled. Appearance is a browser preference only; account settings/synchronization remain Phase 3. No authentication data is stored here.

The eventual Content Security Policy must allow this exact bootstrap script through a hash or request nonce and account for framework scripts. No broad `unsafe-inline` exemption is introduced here. CSP/deployment integration remains a security/deployment gate. Prefer a hash-compatible static source unless reviewed hosting needs require a nonce.

## Verification and limits

The production build passed; lint, formatting and strict route/type checks are recorded in the review. Chrome checked 29 theme behaviors and 34 opaque contrast pairs. Six widths (320/360/390/768/1024/1440), both themes, 200% base-text reflow, keyboard selection/focus, reduced motion, forced colors, cross-tab updates, invalid/read-blocked/write-blocked storage and no-script fallback passed. No page/console errors or external requests occurred in ordinary test contexts. The deliberately blocked-bundle scenario is isolated from ordinary network/error observations.

Four captures are reviewed: [light mobile](previews/theme-foundation/light-390.png), [dark mobile](previews/theme-foundation/dark-390.png), [light desktop](previews/theme-foundation/light-1440.png) and [dark desktop](previews/theme-foundation/dark-1440.png). Initial testing exposed a grid minimum-width issue, which was corrected and retested; no whole-page overflow is hidden with an overflow suppression rule.

This is desktop Chrome viewport/media emulation, not certification of every browser, physical device or screen reader. The early-script test establishes pre-hydration palette application, not a filmstrip guarantee on every network/device. Native browser chrome, PDF/video/images and future chart/editor/quiz components are not blindly recolored or declared tested. Their theme/accessibility checks remain their implementation leaves.

Reproduce browser verification with [the helper](../../tools/frontend/verify-appearance.cjs) from the repository root, supplying an admitted Playwright module path through `PLAYWRIGHT_MODULE` and installed Chrome path through `CHROME_PATH`; `PREVIEW_URL` defaults to port 3000. The helper uses the existing workspace test runtime, not a new frontend dependency. Preserve historical scaffold/editor reports when rerunning it.

Primary references: [React external stores/server snapshots](https://react.dev/reference/react/useSyncExternalStore), [React hydration escape-hatch limits](https://react.dev/reference/react-dom/client/hydrateRoot), [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia), [cross-tab storage events](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event) and [native color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme). API documentation supports the approach; local evidence establishes only the observed outcomes.

## Git checkpoint and next boundary

Before implementation, the owner-requested reviewed checkpoint was pushed to `main`: [4d064ee](https://github.com/Rahul2749/GDTutor/commit/4d064ee2bc211340ed37198965ec47a997cba68b). Private exports/captures, dependencies and build output were excluded. This new theme work remains local for review; it is not part of that checkpoint.

No dependencies, paid tools, provider calls, backend or schema work were added. Next proposed leaf is **2.1.3**, shared UI primitives; no automatic progression.
