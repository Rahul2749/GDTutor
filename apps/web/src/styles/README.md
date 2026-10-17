# Shared styles

`tokens.css` contains semantic Compact Blue light/dark values, proposed after the overall-design feedback in 2.1.3; current palette is in `docs/design/UI-DESIGN-TOKENS.json`. It also defines shared typography, spacing, radii, focus/motion aliases. `globals.css` imports tokens and supplies the reset, body styles, native control inheritance, focus and reduced-motion behavior. Root layout loads it once for all routes.

Page/feature CSS modules use semantic variables; do not duplicate hard-coded light/dark colors or hide layout overflow globally. Preserve images and provider content rather than inverting them. The no-script media rule must stay consistent with the explicit dark palette.

Appearance behavior lives in `src/lib/appearance.ts` and the theme-specific selector, introduced in 2.1.2. Full component styles/states remain 2.1.3 and subsequent features.
