# Question authoring: editor, renderer and conversion decision

**Prepared:** 16 October 2026 · **Subphase:** 1.5.4 · **State:** Approach accepted through the owner's subsequent “ok go ahead”; production integration and compatibility gates remain. Effort allowances are reforecast inputs, not a new launch commitment.

[Progress](../delivery/PROGRESS.md) · [Review](../delivery/reviews/1.5.4-editor-selection.md) · [Paste evidence](../delivery/reviews/1.5.3-paste-roundtrip.md) · [Corpus and coverage](../requirements/QUESTION-AUTHORING-CORPUS.md)

## 1. Selection for implementation

Use **Tiptap OSS for rich text, MathLive for visual formula input, and KaTeX as the single standard student renderer**. Integrate a custom equation node retaining editable LaTeX and inline/display intent. Include KaTeX's bundled `mhchem` extension in the planned notation profile for chemical reactions and units, with the additional tests below before publication. Use the same approved rendering policy in teacher previews and student views.

Use **reviewed paste plus a separate DOCX import/repair workflow**. DOCX import is required conversion work under 6.1.3 because ordinary native Word paste is not established. Prefer an isolated open-source converter investigation using Pandoc's DOCX reader and structured output; adoption of an exact converter binary remains conditional on fixture, security and license admission. This is a concrete workflow/engine evaluation choice, not a claim that a production importer exists.

| Responsibility | Selected baseline | Why / boundary |
|---|---|---|
| Surrounding rich text | Tiptap OSS 3.32.0, with the matching core/React/ProseMirror packages | Existing six-region prototype supports structured editing and save/reopen. Production image/table extensions still require admission and tests |
| Visual formula input | MathLive 0.111.1, custom dialog integration | Existing visual field, source synchronization and touch palette; keep explicit source mode for notation the visual field does not preserve |
| Student and teacher math rendering | KaTeX 0.19.0, bundled `mhchem` planned | Existing renderer integration and retained source; six additional Node feasibility checks pass. No broad chemistry, accessibility or performance certification |
| Paste | Application-owned allowlisted normalization, review and atomic insertion | Gives source-specific diagnostics and prevents silently flattened equations; expand the current limited subset deliberately |
| DOCX import fallback | Separate bounded conversion job → structured content → manual mapping and repair | Native OMML needs document-aware conversion; converter output must be reconciled against source inventory |
| Outbound reuse | Copy LaTeX; compatible MathML only for verified configurations | Native Word structure worked for one broker-replayed fixture. Direct browser-to-Word remains unverified |
| Unsupported content | Retained original, clear issue, manual recreation or approved non-editable image | No silent numerical/sign changes or claims that an image is an editable formula |

Versions above freeze the researched baseline, not a requirement to install stale versions later. Recheck supported versions, advisories, notices and integration at production installation. React framework choice remains 1.6; the Vite experiment does not select the application framework.

## 2. Alternatives and reasons

**Tiptap OSS versus paid document add-ons:** select the open-source core and our own review pipeline. Tiptap documents its [Paste Handler](https://tiptap.dev/docs/editor/extensions/functionality/paste-handler) as a separate `@tiptap-pro` extension, and [its extension catalog](https://tiptap.dev/docs/editor/extensions/overview) distinguishes paid import/export features. These are not dependencies of this plan. Preserve the [MIT notices](https://github.com/ueberdosis/tiptap/blob/main/LICENSE.md); do not infer that every Tiptap feature is free.

**MathLive versus a source-only editor:** MathLive provides a visual math field and LaTeX interaction, matching the teacher requirement; a textarea alone would not meet it. Use the already inspected MIT package and [official field documentation](https://mathlive.io/mathfield/). Preserve source and show errors when visual editing cannot retain an expression. A field's ability to accept source does not establish that the student renderer supports it.

**KaTeX versus MathJax:** select KaTeX on the existing integration and test evidence. MathJax is a credible alternative with [TeX and MathML input](https://docs.mathjax.org/en/latest/basic/mathematics.html), but has not been benchmarked or integrated here. No claim that it is slower or incapable is justified. Reopen renderer selection if required corpus notation or accessible output fails and a bounded MathJax comparison demonstrates a better result. Keep renderer access behind an application adapter; do not load both engines on all student pages. Replacing the renderer would not fix absent clipboard payloads or the prototype's restrictive MathML parser.

**DOCX conversion:** Pandoc's [DOCX reader source](https://github.com/jgm/pandoc/blob/main/src/Text/Pandoc/Readers/Docx/Parse.hs) explicitly invokes an OMML reader; its [manual](https://pandoc.org/MANUAL.html) documents structured conversion and warns that conversions can lose formatting/content detail. This makes it the preferred engine to prove, not an automatic fidelity pass. It is free software with [GPL licensing](https://github.com/jgm/pandoc/blob/main/COPYING.md), rather than a permissive-license assumption. Review the exact release, bundled libraries, notices, redistribution/source obligations and deployment packaging before adoption. Keep it as a separate executable candidate; do not embed its library or copy Office stylesheets into the app. If its proof fails or obligations cannot be met, compare a maintained OSS OMML converter within 6.1.3 and review that decision before installation. A new hand-written general converter is not the default fallback.

## 3. Supported workflows and honest limits

“Verified” below refers only to recorded fixtures and configurations, not every app/version, language or subject. The owner's “consider all” remains the coverage objective; public substitutes are authorized and private originals are not a prerequisite for progression.

| Workflow | Evidence now | Production scope / acceptance condition |
|---|---|---|
| Visual entry and editable LaTeX in prompt, four options, explanation | Prototype verified for recorded fixtures | Production toolbar, validation, undo/redo, save/reopen and parity across all regions required in 6.1.1 |
| Explicit LaTeX and mixed text with agreed delimiters | Controlled browser transfers verified | Reviewed detection; single-dollar currency stays text; invalid source remains repairable |
| Rich HTML/basic Presentation MathML | Limited subset verified in controlled browser tests | Expand supported structures against corpus; arbitrary website HTML is never trusted |
| Native Word → browser paste | Actual Word formats captured, automated browser event had no usable data | Unverified. Qualify each native configuration before advertising it; offer linear LaTeX/source repair and required DOCX route |
| Native DOCX OMML equations | Nine research references: one subset acceptance, eight repair outcomes | Implement/reconcile real conversion in 6.1.3. Eight repair outcomes measure current normalization/reference gaps, not eight KaTeX rendering failures |
| Word Online/macOS, Google Docs, LibreOffice/WPS and other browser engines | Not verified | Representative real copy → review → edit → save → reopen → preview tests; keep unsupported routes explicit |
| Chemistry `\ce` / units `\pu` | Node feasibility with bundled extension passes; current UI has not enabled it | Add trusted extension to production renderer/profile; test MathLive preservation, visual results, paste and outbound representations. Current preview still rejects `\ce` |
| Hindi/other Indic, Arabic/RTL, CJK and mixed scripts | Limited synthetic Unicode evidence only | Test fonts, bidirectional text, punctuation, labels, caret and copy behavior; keep prose outside math nodes. No universal language certification |
| Tables, diagrams, source images | Current paste normalizer rejects these | Required production rich-content scope remains. Review table structure and safe R2 image/alt-text handling before acceptance |
| Image-only/PDF/OLE equations | No editable conversion established | Retain original; manually recreate or explicitly approve a non-editable image. PDF/OLE extraction must never activate embedded objects. OCR is not the baseline |
| App → Word | One MathML fraction/root fixture produced native Word structure through broker replay | Copy LaTeX plus configuration-qualified MathML. Test direct transfer, mathematical meaning and visual fidelity; do not label replay a direct clipboard pass |
| Full Word document export | Not implemented or selected | Separate future scope decision; source copy controls do not imply a DOCX export feature |

The current prototype's 92 browser observations demonstrate a limited editor/transfer baseline. They are not 92 Word interoperability passes. Native boundary details remain in the [1.5.3 review](../delivery/reviews/1.5.3-paste-roundtrip.md).

## 4. Content contract and teacher experience

Store versioned structured content, with paragraphs/lists and reviewed table/image nodes, explicit math nodes containing original editable LaTeX and display intent, and a notation-profile version. Keep prompt, answer options and explanation distinct; preserve option identity and correct-answer association through edits/imports. Generated HTML and MathML are derived representations, not the sole editable source.

This is a conceptual content contract, not a PostgreSQL table definition. Persistent entities, EF mappings and migrations remain gated by owner-provided prior tables/database details at **2.4.1**. Version changes need explicit migration/compatibility handling; do not overwrite old attempt question snapshots with later authoring changes.

Teacher flow: **enter/paste/import → review source and preview → map regions → repair issues → save editable draft → validate and publish**. In plain wording show what was preserved, converted or unsupported. Keep the source available when insertion fails and leave existing content unchanged. A teacher can cancel or repair without losing the draft. Do not guess question boundaries, option order, marks or answers from a Word document and save them as authoritative.

Unresolved conversion issues prevent publication of the affected question. Manual repair must preserve the original in the report and record the reviewed replacement. A consciously approved image is labelled non-editable with alt text; it is not counted as a formula-conversion success.

## 5. DOCX conversion scope and proof gate

Implement under **6.1.3**, after its own authorization. If useful, split that leaf into proof, normalization/mapping and hardening children before execution. No additional leaf is executed by accepting this selection.

1. **Preflight:** accept approved DOCX only; inspect ZIP entry count, compressed/uncompressed size, paths, XML and relationships with bounded parsers. Disable external entities, network relationships and embedded-object execution. Reject malformed, encrypted or over-limit content with diagnostics. Original files stay private with hash and retention policy; the R2 image decision does not automatically make raw source documents public or select their storage tier.
2. **Inventory:** count/order source paragraphs, tables, images, inline/display OMML and unsupported objects before conversion. Distinguish Strict and Transitional OOXML. Keep source locations so missing output can be traced.
3. **Convert in isolation:** prove an exact pinned OSS executable reading DOCX and producing a bounded structured AST, without Office, WordPress, shell-interpolated arguments, arbitrary filters/scripts, network access or TeX compilation. Restrict CPU, memory, duration, files and extracted media. The architecture review chooses the hosting boundary; no new deployed service is installed here.
4. **Normalize and reconcile:** map allowed rich content and equations into the application contract; validate each formula with the selected notation profile. Compare source and output counts/ordering and inspect meaning. A converter warning or missing node must create an unresolved issue, even if conversion exits successfully. Counts alone cannot prove equivalence.
5. **Review and map:** show source locations, normalized preview and issues; teacher maps prompt/options/explanation, fixes unsupported content and confirms answer association. Save only after ordinary server authorization/content validation. Do not automatically publish an imported document.
6. **Prove before admission:** run pinned public fixtures (all nine native equations, Strict and Transitional, plus explicit OLE handling), synthetic chemistry/mixed-script/tables/images, adversarial ZIP/XML/resource cases and available teacher examples. Each source math/object must have a verified editable result or a visible unresolved/approved-image outcome. Compare source/result visually as well as structurally, then edit, save and reopen. If proof fails, retain the files/report and review the converter alternative; no paid service or hidden Office runtime fallback.

No production compatibility percentage or throughput forecast is available yet. Public equation files establish useful notation cases, not complete educational documents or every Word build.

## 6. Security, mobile, accessibility and performance gates

- Validate schema, allowed nodes/attributes, commands, ownership and limits independently at the server boundary. Client success is not sufficient. Treat converter output and retained source as untrusted; render diagnostic text safely.
- Use a fixed reviewed notation profile. Disable resource/HTML commands, user macro definitions and arbitrary package loading. Preserve unsupported source for repair. Keep `trust: false`, bounded expansion/size and explicit errors; [KaTeX security guidance](https://katex.org/docs/security) describes these controls and safe error handling. Prototype limits (4,000 formula characters, 120,000 draft characters, expansion 500, size 20) are experiment bounds; validate production limits against corpus and load tests before acceptance.
- Use the bundled trusted `mhchem` extension, not teacher-supplied scripts. Official [extension documentation](https://github.com/KaTeX/KaTeX/blob/main/contrib/mhchem/README.md) describes `\ce`/`\pu`; the installed file includes MIT adaptation and Apache-2.0 upstream notices. Retain both. Enabling it does not permit arbitrary TeX or structural-chemistry drawing packages.
- Lazy-load teacher authoring code when needed; keep Tiptap/MathLive off student-only routes. The prototype's approximately 502 KB gzip authoring JavaScript is not the production budget. Measure initial page load, formula rendering and long-exam navigation on representative mobile hardware; avoid eagerly rendering every off-screen question.
- Use the same notation profile in authoring preview, publication validation and student rendering. Decide the trusted render/validation boundary in 1.6; no assumption that .NET directly executes a JavaScript library. Cache only where permissions and immutable content versions permit, with no answer keys leaked.
- Test keyboard/focus/undo behavior, touch keyboard obstruction, 320–1440 px layouts, orientation, zoom, Light/Dark/System and long expressions without clipping. Desktop viewport emulation does not replace actual device checks.
- Verify assistive output (including MathML), field naming, dialogs and reading order with representative screen readers. MathML presence alone does not prove accessibility; if required reading/navigation fails, reopen the adapter/renderer decision before release.
- Backend capacity remains a separate measured gate for 500 active students and 180-minute, 200+ question exams; this selection establishes no capacity claim.

## 7. Package admission and costs

[Original package inventory](../reference/QUESTION-EDITOR-PACKAGES.json) preserves exact versions, origins, integrities and package license counts. The [fresh 1.5.4 audit](../reference/EDITOR-SELECTION-NPM-AUDIT.json) reports **zero known npm advisories** for the unchanged 101-package lock graph on 16 October 2026. This is time-bound evidence, not a security guarantee. No package was installed/upgraded for selection.

Tiptap core, MathLive and KaTeX are MIT; React is MIT. Build tooling includes TypeScript Apache-2.0 and Lightning CSS MPL-2.0 dependencies with notice/covered-file obligations. Package-level SPDX totals do not capture every bundled file: planned `mhchem` usage also retains Apache-2.0 upstream notices. Preserve font and third-party notices when packaging. Do not treat Vite/React experiment versions as the final Next.js dependency graph; re-audit the production lockfile.

**Selected editor license cost: ₹0. New paid tool/service purchases: none.** No paid Tiptap extensions, conversion SaaS, OCR subscription, Word runtime or WordPress components are selected. Pandoc is a no-license-fee candidate, not yet admitted; exact release/advisory/dependency and GPL obligations remain its adoption gate. Conversion hosting/storage/retention may add operating usage; quantify in architecture/sizing before deployment. Razorpay/R2/hosting operating charges remain in the existing cost register and are not made free by OSS selection.

## 8. Delivery impact and review boundaries

Keep all existing roadmap IDs and the six-week owner-plus-Codex target visible. The original **three-day Phase 6 budget covers editor, imports and assessments together**. Eight of nine native references requiring repair and the unverified direct clipboard boundary are concrete reasons not to treat production conversion as a finished prototype extension.

The following are provisional engineering allowances, not measured throughput or promised dates. They assume a usable converter, public fixtures, prompt owner review and no major security/notation redesign; workdays are focused effort rather than elapsed calendar time.

| Existing leaf | Remaining deliverable | Provisional effort |
|---|---|---:|
| 6.1.1 | Production editor/content validation, full region behavior, required rich nodes and notation integration | 2–3 workdays |
| 6.1.2 | Supported paste profiles, review/repair UX and native configuration tests | 1–2 workdays |
| 6.1.3 | Converter proof/admission, bounded import, reconciliation/mapping and failure handling | 3–5 workdays |
| 6.1.4 | Student renderer, saved-content/migration round trips, mobile/accessibility and outbound reuse verification | 1–2 workdays |

That is **7–12 workdays for authoring/conversion alone**, before the remaining quiz/attempt/grading work in Phase 6. Some validation can share fixtures, but no overlap savings are assumed. Cross-platform access gaps and converter replacement can extend this further. This is a proposed reforecast input; it does not silently replace the accepted 30-day target with a new commitment. Re-estimate after foundations and the first authorized converter proof; if the full scope exceeds six weeks, extend the schedule or obtain an explicit scope decision. Required Word/formula capability is not silently deferred.

Acceptance of 1.5.4 selects this approach and acknowledges remaining gates; it does not certify every source app, implement production import, approve a database schema or authorize all following phases. The owner subsequently authorized **1.6**, reviewing the React framework, Clean Architecture boundaries, API conventions and deployment/render/conversion boundaries. Follow the tracker for that item's review state.
