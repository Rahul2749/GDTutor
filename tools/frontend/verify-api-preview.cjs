const fs = require('node:fs');
const crypto = require('node:crypto');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000/';
const checks=[], captures=[], errors=[], external=[], writes=[], apiRequests=[];
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const assert=(value,message)=>{if(!value)throw Error(message);};
async function check(name,action){try{await action();checks.push({name,passed:true});}catch(e){checks.push({name,passed:false,error:e.message});}}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});
 const context=await browser.newContext();
 context.on('page',p=>{p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('request',r=>{if(!r.url().startsWith(base))external.push(r.url());if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());if(new URL(r.url()).pathname.startsWith('/api/v1/'))apiRequests.push(r.url());});});
 const page=await context.newPage();page.setDefaultTimeout(6000);
 const ready=()=>page.waitForFunction(()=>!document.querySelector('#appearance')?.disabled);
 const request=()=>page.getByRole('region',{name:'Request states',exact:true});
 const form=()=>page.getByRole('region',{name:'Form feedback',exact:true});
 const run=()=>request().getByRole('button',{name:'Run sample request',exact:true}).click();
 const choose=mode=>page.getByLabel('Mock response',{exact:true}).selectOption(mode);
 const waitFor=async(locator)=>{await locator.waitFor({state:'visible'});};
 try {
  await check('HTTP preview is labelled as mock and excluded from indexing',async()=>{const r=await page.goto(base+'api-preview');await ready();assert(r.status()===200,'HTTP status');assert(await page.getByText('Mock transport only · no backend connection or saved data',{exact:true}).isVisible(),'Mock label');assert((await page.locator('meta[name=robots]').getAttribute('content')).includes('noindex'),'Robots');});
  await check('Loading state transitions to decoded sample success',async()=>{await run();await waitFor(request().getByRole('status').filter({hasText:'Waiting for the mock'}));await waitFor(request().getByRole('status').filter({hasText:'Sample loaded'}));});
  await check('Cancel stops loading and does not apply a response',async()=>{await choose('slow');await run();await request().getByRole('button',{name:'Cancel request',exact:true}).click();await waitFor(request().getByRole('status').filter({hasText:'Request cancelled'}));assert(await request().getByRole('button',{name:'Run sample request',exact:true}).isEnabled(),'Request stuck busy');});
  await check('Replacing an in-flight request cannot overwrite the newest result',async()=>{await choose('slow');await run();await choose('success');await run();await waitFor(request().getByRole('status').filter({hasText:'Sample loaded'}));assert(await request().getByRole('alert').count()===0,'Stale failure applied');});
  for(const [scenario,message] of [['timeout','took too long'],['network','Unable to connect'],['unavailable','Try again later'],['session','Sign in to continue'],['limited','Too many requests'],['invalid','response could not be read']]){
   await check(`${scenario}: safe request feedback`,async()=>{await choose(scenario);await run();const alert=request().getByRole('alert');await waitFor(alert);assert((await alert.innerText()).includes(message),'Unexpected summary');if(scenario==='unavailable')assert((await alert.innerText()).includes('preview-read-01'),'Trace absent');if(scenario==='limited')assert((await alert.innerText()).includes('10 seconds'),'Retry-After absent');});
  }
  await check('Read retry is explicit and remains safe on repeated failure',async()=>{await choose('network');await run();await waitFor(request().getByRole('alert'));await request().getByRole('button',{name:'Retry sample request',exact:true}).click();await waitFor(request().getByRole('alert'));});
  await check('Client validation focuses its linked invalid field',async()=>{await form().getByRole('button',{name:'Check sample form',exact:true}).click();const field=page.getByLabel('Sample title',{exact:false});await page.waitForFunction(()=>document.querySelector('[name=title]')?.getAttribute('aria-invalid')==='true');assert(await field.evaluate(e=>e===document.activeElement),'Invalid focus');assert((await field.getAttribute('aria-describedby')).includes('-error'),'Error not linked');});
  await check('Mock server field errors preserve input and focus',async()=>{await page.getByLabel('Sample title',{exact:false}).fill('error');await form().getByRole('button',{name:'Check sample form',exact:true}).click();await waitFor(form().getByRole('alert'));const field=page.getByLabel('Sample title',{exact:false});await page.waitForFunction(()=>document.querySelector('[name=title]')?.getAttribute('aria-invalid')==='true');assert(await field.inputValue()==='error','Input lost');assert(await field.evaluate(e=>e===document.activeElement),'Server error focus');assert((await form().innerText()).includes('Choose a more descriptive title.'),'Mapped message absent');});
  await check('Editing a pending form cancels stale feedback and preserves current text',async()=>{const field=page.getByLabel('Sample title',{exact:false});await field.fill('First title');await form().getByRole('button',{name:'Check sample form',exact:true}).click();await field.fill('Updated title');await page.waitForTimeout(650);assert(await field.inputValue()==='Updated title','New value lost');assert(await form().getByRole('status').count()===0,'Stale success applied');});
  await check('Corrected form uses busy state and reports mock-only success',async()=>{await form().getByRole('button',{name:'Check sample form',exact:true}).click();assert(await form().getByRole('button',{name:'Checking sample…',exact:true}).isDisabled(),'Double submit available');await waitFor(form().getByRole('status').filter({hasText:'Sample checked'}));assert((await form().innerText()).includes('Nothing was saved.'),'False save claim');});
  await choose('success');await run();await waitFor(request().getByRole('status').filter({hasText:'Sample loaded'}));
  for(const mode of ['light','dark']){
   await page.locator('#appearance').selectOption(mode);
   for(const width of [320,360,390,768,820,1024,1440,1920]){
    await page.setViewportSize({width,height:900});
    await check(`${mode}/${width}: aligned responsive English-only preview`,async()=>{assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Page overflow');assert(await page.locator('h1').count()===1,'Heading count');assert(!/[\u0900-\u097f]/.test(await page.locator('body').innerText()),'Hindi/Marathi sample text');if(width<768)for(const e of await page.locator('button:visible,select:visible,input:visible').all())assert((await e.boundingBox()).height>=44,'Mobile target');});
    if([390,768,1440].includes(width)){const file=`docs/design/previews/api/api-${mode}-${width}.png`;fs.mkdirSync('docs/design/previews/api',{recursive:true});await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0);});await page.screenshot({path:file,fullPage:true});captures.push({path:file,sha256:sha(file),visually_reviewed:false});}
   }
   await check(`${mode}: 200% text reflows`,async()=>{await page.setViewportSize({width:320,height:900});await page.evaluate(()=>document.documentElement.style.fontSize='200%');try{assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Zoom overflow');}finally{await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));}});
  }
  await check('Leaving during loading does not update an unmounted page',async()=>{await choose('slow');await run();await page.getByRole('link',{name:'Review application layouts',exact:false}).click();await page.waitForURL(base+'layout-preview');await page.goBack();await ready();assert(await request().getByRole('button',{name:'Run sample request',exact:true}).isEnabled(),'Leaked request state');});
  await check('Layout preview reading copy is English',async()=>{await page.goto(base+'layout-preview/public/home');await ready();assert(!/[\u0900-\u097f]/.test(await page.locator('main').innerText()),'Hindi/Marathi remains');});
 }catch(e){checks.push({name:'Suite completion',passed:false,error:e.message});}
 finally{
  const source_sha256={};for(const file of ['apps/web/src/app/(public)/api-preview/page.tsx','apps/web/src/app/(public)/api-preview/preview.tsx','apps/web/src/app/(public)/api-preview/mock-transport.ts','apps/web/src/app/(public)/api-preview/preview.module.css','apps/web/src/hooks/use-api-request.ts','apps/web/src/lib/api/client.ts','apps/web/src/lib/api/errors.ts','apps/web/src/lib/forms.ts','apps/web/src/lib/format.ts','tools/frontend/verify-api-preview.cjs'])source_sha256[file]=sha(file);
  const report={checked_at_utc:new Date().toISOString(),browser:browser.version(),url:base+'api-preview',scope:'Production HTTP preview with injected local transport; Chrome viewport/media emulation, not backend, real-device or screen-reader certification.',checks,captures,source_sha256,page_errors:errors,external_requests:external,write_requests:writes,api_requests:apiRequests,passed:checks.every(c=>c.passed)&&!errors.length&&!external.length&&!writes.length&&!apiRequests.length};fs.writeFileSync('docs/design/API-PREVIEW-CHECKS.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:report.passed,checks:checks.length,failures:checks.filter(c=>!c.passed),errors,external,writes,apiRequests}));await browser.close();if(!report.passed)process.exitCode=1;
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
