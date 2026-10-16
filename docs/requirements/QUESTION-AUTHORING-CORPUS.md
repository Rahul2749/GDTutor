# Question authoring compatibility corpus

**Prepared:** 16 October 2026  
**Subphase:** 1.5.1 — accepted for prototype progression with owner-authorized public substitutes  
**Execution status:** [Progress tracker](../delivery/PROGRESS.md)  
**Evidence and review:** [Review record](../delivery/reviews/1.5.1-question-corpus.md), [structured corpus](../reference/QUESTION-CORPUS.json), [source audit](../reference/QUESTION-SOURCE-AUDIT.json)

## Owner scope and present evidence

**16 October update:** The owner has no original files now and instructed us to obtain public samples and proceed. Public upstream files now satisfy the intake dependency for the prototype. Actual teacher documents and configurations remain a later compatibility gap, not a blocker to 1.5.2. The initial local audit below remains historical evidence.

The owner answered **“consider all”** for source applications/platforms and subjects/languages, including copying equations back into Word. The target therefore includes broad source families, mixed subjects and scripts, and inbound/outbound reuse. Compatibility must be demonstrated for each tested application/version/OS/browser and representation. Listing a family does not establish support for every version or every possible notation.

| Intake category | Current evidence |
|---|---|
| Real legacy visual references | Four inspected quiz screenshots: signed voltage/inequality options, a redox equation, chemical charges/subscripts, and a complex definite integral with equations in options |
| Public upstream originals | Three pinned Microsoft Open XML SDK test DOCX files: two contain nine native OMML equations in total; one contains 136 legacy OLE objects. Read-only package inspection only; no Word or clipboard fidelity result |
| Original editable owner examples | Zero received; no DOC/DOCX, TEX, PDF, TXT, HTML, MML or RTF question files found in the supplied Project Files at initial intake |
| Synthetic proposed cases | 40; illustrative examples and workflow probes, not recovered owner questions |
| Source-app families | 12 proposed; exact versions and availability unconfirmed |
| Target browser/OS combinations | Seven proposed; exact versions and availability unconfirmed |
| Compatibility execution | Not run; no case is a verified pass |

The read-only XML scan examined content and 2,404 metadata values across 416 course/lesson/page/post/quiz items. The documented patterns did not recover usable editable formulas. One page contained 26 occurrences of the word `latex`, without recognized adjacent formula syntax. This does not establish absence of equations in media, custom storage or other encodings. Screenshot references are visual evidence only; their LaTeX and answer keys have not been recovered. Keep ambiguous chemical charge positioning unresolved until an original is supplied.

## Public source provenance

See the [public source manifest](../reference/PUBLIC-QUESTION-SOURCES.json) for pinned revision, download endpoints, file sizes, SHA-256 hashes, structural equation counts and retained MIT license. Sources come from [Microsoft Open XML SDK](https://github.com/dotnet/Open-XML-SDK/tree/431ab05cf160248cc3885a4a766026d4f8243792/test/DocumentFormat.OpenXml.Tests.Assets/assets/TestDataStorage). These are software test fixtures, not owner questions. Their authoring app versions are unknown. Native equation XML, embedded OLE objects and clipboard data are distinct representations. OLE content was not activated or converted.

Run `python tools/question-corpus/fetch_public_samples.py` from the repository root to reproduce intake with network access. Files and license remain in the ignored intake folder. The source ZIP/XML inspection does not certify rendered layout; actual Word visual/clipboard trials remain 1.5.3.

## Optional future owner sources

Place a small representative set of **original editable DOCX files** in the local [Question Samples folder](<../../Project Files/Question Samples>), or provide existing local file paths. Start with 2–3 files covering mathematics, science and mixed text; include other subjects/scripts as available. Existing LaTeX, MathML or original questions from other platforms are useful additions. Preserve originals; do not replace native equations with pictures to prepare the samples.

Each sample should identify, when known:

- Source application, exact version/build, OS and intended destination browser/version. “Unknown” remains an explicit gap, not a guessed environment.
- Subject, language/script and whether content belongs in the prompt, answer options or explanation.
- Source representation: native equation, linear LaTeX/UnicodeMath, structured web math, plain text or image. Include the original and a visual reference where possible.
- Required outcome: editable equation, preserved rich structure, Word re-entry, or a clearly identified static-image fallback. Supply the correct option/key separately only when known; never infer it from appearance.

Prefer examples containing fractions, roots, powers, matrices, long integrals, chemistry charges/reactions, tables, diagrams and mixed text/math. Include formulas in answer options and explanations as well as prompts. PDFs/screenshots supplement the corpus but cannot demonstrate native Word equation editing or clipboard behavior.

Raw source documents and eventual clipboard captures stay inside the ignored intake folder. Tracked documents contain synthetic examples and non-sensitive provenance/checksums only. Do not include student details, credentials or other production personal data. Inspect incoming files read-only before preparing experiment copies.

## Source and destination matrix

These are proposed experiments and fallback paths, not claims about current application capabilities. Access to a listed application or subscription is not assumed. Record unavailable configurations explicitly.

| ID | Source family | Required source evidence |
|---|---|---|
| SRC-01 | Word desktop on Windows | Original DOCX with native equations; Word version/build and equation input mode |
| SRC-02 | Word desktop on macOS | Original DOCX plus Word/macOS versions and browser |
| SRC-03 | Word Online | Original document and actual browser/OS; actual clipboard trial later |
| SRC-04 | Google Docs | Original document or accessible local export; distinguish native equation from image |
| SRC-05 | LibreOffice Writer | Original ODT/DOCX and app version; format conversion is not assumed lossless |
| SRC-06 | Selectable PDF text | Original PDF and viewer/version; selected text is not automatically structured math |
| SRC-07 | Scanned PDF or equation image | Original PDF/image; preserve as image or explicitly recreate; OCR not baseline |
| SRC-08 | Website/HTML/MathML source | Original snippet and source URL reference if permitted; do not fetch during intake |
| SRC-09 | Plain LaTeX or UnicodeMath | Original source, delimiters/macros and source application |
| SRC-10 | Existing offline question export | Question/options/explanations and math source, if recoverable; no live WordPress dependency |
| SRC-11 | Other office/authoring apps including WPS | Original editable file and app/OS/version; do not assume equivalence to Word |
| SRC-12 | Mobile source apps | Original document plus source app and Android/iOS/browser versions |

Test direct paste where meaningful, then an explicit linear-source route or a reviewable DOCX-import proposal when direct transfer fails. A converter is not selected here. For PDF/images, preserve text/images with diagnostics and offer manual repair; automatic OCR or image-to-editable-math conversion is not assumed. Unsupported input must remain visible with an actionable fallback rather than silently lose notation.

| ID | Destination OS family | Browser family | Configuration state |
|---|---|---|---|
| ENV-01 | Windows | Chrome | Unconfirmed; exact OS/browser versions required |
| ENV-02 | Windows | Edge | Unconfirmed; exact OS/browser versions required |
| ENV-03 | Windows | Firefox | Unconfirmed; exact OS/browser versions required |
| ENV-04 | macOS | Safari | Unconfirmed; exact OS/browser versions required |
| ENV-05 | macOS | Chrome | Unconfirmed; exact OS/browser versions required |
| ENV-06 | Android | Chrome | Unconfirmed; exact OS/browser versions required |
| ENV-07 | iOS/iPadOS | Safari | Unconfirmed; exact OS/browser versions required |

Capture source and destination separately: Word for Windows to a browser differs from Word Online to that browser. Pair applicable source families with available destinations, record gaps and prioritize the owner's actual configurations once known. Mobile/tablet coverage includes authoring controls, math keyboard/input, selection and paste, not just a screenshot of rendered output. Application versions must be frozen in each experiment record and rechecked after meaningful changes.

## Required case coverage

The original case proposals below are coverage targets, not blanket passes. Selected controlled transfers are now recorded in the [1.5.3 evidence](../design/PASTE-ROUNDTRIP-CHECKS.json); native source-app and broader language/device gaps remain explicit. Selected synthetic editing/rendering checks from 1.5.2 are recorded separately in its [prototype report](../design/QUESTION-EDITOR-CHECKS.json); they do not establish end-to-end source-app compatibility. Exact synthetic sources and regions are in the structured corpus. Some rows describe required real documents/workflows; descriptions are not substitute clipboard payloads. Cases may be split when real samples expose multiple behaviors.

| Case | Coverage | Expected behavior or experiment target |
|---|---|---|
| QC-001 | Mixed inline and display math | Preserve text order and inline/display boundaries. |
| QC-002 | Nested fraction | Preserve nesting, signs and editable numerator/denominator. |
| QC-003 | Powers and subscripts | Keep subscript/superscript attachment and selection behavior. |
| QC-004 | Roots and brackets | Keep root index, grouping and source. |
| QC-005 | Long bounded integral | Keep limits, fractions and logarithms; bounded mobile overflow or deliberate wrapping. |
| QC-006 | Sums and products | Keep operator bounds and spacing. |
| QC-007 | Limits, piecewise and alignment | Probe aligned/cases support; visibly retain unsupported source. |
| QC-008 | Matrices and vectors | Keep row/column order and vector notation; no flattening. |
| QC-009 | Greek, logic, sets and inequalities | Preserve symbols and Unicode/source equivalents. |
| QC-010 | Signed values and units | Preserve minus/plus, decimals, unit spacing and comparison order. |
| QC-011 | Scientific notation and uncertainty | Keep powers, uncertainty and unit exponents. |
| QC-012 | Chemical subscripts and charge placement | Compare ion sub/superscript placement with the original; do not silently correct the source. |
| QC-013 | Chemical reaction and extension probe | Probe ordinary and extension notation; unsupported macros must remain visible for repair. |
| QC-014 | Structural formula or biological diagram | Preserve original image/alt text; no claim of editable chemical structures or semantic OCR. |
| QC-015 | Tables, lists and math in cells | Preserve intended cell order, numbering and equations without source-app styling pollution. |
| QC-016 | Math in stem, every option and explanation | Use the same editable equation workflow in all question regions; retain option ordering/correct-key association. |
| QC-017 | Image with text wrap and caption | Keep the diagram with its question and captions; no broken temporary file references. |
| QC-018 | Image-only equation fallback | Clearly label non-editable image and offer recreation; do not claim editable math conversion. |
| QC-019 | Word native equation | Inspect actual input later; retain original and report missing clipboard structure. |
| QC-020 | Word linear representations | Test each representation separately using actual source app/version; do not infer universal interchange. |
| QC-021 | Word paragraphs, formatting and lists | Preserve useful structure while normalizing unsafe/source-specific markup. |
| QC-022 | Google Docs equation transfer | Record actual text/HTML/math/image payload and required repair; no invented success. |
| QC-023 | Selectable PDF transfer | Compare copied order and symbol attachment; visibly flag lost structure. |
| QC-024 | Scanned PDF transfer | Keep source image and explicit manual recreation path; OCR remains unapproved. |
| QC-025 | MathML and web rich content | Normalize only supported structures, retain provenance and reject executable/remote content. |
| QC-026 | LaTeX delimiters and legacy macros | Classify supported delimiters/macros; preserve originals and report unresolved cases without runtime WordPress. |
| QC-027 | Malformed and unknown TeX | Keep original source, report actionable location/problem and block publication until resolved. |
| QC-028 | Untrusted markup/resource command | Never execute or fetch; record reject/repair outcome. Payload construction/execution belongs to later isolated tests. |
| QC-029 | Large/nested expression boundary | Record formula/document size/nesting limits and predictable rejection; no unbounded render hang. |
| QC-030 | English plus Devanagari | Preserve text/script, numerals and inline math; representative Hindi/Marathi cases require owner review. |
| QC-031 | Other Indic script families | Preserve supplied glyphs/combining marks; languages named here are representative probes, not confirmed exhaustive coverage. |
| QC-032 | Right-to-left text with math | Preserve reading order and isolate mathematical direction; do not reverse option/key associations. |
| QC-033 | CJK and diacritics | Preserve Unicode, input composition, fallback fonts and search/save values. |
| QC-034 | Humanities and other text subjects | Support non-math authoring without requiring formulas or changing source language. |
| QC-035 | CS, economics, statistics, geography and other visual subjects | Preserve text/data/images and captions; no automatic semantic diagram or subject-specific grading engine implied. |
| QC-036 | Copy equation back to Word as LaTeX | Test outbound editable-source workflow in each actual Word target; compare mathematical structure and re-editability. |
| QC-037 | Copy back to Word via structured representation | Record actual target acceptance; provide honest source/manual fallback if the target does not accept it. |
| QC-038 | Save, reopen and re-edit | Retain editable source/structure and original material; do not rely on generated HTML alone. |
| QC-039 | Theme, mobile and text zoom | Check readable content, controls, local overflow and equation editing; preserve image colors where needed. |
| QC-040 | Undo/redo and independent formula edits | Keep unrelated equations/options unchanged; preserve caret/selection and correct-answer association. |

“All subjects” means general rich question content with text, mathematics, tables and diagrams, with representative subject notation and visible gaps. It does not imply automatic subject-specific answer validation, diagram understanding, translation or a symbolic grading engine. Include English, Devanagari, other Indic scripts, Arabic/Hebrew right-to-left and CJK/diacritics as initial script probes; these cannot certify every language. Add owner cases rather than treating this set as exhaustive.

## Experiment procedure for later subphases

1. Register an original with a stable sample ID, local path, checksum, representation, source configuration, permitted use and reference appearance. Never edit the sole original.
2. In 1.5.2, use synthetic cases to evaluate an isolated editor/formula prototype after corpus acceptance and authorization. Evaluate package licenses/security before adoption. This intake does not select or install a package.
3. In 1.5.3, copy from the actual source application into the actual target browser. Record available clipboard representations using a controlled local diagnostic, preserving private payloads locally. Extracting equation XML from a DOCX is useful source evidence but is not proof of what its clipboard supplies.
4. Compare original and pasted content: text order, equation meaning/structure, signs, charges, bounds, fractions, table/list grouping, image placement and prompt/option/explanation association. Ask for clarification when source intent is ambiguous. Never invent answer keys or silently repair chemistry.
5. Edit a symbol and surrounding text, undo/redo, save and reopen in the isolated experiment, and inspect stored structured source plus rendered output. Check selection, independent math nodes and that editing one option leaves other options intact.
6. Copy equations back to Word using each proposed route separately: explicit LaTeX source and candidate structured math where available. Record the exact Word re-entry steps and whether the equation remains editable. A picture or unconverted text is not an editable round-trip pass. Full DOCX export is a separate decision.
7. Check Light/Dark/System, mobile widths from 320px through desktop 1440px, long expressions, zoom, keyboard operation, accessible labels/reading order and language direction. Record renderer or assistive-technology limits rather than inferring accessibility from visual appearance.
8. Exercise malformed/unknown input, unsupported macros, external-resource commands, untrusted markup and excessive size/nesting in controlled fixtures. Preserve intended safe content, provide diagnostics, and choose documented limits through experiments. This plan does not establish secure sanitization or resource bounds.

Inspect equations both structurally and visually; a similar-looking screenshot can conceal changed meaning. Rendering, editability, structure preservation, accessibility and outbound reuse require separate results. No experiment here certifies production persistence or the 500-student backend target.

## Result record and review gate

Each future result records case/sample IDs; date; source app/build/OS; destination browser/build/OS; editor/renderer versions; source representation; transfer direction; prompt/option/explanation region; expected and actual behavior; diagnostic/fallback; source and saved/reopened evidence; reviewer and outcome. Local references may link private payloads without committing them.

Use explicit outcomes: **Not run**, **Waiting for source**, **Verified editable**, **Verified static — repair/fallback required**, or **Unsupported**. Mark rendering/editing/reopen/outbound checks separately; partial success is not an overall editable pass. A pass applies only to its recorded configuration and sample. Proposed coverage stays separate from executed evidence.

The owner authorized public originals and progression on 16 October 2026. The pinned public fixtures, synthetic probes and explicit unconfirmed environments form the accepted starting corpus for 1.5.2. Actual owner configurations are deferred to compatibility validation. This does not certify any transfer workflow. The owner later accepted 1.5.2 through “very nice go further,” then accepted the [1.5.3 findings](../delivery/reviews/1.5.3-paste-roundtrip.md) through “ok go ahead.” The [1.5.4 selection](../design/QUESTION-AUTHORING-DECISION.md) was subsequently accepted, with production conversion and native compatibility gates retained.
