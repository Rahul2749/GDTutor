const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { decodeSystemStatus, decodeHealth } = require('../../.planning-review/api-tests/api/foundation.js');
const { createApiClient } = require('../../.planning-review/api-tests/api/client.js');
const { localApiRewrites } = require('../../.planning-review/api-tests/server/local-api.js');
const checks = [];
async function check(name, action) { try { await action(); checks.push({ name, passed: true }); } catch (e) { checks.push({ name, passed: false, error: e.message }); } }
const sample = { status: 'available', apiVersion: 'v1', serverTime: '2026-10-17T04:00:00.1234567Z', sampleLabel: 'Sample', isDemonstration: true, scope: 'foundation', dependenciesVerified: false };
(async () => {
  await check('Foundation decoder admits current explicit sample and projects only known fields', () => { assert.deepEqual(decodeSystemStatus({ ...sample, internal: 'ignored' }), sample); });
  await check('Missing, wrong-type and overstated capability values fail before rendering', () => {
    for (const value of [null, [], {}, { ...sample, sampleLabel: 5 }, { ...sample, sampleLabel: 'x'.repeat(257) }, { ...sample, dependenciesVerified: true }, { ...sample, isDemonstration: false }, { ...sample, scope: 'production' }, { ...sample, apiVersion: 'v2' }]) assert.throws(() => decodeSystemStatus(value));
  });
  await check('Dates reject invalid calendar values, ambiguous timezones and excessive precision', () => {
    for (const serverTime of ['2026-02-31T10:00:00Z', '2026-10-17T10:00:00', '2026-10-17T10:00:00+00:00', '2026-10-17T10:00:00.12345678Z', 'invalid']) assert.throws(() => decodeSystemStatus({ ...sample, serverTime }));
  });
  await check('Health decoding distinguishes only supported bounded scopes', () => {
    for (const scope of ['foundation', 'process']) assert.equal(decodeHealth({ status: 'healthy', scope, dependenciesVerified: false }).scope, scope);
    for (const value of [{ status: 'healthy', scope: 'all', dependenciesVerified: false }, { status: 'healthy', scope: 'process', dependenciesVerified: true }, { status: 'unhealthy', scope: 'process', dependenciesVerified: false }]) assert.throws(() => decodeHealth(value));
  });
  await check('Only exact health GETs reach the normal same-origin transport', async () => {
    const calls = []; const client = createApiClient(async (url, options) => { calls.push(url); assert.equal(options.method, 'GET'); assert.equal(options.credentials, 'same-origin'); return new Response('{}', { headers: { 'Content-Type': 'application/json' } }); });
    for (const path of ['/health/live', '/health/ready']) assert.equal((await client.get(path, () => true)).ok, true);
    for (const path of ['/health/ready?target=remote', '/health/ready/', '/health/../secret', '/health/%72eady', 'https://remote.test/health/ready']) assert.equal((await client.get(path, () => true)).kind, 'configuration');
    assert.equal((await client.write('POST', '/health/ready', {}, () => true, { csrfToken: 'fixture' })).kind, 'configuration'); assert.deepEqual(calls, ['/health/live', '/health/ready']);
  });
  await check('Unset local origin leaves deployment routing disabled', () => { assert.deepEqual(localApiRewrites(undefined), []); });
  await check('Local IPv4, hostname and IPv6 origins yield exactly three narrow rewrite rules', () => {
    for (const origin of ['http://127.0.0.1:5080', 'http://localhost:5080/', 'http://[::1]:5080']) { const routes = localApiRewrites(origin); assert.deepEqual(routes.map(r => r.source), ['/api/v1/:path*', '/health/live', '/health/ready']); assert.ok(routes.every(r => r.destination.startsWith(new URL(origin).origin + '/'))); }
  });
  await check('Remote, credential-bearing, malformed and path/query origins fail without rejected-value leakage', () => {
    for (const origin of ['', 'https://127.0.0.1:5080', 'http://remote.test', 'http://user:private-fixture@127.0.0.1', 'http://127.0.0.1/a/..', 'http://127.0.0.1?key=private-fixture', 'http://127.0.0.1/#x', ' http://127.0.0.1', 'http://127.0.0.1\\path', 'http://2130706433', 'http://127.0.0.1:99999']) assert.throws(() => localApiRewrites(origin), e => !e.message.includes('private-fixture'));
  });
  await check('Generated TypeScript matches the saved actual OpenAPI document', () => { execFileSync(process.execPath, ['tools/frontend/generate-foundation-contracts.cjs', '--check'], { stdio: 'pipe' }); });
  const source_sha256 = {}; for (const file of ['apps/web/src/lib/api/foundation.ts', 'apps/web/src/lib/api/generated/foundation.ts', 'apps/web/src/lib/api/client.ts', 'apps/web/src/lib/server/local-api.ts', 'apps/web/next.config.ts', 'docs/architecture/openapi/integration-v1.json', 'tools/frontend/generate-foundation-contracts.cjs', 'tools/frontend/verify-integration-contracts.cjs']) source_sha256[file] = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const report = { checked_at_utc: new Date().toISOString(), scope: 'Compiled runtime decoders, exact-path GET boundaries, local rewrite configuration and generated contract parity; injected transports only', checks, source_sha256, passed: checks.every(c => c.passed) };
  fs.writeFileSync('docs/architecture/INTEGRATION-CONTRACT-CHECKS.json', JSON.stringify(report, null, 2) + '\n'); console.log(JSON.stringify(report)); if (!report.passed) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
