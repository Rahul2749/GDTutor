// Selection research only. Does not change the running editor or its dependency lock.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {createRequire} = require('node:module');
const root = path.resolve(__dirname, '../..');
const localRequire = createRequire(path.join(root, 'experiments/question-editor/package.json'));
const katex = localRequire('katex');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const settings = {throwOnError: true, trust: false, strict: 'error', maxExpand: 500, maxSize: 20, output: 'htmlAndMathml'};
let coreRejectsCe = false;
try { katex.renderToString(String.raw`\ce{2H2 + O2 -> 2H2O}`, settings); }
catch { coreRejectsCe = true; }
localRequire('katex/contrib/mhchem');
const fixtures = [
  ['reaction', String.raw`\ce{2H2 + O2 -> 2H2O}`],
  ['ion', String.raw`\ce{SO4^2-}`],
  ['isotope', String.raw`\ce{^{14}_{6}C}`],
  ['units', String.raw`\pu{9.81 m/s2}`],
  ['ordinary-ion-QC-012', String.raw`\mathrm{PO}_{4}^{3-},\quad\mathrm{SO}_{4}^{2-}`],
  ['fraction-root-regression', String.raw`\frac{2}{3}+\sqrt{5}`],
];
const checks = fixtures.map(([id, latex]) => {
  try {
    const html = katex.renderToString(latex, settings);
    const passed = html.includes('<math') && html.includes('class="katex-html"') && !html.includes('katex-error');
    return {id, latex, passed, output_sha256: crypto.createHash('sha256').update(html).digest('hex')};
  } catch (error) { return {id, latex, passed: false, error: error.message}; }
});
let unknownRejected = false;
try { katex.renderToString(String.raw`\unknownGDTutor{1}`, settings); }
catch { unknownRejected = true; }
const report = {
  checked_at_utc: new Date().toISOString(), scope: 'Node render feasibility only; no browser, visual editing, paste, accessibility or native Word certification',
  node: process.version, katex: localRequire('katex/package.json').version, settings,
  lockfile_sha256: hash(path.join(root, 'experiments/question-editor/package-lock.json')),
  mhchem_file_sha256: hash(localRequire.resolve('katex/contrib/mhchem')),
  license_note: 'KaTeX MIT; bundled mhchem adaptation also retains Apache-2.0 upstream notices. Retain both.',
  core_without_extension_rejects_ce: coreRejectsCe, checks, unknown_command_rejected: unknownRejected,
  passed: coreRejectsCe && unknownRejected && checks.every(check => check.passed),
};
fs.writeFileSync(path.join(root, 'docs/reference/EDITOR-RENDERER-SELECTION-PROBE.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({passed: report.passed, positive_render_checks: checks.length, coreRejectsCe, unknownRejected}));
if (!report.passed) process.exitCode = 1;
