# Question editor experiment

Isolated **1.5.3** paste/round-trip investigation, extending the accepted 1.5.2 editor. This does not select the production React framework, student renderer or database schema. See the [current review record](../../docs/delivery/reviews/1.5.3-paste-roundtrip.md).

From this directory, with Node 22.12+ or a supported Node 24 runtime:

```powershell
npm ci --ignore-scripts
npm run build
npm test
npm run preview
```

Open [the local preview](http://127.0.0.1:4173). If that port is occupied or unresponsive, use `npm run preview -- --port 4174 --strictPort`. The current review preview was recovered on [port 4174](http://127.0.0.1:4174/) on 16 October 2026; HTTP and actual Chrome rendering/equation-dialog checks passed. Alternatively use `npm run dev` for development. Dependencies are pinned in the lockfile; install scripts stay disabled. No credentials or external service is needed. The initial content is an independently written synthetic question.

Try these interactions:

1. Open **Equation** in Prompt, type visually, choose a template or edit the LaTeX source, then apply. Select an existing equation to edit it.
2. Use the same workflow in each answer and the explanation. Change the correct answer. Undo/redo an equation insertion.
3. Open the student preview. Switch Light/Dark/System, and resize to a phone width. Open the math keyboard in the equation dialog.
4. Save the experiment, reload, and choose **Reopen saved**. Content is stored only in this browser's local storage under `gdtutor-question-editor-experiment-v1`; this is not account persistence.
5. Try an unsupported command such as `\unknowncommand{1}` in source mode. Applying is disabled and source remains visible for repair.

`node tests/browser-qa.cjs` runs browser checks when Playwright is available. If it is provided outside this project, set `PLAYWRIGHT_MODULE` to its module directory and `CHROME_PATH` to a Chrome executable. The test fulfills the production build locally in the browser and blocks external requests, so the sandbox does not need localhost browser access. It writes the [verification report](../../docs/design/QUESTION-EDITOR-CHECKS.json) and review captures. Playwright is a verification tool from the local runtime, not an application dependency.

## Paste and reuse experiments

Paste into any question region or choose **Paste source**. The review dialog preserves the source, lets you choose its representation, and inserts only after you inspect a normalized preview. Try `Solve \(\frac{x+1}{2}\).` in Text mode, or one equation in LaTeX mode. Dollar amounts such as `$200` remain text; single-dollar math delimiters are not automatically detected. Plain-text line breaks are preserved. Inserting is atomic; unsupported content leaves the draft unchanged.

The limited MathML subset includes basic rows/tokens, fractions, powers/subscripts, roots and regular matrices. Unknown notation/attributes require repair. Basic HTML paragraphs, bold/italic and lists are supported; tables, images, scripts, resources and embedded objects are explicitly rejected. Source styling is removed with a preview warning. Ordinary editor copy/paste retains custom equation nodes; bare rendered KaTeX/MathJax wrappers are blocked to avoid duplicating their visual/accessibility representations. Source textarea line endings normalize to LF, while raw native captures remain unchanged locally.

Open an equation and use **Copy LaTeX** or **Copy MathML** for outbound reuse. The controlled browser round trip is verified for the recorded fraction/root sample. In Word, MathML replay through a Windows clipboard broker created native fraction/root structure; direct browser-to-Word clipboard fidelity remains unverified. Copying from Word into automated Chrome delivered an empty payload even though Word exposed native formats. This is an explicit environment gap, not a successful native transfer or proof of every browser's behavior.

Public Word HTML contains Office math/VML/image data which the prototype flags for repair. Eight of nine native reference conversions require repair; only one is accepted by the tiny subset, without an original visual-fidelity pass. A separately reviewed DOCX import/converter fallback is needed if native Word paste cannot meet the real corpus. No importer, OCR or OLE execution is implemented here. Other source applications and actual teacher configurations remain unverified.

## Verification and research helpers

- `npm test` runs nine model/paste tests.
- `node tests/paste-browser-qa.cjs` verifies normalization, structured save/reopen, controlled browser clipboard round trips, retained repair input, native-editor copy and viewport behavior. It requires the ignored public/native reference files registered by the source-intake helpers. See [paste results](../../docs/design/PASTE-ROUNDTRIP-CHECKS.json).
- Re-run baseline browser checks without overwriting the accepted 1.5.2 evidence by setting `QA_REPORT=docs/design/PASTE-EDITOR-REGRESSION-CHECKS.json` and `QA_CAPTURE_DIR=docs/design/previews/paste-roundtrip/regression` before `node tests/browser-qa.cjs`. See [regression results](../../docs/design/PASTE-EDITOR-REGRESSION-CHECKS.json). Set `PLAYWRIGHT_MODULE` / `CHROME_PATH` as described above when using the workspace runtime.
- From the repository root, `powershell.exe -NoProfile -STA -File tools/question-corpus/probe-word-clipboard.ps1` captures only the known public sample with an installed Word test target, macros/links disabled, and originals opened read-only. Add `-BrowserProbe <absolute path to tests/native-word-probe.cjs>` to observe the real native boundary. Raw content stays in the ignored intake directory. The operation replaces the clipboard with the public sample.
- `tools/question-corpus/build_word_mathml_references.py --stylesheet <local Office OMML2MML.XSL>` generates research-only references with the workspace Python/lxml runtime. Office and its stylesheet are never copied or deployed as application dependencies; the source ZIPs stay unchanged.
- `powershell.exe -NoProfile -STA -File tools/question-corpus/probe-word-outbound.ps1` replays the known MathML generated by the browser test into temporary unsaved Word documents. It explicitly tests a brokered payload, not direct browser clipboard interoperability. It replaces the clipboard with that synthetic fixture. See [outbound evidence](../../docs/reference/WORD-OUTBOUND-PROBE.json).

No new runtime dependency was added in 1.5.3; the reviewed lockfile and time-bound npm advisory report are unchanged.

## Boundaries

This is an isolated investigation, not production framework, schema or renderer selection. Content is local synthetic draft JSON, not an account/database record. The prototype does not implement full tables/images, source-app-specific conversion, authentication, uploads, publication, APIs or backend durability. Drop is disabled; pasted files require separate review.

The [accepted 1.5.4 decision](../../docs/design/QUESTION-AUTHORING-DECISION.md) selects Tiptap OSS + MathLive + KaTeX as the researched implementation baseline and requires separate DOCX import/repair. Its planned bundled chemistry extension was checked in a separate Node feasibility probe and is not enabled in this preview. Native Word structure counts do not certify rendered Word layout. No real mobile device/screen reader trial, exhaustive subject/language coverage or backend load test is claimed. Server-side sanitization/validation and broader resource limits remain production work.

The experiment eagerly bundles authoring tools (approximately 1.7 MB JS before compression). Production integration must split/defer authoring assets and keep them off student-only routes. No paid add-on, converter, OCR service or WordPress package is used. Existing Word was a test target only; the application runs independently of it.

Versions/licenses and advisory evidence remain in [the package register](../../docs/reference/QUESTION-EDITOR-PACKAGES.json) and [audit](../../docs/reference/QUESTION-EDITOR-NPM-AUDIT.json).
