# Compact Blue — component refinement

**Updated:** 16 October 2026  
**Status:** Accepted in 2.1.3 through owner “great go ahead” on 16 October 2026  
[Live preview](http://127.0.0.1:3000/ui-preview?phase=2.1.3&revision=refined-components) · [Review](../delivery/reviews/2.1.3-shared-ui.md) · [Tokens](UI-DESIGN-TOKENS.json)

## Owner clarification

Compact means refined component proportions, font sizes and alignment. The owner explicitly rejected the wide left/right margins in the first Compact Blue preview. Page-height reduction is no longer used as the design acceptance criterion. The preview now uses the available width with 12–24px edge gutters. Product layout shells remain the next separate leaf, 2.1.4.

The blue/slate/charcoal palette from the seven owner references is retained in this refinement: #0054A8 light primary, #007ACC dark actions, #79B8FF dark links/focus, white/cool-gray light surfaces and #181818/#222222/#2B2B2B neutral dark surfaces. The references are inspiration, not shipped assets or instructions. No new fonts, packages or paid assets were added.

## Shared component specification

| Area | Current proposal |
|---|---|
| Page | Fluid width, 12–24px edge gutters, consistent left/right alignment; no centered narrow container |
| Typography | Local Segoe UI/system sans; 13px body/buttons/desktop fields, 15px card/modal titles, 20–24px page heading; labels weight 500, emphasis 600 |
| Controls | 32px desktop minimum height, 6px corners, 16px icons, tighter internal padding; controls grow for wrapping/zoom |
| Touch | 44px minimum controls on narrow or coarse-pointer devices; 16px field text; visible labels and feedback preserved |
| Cards | 16px padding/gaps, 8px corners, restrained borders/shadows; decorative numbered eyebrows removed from the preview |
| Forms | Labels and input edges align; paired inputs at 1120px+, stacked within tablet columns; white/charcoal input surfaces, no extra heavy hover inset |
| Tabs | Underlined active tab replaces nested boxed tab styling; focus and disabled states remain available |
| Feedback | Severity and heading share a wrapping line; consistent text spacing; no color-only meaning |
| Dialog | Maximum 440px wide, aligned title/Close action, header divider and 12px content spacing |
| Drawer | Maximum 352px wide, viewport/safe-area containment, shared dialog behavior |
| Responsive layout | One column below 768px, two columns on tablets/desktops; field pairing waits until sufficient column width |

This is component density, not CSS zoom or a transform. Larger course reading material and exam content will receive task-specific typography when those screens are implemented.

## Verification

Build, strict types, lint and formatting checked. [Shared UI evidence](SHARED-UI-CHECKS.json) records viewport overflow, balanced gutters, paired-field/label alignment, compact desktop modal geometry, keyboard/form interactions, contrast and tablet touch checks. [Appearance evidence](UI-THEME-REGRESSION-CHECKS.json) records saved/System preferences, fallback rendering, blocked storage and theme contrast.

The viewport matrix includes 320, 360, 390, 768, 820, 1024, 1440 and 1920px in both themes, plus 200% text reflow and narrow landscape modals. Touch tablets are checked at 768×1024 and 1024×768 in both modes. Captures explicitly record which were visually inspected. These are Chrome viewport/media emulation checks, not physical-device, Safari/Firefox or screen-reader certification.

[Earlier page-height evidence](COMPACT-DENSITY-CHECKS.json) and its captures are archived as historical. They do not describe this revision. No backend/schema, package, provider, deployment or phase progression was added. Shared UI 2.1.3 is accepted. Responsive layout shells are reviewed separately in 2.1.4.
