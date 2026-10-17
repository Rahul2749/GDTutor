const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { createApiClient } = require('../../.planning-review/api-tests/api/client.js');
const { httpFailure } = require('../../.planning-review/api-tests/api/errors.js');
const { mapFieldErrors } = require('../../.planning-review/api-tests/forms.js');
const { formatMoney, formatDateTime } = require('../../.planning-review/api-tests/format.js');
const checks = [];
async function check(name, fn) { try { await fn(); checks.push({name,passed:true}); } catch(e) { checks.push({name,passed:false,error:e.message}); } }
const decode = v => { if (!v || typeof v.label !== 'string') throw Error('Schema'); return v.label; };
const json = (body,status=200,headers={}) => new Response(JSON.stringify(body),{status,headers:{'Content-Type':status>=400?'application/problem+json':'application/json',...headers}});
const parked = (_, init) => new Promise((resolve,reject) => init.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true}));
(async()=>{
  await check('GET uses same-origin cookies, no-store, JSON accept and redirect refusal',async()=>{
    let options; const c=createApiClient(async(path,init)=>{assert.equal(path,'/api/v1/sample');options=init;return json({label:'ok'},200,{ETag:'"r1"'});});
    const r=await c.get('/api/v1/sample',decode);assert.equal(r.ok,true);assert.equal(r.data,'ok');assert.equal(r.etag,'"r1"');assert.equal(options.credentials,'same-origin');assert.equal(options.cache,'no-store');assert.equal(options.redirect,'error');assert.match(options.headers.get('Accept'),/problem\+json/);
  });
  await check('External, protocol-relative, fragment, traversal and backslash paths never reach transport',async()=>{
    let calls=0;const c=createApiClient(async()=>{calls++;return json({label:'bad'});});
    for(const path of ['https://other.test/api/v1/x','//other.test/api/v1/x','/api/v1/../secret','/api/v1/%2e%2e/secret','/api/v1/x#token','/api/v1/x\\y','/other']) assert.equal((await c.get(path,decode)).kind,'configuration');assert.equal(calls,0);
  });
  await check('Writes require a valid token before transport',async()=>{
    let calls=0;const c=createApiClient(async()=>{calls++;return json({label:'bad'});});
    for(const csrfToken of ['', 'unsafe\nheader','invalid\u0100']) assert.equal((await c.write('POST','/api/v1/sample',{},decode,{csrfToken})).kind,'configuration');assert.equal(calls,0);
  });
  await check('Version/idempotency/CSRF headers and JSON body are passed exactly once',async()=>{
    let calls=0;const c=createApiClient(async(_,init)=>{calls++;assert.equal(init.method,'PUT');assert.equal(init.headers.get('X-CSRF-TOKEN'),'fixture-token');assert.equal(init.headers.get('If-Match'),'"v2"');assert.equal(init.headers.get('Idempotency-Key'),'stable-operation');assert.deepEqual(JSON.parse(init.body),{label:'test'});return json({label:'accepted'});});
    assert.equal((await c.write('PUT','/api/v1/sample',{label:'test'},decode,{csrfToken:'fixture-token',ifMatch:'"v2"',idempotencyKey:'stable-operation'})).ok,true);assert.equal(calls,1);
  });
  await check('Weak tags, invalid keys and non-JSON bodies fail before writes',async()=>{
    const c=createApiClient(()=>{throw Error('Should not run');});
    for(const options of [{csrfToken:'x',ifMatch:'W/"v1"'},{csrfToken:'x',ifMatch:'*'},{csrfToken:'x',idempotencyKey:'bad key'}]) assert.equal((await c.write('POST','/api/v1/sample',{},decode,options)).kind,'configuration');
    assert.equal((await c.write('POST','/api/v1/sample',BigInt(1),decode,{csrfToken:'x'})).kind,'configuration');
  });
  await check('204 is decoded explicitly as null',async()=>{const c=createApiClient(async()=>new Response(null,{status:204}));const r=await c.write('DELETE','/api/v1/sample',{},v=>{assert.equal(v,null);return undefined;},{csrfToken:'x'});assert.equal(r.ok,true);assert.equal(r.status,204);});
  await check('ProblemDetails preserves HTTP status/code/trace and bounded validation messages',async()=>{
    const c=createApiClient(async()=>json({status:200,code:'validation_failed',traceId:'trace-01',detail:'secret',errors:{title:['Required.']}},400));const r=await c.get('/api/v1/sample',decode);assert.equal(r.status,400);assert.equal(r.code,'validation_failed');assert.equal(r.traceId,'trace-01');assert.deepEqual(r.fieldErrors.title,['Required.']);assert.ok(!JSON.stringify(r).includes('secret'));
  });
  await check('Unexpected HTML/JSON server errors do not leak body, title or detail',async()=>{
    for(const response of [new Response('<script>secret</script>',{status:500,headers:{'Content-Type':'text/html'}}),json({title:'secret',detail:'secret',errors:{title:['secret']}},500)]){const r=await createApiClient(async()=>response).get('/api/v1/sample',decode);assert.equal(r.kind,'http');assert.ok(!JSON.stringify(r).includes('secret'));}
  });
  await check('Malformed problem JSON retains safe HTTP failure',async()=>{const r=await createApiClient(async()=>new Response('{bad',{status:403,headers:{'Content-Type':'application/problem+json'}})).get('/api/v1/sample',decode);assert.equal(r.status,403);assert.equal(r.kind,'http');});
  await check('Each documented HTTP status has a safe recovery message',async()=>{for(const status of [400,401,403,404,409,412,428,413,415,429,500,503]){const r=await createApiClient(async()=>json({},status)).get('/api/v1/sample',decode);assert.equal(r.status,status);assert.ok(r.message.length>10);}});
  await check('429 honors delta-seconds and HTTP-date Retry-After; values are bounded',()=>{assert.equal(httpFailure(429,{},'10').retryAfterSeconds,10);assert.equal(httpFailure(503,{},'Fri, 16 Oct 2026 10:00:10 GMT',Date.parse('2026-10-16T10:00:00Z')).retryAfterSeconds,10);assert.equal(httpFailure(429,{},'999999999999999').retryAfterSeconds,86400);});
  await check('Explicitly mapped fields do not map unknown properties or prototypes',()=>{
    const failure=httpFailure(400,JSON.parse('{"errors":{"title":["Fix title"],"unknown":["Review summary"],"__proto__":["bad"],"constructor":["bad"]}}'),null);assert.deepEqual(mapFieldErrors(failure,{title:'heading'}),{heading:'Fix title'});assert.equal(Object.getPrototypeOf(failure.fieldErrors),null);assert.equal(failure.fieldErrors.constructor,undefined);
  });
  await check('Network errors are safe and do not trigger automatic retries',async()=>{let calls=0;const r=await createApiClient(async()=>{calls++;throw Error('secret');}).get('/api/v1/sample',decode);assert.equal(r.kind,'network');assert.equal(calls,1);assert.ok(!r.message.includes('secret'));});
  await check('Failed writes are never automatically replayed',async()=>{let calls=0;const r=await createApiClient(async()=>{calls++;return json({},503);}).write('POST','/api/v1/sample',{},decode,{csrfToken:'x',idempotencyKey:'operation'});assert.equal(r.status,503);assert.equal(calls,1);});
  await check('Pre-cancelled requests do not reach transport',async()=>{let calls=0;const controller=new AbortController();controller.abort();const r=await createApiClient(async()=>{calls++;return json({label:'bad'});}).get('/api/v1/sample',decode,{signal:controller.signal});assert.equal(r.kind,'cancelled');assert.equal(calls,0);});
  await check('In-flight cancellation differs from timeout',async()=>{const controller=new AbortController();const pending=createApiClient(parked).get('/api/v1/sample',decode,{signal:controller.signal});controller.abort();assert.equal((await pending).kind,'cancelled');assert.equal((await createApiClient(parked).get('/api/v1/sample',decode,{timeoutMs:10})).kind,'timeout');});
  await check('Cancellation after a late transport success cannot apply data',async()=>{const controller=new AbortController();const c=createApiClient(async()=>{controller.abort();return json({label:'late'});});assert.equal((await c.get('/api/v1/sample',decode,{signal:controller.signal})).kind,'cancelled');});
  await check('Malformed, wrong-media, oversized and schema-invalid successes are contract failures',async()=>{
    for(const [response,options] of [[new Response('{bad',{headers:{'Content-Type':'application/json'}}),{}],[new Response('html',{headers:{'Content-Type':'text/html'}}),{}],[json({label:'too long'}),{maxResponseBytes:4}],[json({wrong:true}),{}]]) assert.equal((await createApiClient(async()=>response).get('/api/v1/sample',decode,options)).kind,'contract');
  });
  await check('Response and timeout limits reject invalid configurations',async()=>{const c=createApiClient(()=>{throw Error('No transport');});for(const options of [{timeoutMs:0},{timeoutMs:Infinity},{timeoutMs:120001},{maxResponseBytes:-1},{maxResponseBytes:20971521}])assert.equal((await c.get('/api/v1/sample',decode,options)).kind,'configuration');});
  await check('Currency display respects integer units, INR/JPY/KWD precision and invalid values',()=>{assert.match(formatMoney(129950),/1,299\.50/);assert.match(formatMoney(250,'JPY'),/250/);assert.match(formatMoney(1234,'KWD'),/1\.234/);assert.throws(()=>formatMoney(1.5));assert.throws(()=>formatMoney(Number.MAX_SAFE_INTEGER+1));});
  await check('English date display uses explicit timezone and rejects ambiguous/invalid timestamps',()=>{assert.match(formatDateTime('2026-10-16T10:00:00Z'),/16 Oct 2026/);assert.notEqual(formatDateTime('2026-10-16T10:00:00Z'),formatDateTime('2026-10-16T10:00:00Z','UTC'));for(const date of ['2026-10-16T10:00:00','2026-02-31T10:00:00Z','invalid'])assert.throws(()=>formatDateTime(date));});
  const source_sha256={};for(const file of ['apps/web/src/lib/api/client.ts','apps/web/src/lib/api/errors.ts','apps/web/src/lib/forms.ts','apps/web/src/lib/format.ts','tools/frontend/api-checks.tsconfig.json','tools/frontend/verify-api.cjs'])source_sha256[file]=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const report={checked_at_utc:new Date().toISOString(),runtime:process.version,scope:'Compiled framework-independent TypeScript with injected transports and real Request/Response/Abort APIs; no network or backend integration.',checks,source_sha256,passed:checks.every(c=>c.passed)};fs.writeFileSync(process.env.API_CHECK_REPORT || 'docs/design/API-CLIENT-CHECKS.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:report.passed,checks:checks.length,failures:checks.filter(c=>!c.passed)}));if(!report.passed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
