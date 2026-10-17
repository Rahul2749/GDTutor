const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const net = require('node:net');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '../..');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000/';
const api = 'http://127.0.0.1:5080';
const scratch = path.join(root, '.planning-review/integration');
const checks = [], captures = [], pageErrors = [], consoleErrors = [], requests = [], responses = [];
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const assert = (condition, message) => { if (!condition) throw Error(message); };
async function check(name, action) { try { await action(); checks.push({ name, passed: true }); } catch (e) { checks.push({ name, passed: false, error: e.message }); } }
let backend, run = 0;
async function stopApi() {
  if (backend && backend.exitCode === null) { const exited = once(backend, 'exit'); backend.kill(); await exited; }
  backend = undefined;
}
async function startApi(environment = 'Development') {
  const probe = net.createServer();
  await new Promise((resolve, reject) => { probe.once('error', reject); probe.listen(5080, '127.0.0.1', resolve); });
  await new Promise(resolve => probe.close(resolve));
  const out = fs.openSync(path.join(scratch, `api-${run}.stdout.log`), 'w');
  const err = fs.openSync(path.join(scratch, `api-${run++}.stderr.log`), 'w');
  backend = spawn(path.join(root, '.planning-review/dotnet/dotnet.exe'), [path.join(root, '.planning-review/backend/publish/GDTutor.Api.dll'), '--urls', api], {
    cwd: path.join(root, '.planning-review/backend/publish'), windowsHide: true,
    env: { ...process.env, DOTNET_ROOT: path.join(root, '.planning-review/dotnet'), ASPNETCORE_ENVIRONMENT: environment, Application__PublicOrigin: environment === 'Development' ? 'http://127.0.0.1:3000' : 'https://example.test' }, stdio: ['ignore', out, err],
  });
  fs.closeSync(out); fs.closeSync(err);
  for (let i = 0; i < 60; i++) {
    if (backend.exitCode !== null) throw Error('Owned API process exited during startup.');
    try { const r = await fetch(api + '/api/v1/system/status', { signal: AbortSignal.timeout(1000) }); if (r.status === 200) return; } catch { }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw Error('API startup timed out.');
}
(async () => {
  fs.mkdirSync(scratch, { recursive: true });
  await startApi();
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
  const context = await browser.newContext();
  context.on('request', r => requests.push({ url: r.url(), method: r.method() }));
  context.on('response', r => { const p = new URL(r.url()).pathname; if (p.startsWith('/api/v1/') || p.startsWith('/health/')) responses.push({ path: p, status: r.status(), traceId: r.headers()['x-trace-id'], cacheControl: r.headers()['cache-control'] }); });
  const page = await context.newPage(); page.setDefaultTimeout(8000);
  page.on('pageerror', e => pageErrors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  const ready = () => page.waitForFunction(() => !document.querySelector('#appearance')?.disabled);
  const panel = () => page.getByRole('region', { name: 'Connection check', exact: true });
  const choose = mode => page.getByLabel('Check to run', { exact: true }).selectOption(mode);
  const load = () => panel().getByRole('button', { name: 'Check connection', exact: true }).click();
  const success = () => panel().getByRole('status').filter({ hasText: 'API response received' }).waitFor();
  const alert = () => panel().getByRole('alert');
  try {
    await check('Live connection page is labelled read-only, English and excluded from indexing', async () => {
      const r = await page.goto(base + 'connection-preview'); await ready(); assert(r.status() === 200, 'Page unavailable');
      assert(await page.getByText('Live API requests · read-only demonstration · no data saved', { exact: true }).isVisible(), 'Scope label missing');
      assert((await page.locator('meta[name=robots]').getAttribute('content')).includes('noindex'), 'Indexable preview');
    });
    await check('Actual .NET status traverses same-origin forwarding, retains no-store/trace and renders current UTC data', async () => {
      const response = page.waitForResponse(r => r.url() === base + 'api/v1/system/status'); await load(); const r = await response; const data = await r.json(); await success();
      assert(r.status() === 200 && data.isDemonstration && !data.dependenciesVerified, 'Actual DTO absent');
      assert(r.headers()['cache-control'] === 'no-store' && r.headers()['x-trace-id'], 'Proxy lost metadata');
      assert(await panel().locator('time').getAttribute('datetime') === data.serverTime, 'View differs from response');
      assert(Math.abs(Date.now() - Date.parse(data.serverTime)) < 30000, 'Fixture/stale clock');
      assert((await panel().innerText()).includes(data.sampleLabel), 'Service label absent');
    });
    for (const mode of ['ready', 'live']) await check(`${mode}: real health GET renders bounded scope`, async () => {
      await choose(mode); const response = page.waitForResponse(r => r.url() === base + 'health/' + mode); await load(); const r = await response; await success();
      assert(r.status() === 200 && r.headers()['cache-control'] === 'no-store' && r.headers()['x-trace-id'], 'Invalid health result/metadata');
      assert((await panel().innerText()).includes('Healthy'), 'Health DTO did not pass runtime decoding');
      assert((await panel().innerText()).includes(mode === 'live' ? 'Process only' : 'Foundation only'), 'Incorrect scope');
    });
    await check('Delayed real request shows loading/busy then success', async () => {
      await choose('slow'); await load(); await panel().getByText('Waiting for the API response…', { exact: true }).waitFor();
      assert(await panel().getByRole('button', { name: 'Checking connection…', exact: true }).isDisabled(), 'Duplicate action enabled'); await success();
    });
    await check('Cancellation of an actual delayed request cannot apply its late result', async () => {
      const observed = page.waitForRequest(r => r.url() === base + 'api/v1/diagnostics/delay'); await load(); await observed;
      await panel().getByRole('button', { name: 'Cancel request', exact: true }).click(); await panel().getByRole('status').filter({ hasText: 'Request cancelled' }).waitFor();
      await page.waitForTimeout(2200); assert(!(await panel().innerText()).includes('API response received'), 'Late result applied');
    });
    await check('Replacing a pending delayed check aborts stale feedback and renders the newer status', async () => {
      await load(); await choose('status'); await load(); await success(); await page.waitForTimeout(2200);
      assert(await panel().locator('time').count() === 1 && await alert().count() === 0, 'Stale request replaced result');
    });
    await check('Actual two-second endpoint produces a distinct one-second client timeout', async () => {
      await choose('timeout'); await load(); await alert().waitFor(); assert((await alert().innerText()).includes('took too long'), 'Timeout not distinguished');
      await page.waitForTimeout(1200); assert(await alert().isVisible(), 'Late success replaced timeout');
    });
    let errorReference;
    await check('Actual server 500 preserves safe ProblemDetails and trace correlation through Next', async () => {
      await choose('failure'); const response = page.waitForResponse(r => r.url() === base + 'api/v1/diagnostics/failure'); await load(); const r = await response; const problem = await r.json(); await alert().waitFor();
      errorReference = problem.traceId;
      assert(r.status() === 500 && problem.code === 'unexpected_error' && errorReference === r.headers()['x-trace-id'], 'Problem metadata lost');
      assert((await alert().innerText()).includes(errorReference) && !(await page.locator('body').innerText()).includes('controlled-exception-fixture'), 'Unsafe/missing diagnostics');
    });
    await check('Retry is explicit and reset clears previous feedback', async () => {
      await panel().getByRole('button', { name: 'Retry check', exact: true }).click(); await alert().waitFor();
      await panel().getByRole('button', { name: 'Reset', exact: true }).click(); assert(await alert().count() === 0, 'Reset retained errors');
    });
    await check('Stopped API yields a safe proxy/transport error without infrastructure HTML or a fake success', async () => {
      await stopApi(); await choose('status'); await load(); await alert().waitFor(); const text = await alert().innerText();
      assert(!text.includes('ECONNREFUSED') && !text.includes('<html') && !text.includes('API response received'), 'Infrastructure details leaked');
    });
    await check('Restarted API recovers on explicit retry', async () => { await startApi(); await panel().getByRole('button', { name: 'Retry check', exact: true }).click(); await success(); });
    await check('Production backend serves status but returns 404 for the local diagnostic operation', async () => {
      await stopApi(); await startApi('Production'); await choose('failure'); await load(); await alert().waitFor(); assert((await alert().innerText()).includes('HTTP 404'), 'Production diagnostics exposed');
      await choose('status'); await load(); await success(); await stopApi(); await startApi();
    });
    await check('Failure reference can be matched to the actual API safe log event', async () => {
      const logs = fs.readdirSync(scratch).filter(f => /^api-.*stdout.log$/.test(f)).flatMap(f => fs.readFileSync(path.join(scratch, f), 'utf8').split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line)));
      assert(logs.some(e => e.EventId === 1001 && e.State.TraceId === errorReference), 'Server log correlation missing');
      assert(!JSON.stringify(logs).includes('controlled-exception-fixture'), 'Exception value leaked');
    });
    await choose('status'); await load(); await success();
    for (const theme of ['light', 'dark']) {
      await page.locator('#appearance').selectOption(theme);
      for (const width of [320, 360, 390, 768, 820, 1024, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        await check(`${theme}/${width}: compact mobile/tablet/desktop layout without page overflow`, async () => {
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal overflow');
          assert(!/[\u0900-\u097f]/.test(await page.locator('body').innerText()), 'Non-English fixture');
          if (width < 768) for (const element of await page.locator('button:visible,select:visible').all()) assert((await element.boundingBox()).height >= 44, 'Small touch control');
        });
        if ([390, 768, 1440].includes(width)) {
          const file = `docs/design/previews/integration/connection-${theme}-${width}.png`; fs.mkdirSync(path.dirname(file), { recursive: true });
          await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); }); await page.screenshot({ path: file, fullPage: true }); captures.push({ path: file, sha256: sha(file), visually_reviewed: false });
        }
      }
      await check(`${theme}: 200% text retains mobile reflow`, async () => {
        await page.setViewportSize({ width: 320, height: 900 }); await page.evaluate(() => document.documentElement.style.fontSize = '200%');
        try { assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Zoom overflow'); } finally { await page.evaluate(() => document.documentElement.style.removeProperty('font-size')); }
      });
    }
    await check('System appearance follows browser media preference', async () => { await page.locator('#appearance').selectOption('system'); for (const scheme of ['dark', 'light']) { await page.emulateMedia({ colorScheme: scheme }); await page.waitForFunction(mode => document.documentElement.dataset.theme === mode && getComputedStyle(document.documentElement).colorScheme === mode, scheme); } });
    await check('Keyboard access reaches the select and request action', async () => { await page.getByLabel('Check to run', { exact: true }).focus(); await page.keyboard.press('Tab'); assert(await panel().getByRole('button', { name: 'Check connection', exact: true }).evaluate(e => e === document.activeElement), 'Keyboard order'); });
    await check('Navigating away while loading does not apply an unmounted result', async () => {
      await choose('slow'); await load(); await page.getByRole('link', { name: 'Application layouts', exact: false }).click(); await page.waitForURL(base + 'layout-preview/public/home');
      await page.goBack(); await ready(); assert(await panel().getByRole('button', { name: 'Check connection', exact: true }).isEnabled(), 'Request leaked across navigation');
    });
  } catch (e) { checks.push({ name: 'Suite completion', passed: false, error: e.message }); }
  finally {
    await stopApi();
    const source_sha256 = {}; for (const file of ['apps/web/next.config.ts', 'apps/web/src/lib/server/local-api.ts', 'apps/web/src/lib/api/client.ts', 'apps/web/src/lib/api/foundation.ts', 'apps/web/src/lib/api/generated/foundation.ts', 'apps/web/src/features/connection/connection-preview.tsx', 'apps/web/src/features/connection/connection.module.css', 'apps/web/src/app/(public)/connection-preview/page.tsx', 'src/GDTutor.Api/Controllers/DevelopmentDiagnosticsController.cs', 'src/GDTutor.Api/Contracts/SystemStatusResponse.cs', 'tools/frontend/verify-live-integration.cjs']) source_sha256[file] = sha(file);
    const unexpectedConsoleErrors = consoleErrors.filter(message => !/^Failed to load resource: the server responded with a status of (404|500|502|503)/.test(message));
    const external = requests.filter(r => !r.url.startsWith(base)), writes = requests.filter(r => !['GET', 'HEAD'].includes(r.method));
    const report = { checked_at_utc: new Date().toISOString(), browser: browser.version(), url: base + 'connection-preview', scope: 'Production-build Next frontend and actual published .NET process via same-origin local forwarding; real requests only, no route mocking; desktop Chrome viewport/media emulation', checks, captures, source_sha256, responses, request_count: requests.length, external_requests: external, writes, page_errors: pageErrors, expected_http_console_errors: consoleErrors.filter(e => !unexpectedConsoleErrors.includes(e)), unexpected_console_errors: unexpectedConsoleErrors, owned_test_api_processes_stopped: true, passed: checks.every(c => c.passed) && !pageErrors.length && !unexpectedConsoleErrors.length && !external.length && !writes.length };
    fs.writeFileSync('docs/architecture/LIVE-INTEGRATION-CHECKS.json', JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ passed: report.passed, checks: checks.length, failures: checks.filter(c => !c.passed), pageErrors, unexpectedConsoleErrors, external, writes })); await browser.close(); if (!report.passed) process.exitCode = 1;
  }
})().catch(async e => { await stopApi(); console.error(e); process.exitCode = 1; });
