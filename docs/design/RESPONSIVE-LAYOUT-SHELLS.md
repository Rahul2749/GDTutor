# Responsive layout shells — 2.1.4

**Status:** Accepted through the owner’s subsequent progression instruction · 16 October 2026  
[Preview](http://127.0.0.1:3000/layout-preview) · [Review](../delivery/reviews/2.1.4-responsive-shells.md) · [Checks](RESPONSIVE-SHELL-CHECKS.json)

## Result

One configurable shared shell supplies public discovery, student learning and staff workspaces. It uses the accepted Compact Blue tokens and refined 2.1.3 components: fluid content width, compact desktop controls and comfortable touch controls. A separate administrator fixture demonstrates additional navigation without claiming real permissions.

The preview pages live under `/layout-preview/{area}/{section}`. These isolated routes deliberately contain sample content; production `/learn`, `/staff`, authentication and business APIs are still future implementation. There are 34 linked placeholder destinations across four fixtures, plus the review hub. Footer help/legal links also resolve to placeholders. Public home/course discovery, student overview and staff course lists are layout examples, not completed feature screens.

| Area | Structure |
|---|---|
| Public | Brand, Home/Courses/My learning header, grouped secondary Menu, fluid main content and footer |
| Student | Shared header, Overview/My courses/My classes, grouped learning tools/account sidebar; sidebar moves into one Menu below 900px |
| Instructor | Teaching and assigned-content navigation, media/discussions and switch-to-learning; no administrative operation links |
| Administrator fixture | Same staff shell with learners/access, orders/refunds and site/permissions entries |

The fixture selector sits above the product shell and is labelled as a preview with no account session. It is not an account role-switching feature. Production role/assignment checks belong to the API and account phases.

## Responsive and interaction decisions

- Below 900px, primary and local navigation share one in-flow disclosure Menu. There is no competing bottom bar or overlay. Escape closes the panel and returns focus to Menu; choosing a destination closes it. Native links retain browser Back/deep-link behavior.
- At 900px+, the student/staff sidebar is 208px wide. The content column uses remaining space with 12–24px gutters. Long navigation scrolls with the page.
- Content cards reflow from one to two columns and, where space allows, three. Context panels move below the main content on tablets. Course calls to action align at card bottoms despite unequal title lengths.
- Narrow/coarse-pointer controls keep 44px minimums. The appearance selector remains available in every shell; no fixed header/footer covers content or a soft keyboard.
- One main landmark, one page h1, labelled navigation, exact current-page links, a keyboard skip link and native disclosures support orientation. Status text supplements color.
- Synthetic long course titles, English reading text and a long unbroken identifier exercise wrapping. Staff tables retain semantic headers/caption inside a labelled, keyboard-focusable local horizontal scroll region.

## Verification

Production build, strict types, lint and formatting pass. The [shell report](RESPONSIVE-SHELL-CHECKS.json) records 90 passing checks: four fixtures in both themes at 320/360/390/768/820/1024/1440/1920px, menu state/dismissal, selection/Back/deep links, linked destinations, active navigation, scope differences, local table overflow, 200% base-text reflow, skip focus and touch tablets at 768×1024 and 1024×768. Twenty suite captures plus one expanded-mobile-menu capture are retained; per-capture flags identify visual inspection. No page/console errors, external requests or writes were observed in normal test contexts.

[Theme evidence](UI-THEME-REGRESSION-CHECKS.json) separately retains 29 checks and 34 contrast pairs. Shared UI code/palette are unchanged from accepted 2.1.3; the palette register now records acceptance. Browser QA uses Chrome emulation, not physical devices, other engines, screen readers, full accessibility certification or a capacity test.

## Source and reuse

`apps/web/src/components/layout/workspace-shell.tsx` accepts kind, workspace label, typed primary/grouped/footer links, brand destination and children. It owns only common navigation/appearance/layout behavior. It imports no routes or business features and performs no data fetch or access grant. The current pathname keys the disclosure state so route changes reset the menu. The shared CSS owns shell breakpoints and density.

The `(preview)/layout-preview` route group owns fixture navigation, labels, synthetic content and static parameters. Its Next route layout composes the review selector; route pages compose the shared shell. Exact fixture URLs are not hard-coded into shared layout code. Build-time static parameters restrict unknown fixture/section combinations.

No dependency or service was added, no live content imported, and no backend/entity/schema/identity/provider integration implemented. Next proposed leaf after owner review is **2.1.5 — API-client contracts, shared utilities and form/error conventions**. The database structure input gate remains 2.4.1. Work remains local at the prior pushed checkpoint 4d064ee.

Owner language clarification: English-only UI and previews; Hindi/Marathi text is excluded from current application copy. Historical source evidence remains preserved.
