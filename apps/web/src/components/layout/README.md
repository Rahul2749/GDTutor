# Shared layout pieces

`WorkspaceShell` supplies public/student/staff composition: brand, typed links, grouped navigation, appearance, one compact-width Menu, main/skip target and footer. Pass kind, label, brandHref, primary links, navigation groups, footer links and children. Instructor/admin visibility is provided by the caller; it does not grant access.

Shared code imports no routes/features or fixture data. Current route composition is isolated under `(preview)/layout-preview` for 2.1.4 review. Production authentication/routing will compose the same shell when those leaves are authorized. Use one shell/AppearanceSelect per document. Menu resets on pathname change; native links preserve history. See `docs/design/RESPONSIVE-LAYOUT-SHELLS.md` for breakpoints, checks and limitations.
