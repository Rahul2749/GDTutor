# Dependency notices and admission

The exact version, source, publisher, integrity, license and dependency inventory is in the [frontend package register](../../docs/reference/FRONTEND-PACKAGES.json), with a separate [npm advisory report](../../docs/reference/FRONTEND-NPM-AUDIT.json). These reports are time-bound; recheck after updates and before release.

Direct runtime dependencies Next.js, React and React DOM are MIT. Development tools are MIT except TypeScript (Apache-2.0). No paid extension, subscription or external font is used.

The resolved optional Sharp/native image graph includes Apache/MIT/LGPL-3.0-or-later combinations; browser compatibility data includes CC-BY-4.0. No image pipeline is implemented by this scaffold, and optional packages for other operating systems are not all installed on this host. Preserve notices/attribution and review the applicable source/distribution/library-replacement obligations when packaging the actual deployment artifact. Upstream binaries/source are unmodified. Do not strip license files from a deployed/distributed dependency artifact. This short inventory does not replace the upstream license texts or certify compliance of a future release.

Next also ships compiled dependencies with their own license files. The register hashes 131 notice files in the installed Next distribution; package-level SPDX totals alone do not represent every bundled component. Include required notices in deployment/distribution packaging.

ESLint uses maintained core/TypeScript/React Hooks packages. The optional Next lint plugin was excluded because its dependency graph contains an [unpatched braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). Legacy React/JSX plugins with incompatible ESLint 10 peers are also excluded. No `--force`, `--legacy-peer-deps`, override or advisory suppression is used. Next-specific and JSX accessibility lint coverage is not claimed; reevaluate compatible maintained plugins and perform actual UI accessibility checks in the component/feature leaves.
