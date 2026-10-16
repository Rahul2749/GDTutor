const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const repo=path.resolve(__dirname,'../../..'), root=path.resolve(__dirname,'..'), dist=path.join(root,'dist');
const captures=path.join(repo,'docs/design/previews/paste-roundtrip');
const privateDir=path.join(repo,'Project Files/Question Samples/clipboard-captures');
fs.mkdirSync(captures,{recursive:true});
const checks=[],errors=[],requests=[],publicResults=[];
let browser,page;
function note(name,details={}) {checks.push({name,passed:true,...details});}
function hash(data){return crypto.createHash('sha256').update(data).digest('hex');}
function mathNodes(doc){return [...(doc?.type==='equation'?[doc]:[]),...(doc?.content??[]).flatMap(mathNodes)];}
(async()=>{
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 const context=await browser.newContext({viewport:{width:1440,height:1100},permissions:['clipboard-read','clipboard-write']});
 page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.hostname!=='gdtutor.test'){requests.push(url.origin);return route.abort();}
  const file=path.resolve(dist,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
  if(!file.startsWith(dist+path.sep))return route.abort();
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
  try{return route.fulfill({body:fs.readFileSync(file),contentType:types[path.extname(file)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:'Not found'});}
 });
 await page.goto('https://gdtutor.test');
 await page.getByRole('heading',{name:'Make ideas clear.',exact:true}).waitFor();
 async function selectRegion(region){await page.getByRole('tab',{name:region.startsWith('option-')?'Answers':region==='prompt'?'Prompt':'Explanation',exact:true}).click();}
 async function openPaste(region,source,format){
  await selectRegion(region);await page.locator(`[data-region="${region}"]`).getByRole('button',{name:'Paste source',exact:true}).click();
  await page.locator('#paste-format').selectOption(format);await page.locator('#paste-source').fill(source);
 }
 async function saved(){await page.getByRole('button',{name:'Save experiment',exact:true}).click();return page.evaluate(()=>JSON.parse(localStorage.getItem('gdtutor-question-editor-experiment-v1')));}
 const positive=[
  {id:'TR-01',region:'prompt',format:'text',source:String.raw`Price $200. Compute \(\frac{1}{2}\) and \[x^2+1\].`,math:2},
  {id:'TR-02',region:'option-a',format:'latex',source:String.raw`\mathrm{SO}_{4}^{2-}`,math:1},
  {id:'TR-03',region:'option-b',format:'mathml',source:'<math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mn>2</mn><mn>3</mn></mfrac></math>',math:1},
  {id:'TR-04',region:'option-c',format:'mathml',source:'<math xmlns="http://www.w3.org/1998/Math/MathML"><msubsup><mi>x</mi><mn>1</mn><mn>2</mn></msubsup><mo>+</mo><msqrt><mn>5</mn></msqrt></math>',math:1},
  {id:'TR-05',region:'option-d',format:'mathml',source:'<math xmlns="http://www.w3.org/1998/Math/MathML"><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd><mtd><mn>4</mn></mtd></mtr></mtable></math>',math:1},
  {id:'TR-06',region:'explanation',format:'html',source:'<p><strong>Reasoning</strong> with <em>emphasis</em>.</p><ul><li>First<ul><li>Nested</li></ul></li><li>Second</li></ul><p>हिन्दी العربية 中文 <math xmlns="http://www.w3.org/1998/Math/MathML"><msup><mi>x</mi><mn>2</mn></msup></math></p>',math:1},
 ];
 for(const item of positive){
  const before=await saved();const beforeMath=mathNodes(before.regions[item.region]).length;
  await openPaste(item.region,item.source,item.format);
  assert.equal(await page.getByRole('button',{name:'Insert reviewed content',exact:true}).isEnabled(),true,item.id);
  assert.equal(hash(await page.locator('#paste-source').inputValue()),hash(item.source.replace(/\r\n/g,'\n')));
  await page.getByRole('button',{name:'Insert reviewed content',exact:true}).click();
  const after=await saved();assert.equal(mathNodes(after.regions[item.region]).length,beforeMath+item.math,item.id);
  assert.equal(after.correctOption,before.correctOption);
  for(const key of Object.keys(before.regions))if(key!==item.region)assert.deepEqual(after.regions[key],before.regions[key]);
  note('Reviewed paste keeps editable source and unrelated regions',{id:item.id,format:item.format,region:item.region});
 }
 const stable=await saved();await page.reload();await page.getByRole('button',{name:'Reopen saved',exact:true}).click();
 assert.deepEqual(await saved(),stable);note('All imported regions, lists, scripts and correct key survive reload/reopen');
 await selectRegion('option-b');await page.locator('[data-region="option-b"] .equation-chip').first().click();
 await page.locator('#latex-source').fill(String.raw`\frac{2}{3}+\sqrt{5}`);
 await page.getByRole('button',{name:'Copy LaTeX',exact:true}).click();
 assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),String.raw`\frac{2}{3}+\sqrt{5}`);note('Copy LaTeX writes the exact selected source to the controlled browser clipboard');
 await page.getByRole('button',{name:'Copy MathML',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.copy-status')?.textContent.includes('Presentation MathML copied'));
 const outbound=await page.evaluate(()=>navigator.clipboard.readText());
 assert.match(outbound,/<mfrac>/);assert.match(outbound,/<msqrt>/);assert.ok(!outbound.includes('<annotation'));
 fs.writeFileSync(path.join(privateDir,'browser-outbound-mathml.mml'),outbound);
 note('Copy MathML writes structured fraction/root data without a TeX annotation');
 await page.getByRole('button',{name:'Cancel',exact:true}).click();
 await selectRegion('prompt');
 await page.evaluate(()=>{window.__controlledPaste=null;document.addEventListener('paste',e=>window.__controlledPaste={trusted:e.isTrusted,types:[...e.clipboardData.types]},{capture:true,once:true});});
 await page.getByRole('textbox',{name:'Question prompt rich text',exact:true}).click();await page.keyboard.press('Control+V');
 await page.getByRole('dialog',{name:'Check your pasted content',exact:true}).waitFor();
 const transfer=await page.evaluate(()=>window.__controlledPaste);assert.equal(transfer.trusted,true);
 assert.ok(transfer.types.includes('text/html'));
 assert.equal(await page.getByRole('button',{name:'Insert reviewed content',exact:true}).isEnabled(),true);
 await page.getByRole('button',{name:'Insert reviewed content',exact:true}).click();
 const roundtrip=await saved();const candidates=mathNodes(roundtrip.regions.prompt);
 assert.ok(candidates.some(x=>x.attrs.latex.includes('frac{2}{3}')&&x.attrs.latex.includes('sqrt{5}')));
 note('Controlled browser MathML copy/paste creates editable fraction/root nodes',{trusted:transfer.trusted,types:transfer.types,scope:'Browser fixture only, not Word'});
 const beforeBad=await saved();
 const negative=[
  {id:'TR-07',format:'html',source:'<p>Keep</p><img src="https://example.invalid/eq.png" onerror="window.__bad=true"><script>window.__bad=true</script>'},
  {id:'TR-08',format:'mathml',source:'<!DOCTYPE math [<!ENTITY ext SYSTEM "https://example.invalid/x">]><math>&ext;</math>'},
  {id:'TR-09',format:'mathml',source:'<math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>x</mi><mo>→</mo></mover></math>'},
  {id:'TR-10',format:'mathml',source:'<math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mn>1</mn></mfrac></math>'},
  {id:'TR-11',format:'html',source:'<table><tr><td>Formula</td></tr></table>'},
  {id:'TR-12',format:'text',source:String.raw`Start \(\unknowncommand{1}\) end`},
  {id:'TR-13',format:'html',source:fs.readFileSync(path.join(privateDir,'word-pub01-equation-1.html'),'utf8')},
  {id:'TR-14',format:'html',source:'<span data-equation="" data-latex="x^2" data-display="inline">Different</span>'},
  {id:'TR-15',format:'html',source:'<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math></span><span class="katex-html">x</span></span>'},
  {id:'TR-16',format:'mathml',source:'<math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt>lost text</msqrt></math>'},
 ];
 for(const item of negative){
  await openPaste('prompt',item.source,item.format);
  assert.equal(await page.getByRole('button',{name:'Insert reviewed content',exact:true}).isDisabled(),true,item.id);
  assert.equal(hash(await page.locator('#paste-source').inputValue()),hash(item.source.replace(/\r\n/g,'\n')));
  assert.ok(await page.getByRole('alert').textContent());
  if(item.id==='TR-13')await page.screenshot({path:path.join(captures,'word-paste-repair-desktop.png'),fullPage:true});
  await page.getByRole('button',{name:'Cancel',exact:true}).click();assert.deepEqual(await saved(),beforeBad);
  note('Unsupported input is retained and blocked without changing the draft',{id:item.id,format:item.format});
 }
 await selectRegion('prompt');
 await page.getByRole('textbox',{name:'Question prompt rich text',exact:true}).click();
 await page.keyboard.press('Control+A');await page.keyboard.press('Control+C');
 const beforeInternal=await saved();
 await selectRegion('option-a');await page.getByRole('textbox',{name:'Answer A rich text',exact:true}).click();await page.keyboard.press('Control+V');
 await page.getByRole('dialog',{name:'Check your pasted content',exact:true}).waitFor();
 assert.ok(await page.getByRole('button',{name:'Insert reviewed content',exact:true}).isEnabled());
 await page.getByRole('button',{name:'Insert reviewed content',exact:true}).click();
 const afterInternal=await saved();
 assert.equal(mathNodes(afterInternal.regions['option-a']).length,mathNodes(beforeInternal.regions['option-a']).length+mathNodes(beforeInternal.regions.prompt).length);
 note('Native editor copy/paste keeps all custom equation nodes editable');
 const references=JSON.parse(fs.readFileSync(path.join(privateDir,'public-native-mathml.json'),'utf8'));
 for(const item of references.equations){
  await openPaste('prompt',item.mathml,'mathml');
  const enabled=await page.getByRole('button',{name:'Insert reviewed content',exact:true}).isEnabled();
  publicResults.push({id:item.id,source_docx_sha256:item.source_docx_sha256,input_mathml_sha256:hash(item.mathml),result:enabled?'accepted_by_subset_needs_original_visual_review':'repair_required',diagnostic:enabled?null:await page.getByRole('alert').textContent(),scope:'OMML-to-MathML reference generated with installed Office stylesheet; NOT clipboard or full-fidelity evidence'});
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
 }
 note('All nine public native reference conversions have explicit subset outcomes',{accepted:publicResults.filter(x=>x.result.startsWith('accepted')).length,repair_required:publicResults.filter(x=>x.result==='repair_required').length});
 for(const theme of ['light','dark']){
  await page.getByLabel('Appearance',{exact:true}).selectOption(theme);
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:1000});await openPaste('prompt',String.raw`Solve \(\frac{x+1}{2}\).`,'text');
   const box=await page.locator('dialog').evaluate(e=>({width:e.clientWidth,scroll:e.scrollWidth}));assert.ok(box.scroll<=box.width+1);
   assert.ok(await page.getByRole('button',{name:'Insert reviewed content',exact:true}).isEnabled());
   if(width===390)await page.screenshot({path:path.join(captures,`paste-review-mobile-${theme}.png`),fullPage:true});
   await page.keyboard.press('Escape');await page.locator('dialog').waitFor({state:'detached'});
   note('Paste review fits viewport and closes with Escape',{width,theme});
  }
 }
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);assert.equal(await page.evaluate(()=>window.__bad),undefined);
 const report={date:'2026-10-16',browser:await browser.version(),mode:'Production build locally fulfilled; controlled browser clipboard, no external network',checks,public_reference_results:publicResults,page_errors:errors,external_requests:requests,outbound_mathml_sha256:hash(outbound),captured_word_html_sha256:hash(fs.readFileSync(path.join(privateDir,'word-pub01-equation-1.html'))),native_word_clipboard_result:'Separate native probe; no full Word-to-browser pass inferred',source_sha256:Object.fromEntries(['src/main.tsx','src/model.mjs','src/paste.mjs','src/styles.css','package-lock.json'].map(p=>['experiments/question-editor/'+p,hash(fs.readFileSync(path.join(root,p)))]))};
 fs.writeFileSync(path.join(repo,'docs/design/PASTE-ROUNDTRIP-CHECKS.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({checks:checks.length,public_references:publicResults.length,accepted_subset:publicResults.filter(x=>x.result.startsWith('accepted')).length,errors,requests}));
})().catch(async e=>{console.error(e);if(page)await page.screenshot({path:path.join(repo,'.planning-review/paste-qa-failure.png'),fullPage:true});process.exitCode=1;}).finally(async()=>{if(browser)await browser.close()});
