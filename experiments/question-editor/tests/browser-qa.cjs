// Supply PLAYWRIGHT_MODULE and CHROME_PATH when Playwright is provided by a local runtime.
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {readFileSync, writeFileSync, mkdirSync} = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const repo = path.resolve(root, '../..');
const dist = path.join(root, 'dist');
const captures = path.join(repo, process.env.QA_CAPTURE_DIR || 'docs/design/previews/question-editor');
mkdirSync(captures, {recursive: true});
const observations = [], errors = [], unexpectedRequests = [], consoleErrors = [];
let browser;
function note(name, details = {}) {observations.push({name, passed: true, ...details});}
(async () => {
  browser = await chromium.launch({headless: true, executablePath: process.env.CHROME_PATH});
  const context = await browser.newContext({viewport: {width: 1440, height: 1050}});
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => {if(msg.type() === 'error') consoleErrors.push(msg.text());});
  // Serve production build bytes inside the browser; no server or network is required.
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'gdtutor.test') {unexpectedRequests.push(url.origin); return route.abort();}
    const file = path.resolve(dist, '.' + (url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)));
    if (!file.startsWith(dist + path.sep)) return route.abort();
    const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'}[path.extname(file)];
    try {await route.fulfill({status:200, contentType:mime || 'application/octet-stream', body:readFileSync(file)});}
    catch {await route.fulfill({status:404, body:'Not found'});}
  });
  await page.goto('https://gdtutor.test');
  await page.getByRole('heading', {name:'Make ideas clear.'}).waitFor();
  await page.getByRole('button', {name:'Show student preview'}).click();
  for (const theme of ['light','dark']) {
    await page.getByLabel('Appearance', {exact:true}).selectOption(theme);
    for (const width of [320,360,390,540,768,1024,1440]) {
      await page.setViewportSize({width,height:1050});
      for (const tab of ['Prompt','Answers','Explanation']) {
        await page.getByRole('tab', {name:tab,exact:true}).click();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        note('No whole-page horizontal overflow', {theme,width,tab});
      }
    }
  }
  await page.setViewportSize({width:1440,height:1050});
  await page.getByLabel('Appearance',{exact:true}).selectOption('light');
  await page.getByRole('tab',{name:'Prompt',exact:true}).click();
  await page.screenshot({path:path.join(captures,'desktop-light.png'),fullPage:true});
  const prompt = page.locator('[data-region="prompt"]');
  await prompt.getByRole('button',{name:'＋ Equation',exact:true}).click();
  await page.locator('math-field').click();
  await page.locator('math-field').evaluate(el=>el.focus());
  await page.waitForFunction(()=>document.querySelector('math-field')?.shadowRoot?.activeElement?.getAttribute('part') === 'keyboard-sink');
  await page.keyboard.type('x+2');
  await page.waitForFunction(()=>document.querySelector('#latex-source')?.value === 'x+2');
  assert.equal(await page.locator('#latex-source').inputValue(),'x+2');
  note('Physical typing in visual field synchronizes LaTeX source');
  await page.getByRole('button',{name:'Matrix',exact:true}).click();
  assert.match(await page.locator('#latex-source').inputValue(),/pmatrix/);
  note('Visual template inserts editable matrix source');
  await page.locator('#latex-source').fill(String.raw`\frac{2}{3}`);
  assert.equal(await page.locator('math-field').evaluate(el=>el.value),String.raw`\frac{2}{3}`);
  await page.getByRole('button',{name:'Apply equation',exact:true}).click();
  assert.equal(await prompt.locator('.equation-chip').count(),2);
  note('Source editing synchronizes visual field and inserts an independent node');
  await prompt.getByRole('button',{name:'Undo',exact:true}).click();
  assert.equal(await prompt.locator('.equation-chip').count(),1);
  await prompt.getByRole('button',{name:'Redo',exact:true}).click();
  assert.equal(await prompt.locator('.equation-chip').count(),2);
  note('Equation insertion supports editor undo and redo');
  await prompt.locator('.equation-chip').last().click();
  await page.locator('#latex-source').fill(String.raw`\unknowncommand{1}`);
  assert.equal(await page.getByRole('button',{name:'Apply equation',exact:true}).isDisabled(),true);
  assert.equal(await page.locator('#latex-source').inputValue(),String.raw`\unknowncommand{1}`);
  note('Unsupported source retained and apply disabled');
  await page.locator('#latex-source').fill(String.raw`\sqrt{5}`);
  await page.getByRole('button',{name:'Apply equation',exact:true}).click();
  assert.equal(await prompt.locator('.equation-chip').count(),2);
  assert.match(await prompt.locator('.equation-chip').last().getAttribute('aria-label'),/sqrt/);
  note('Editing existing equation updates its node without duplicating it');
  await page.getByRole('tab',{name:'Answers',exact:true}).click();
  const answer = page.locator('[data-region="option-a"]');
  await answer.locator('.equation-chip').click();
  await page.locator('#latex-source').fill(String.raw`\frac{3}{4}`);
  await page.getByRole('button',{name:'Apply equation',exact:true}).click();
  await page.getByLabel('Correct answer',{exact:true}).selectOption('option-c');
  await page.getByRole('tab',{name:'Explanation',exact:true}).click();
  await page.locator('[data-region="explanation"] .equation-chip').click();
  await page.locator('#latex-source').fill(String.raw`\alpha+\beta`);
  await page.getByRole('button',{name:'Apply equation',exact:true}).click();
  const editable = page.getByRole('textbox',{name:'Explanation rich text',exact:true});
  await editable.click(); await page.keyboard.press('Control+End');
  await page.keyboard.insertText(' हिन्दी العربية 中文');
  await page.getByRole('button',{name:'Save experiment',exact:true}).click();
  const stored = await page.evaluate(()=>localStorage.getItem('gdtutor-question-editor-experiment-v1'));
  const saved = JSON.parse(stored);
  assert.equal(saved.correctOption,'option-c');
  assert.equal(saved.regions['option-b'].content[0].content[1].attrs.latex,String.raw`\frac{1}{3}`);
  assert.equal(saved.regions['option-a'].content[0].content[1].attrs.latex,String.raw`\frac{3}{4}`);
  assert.match(JSON.stringify(saved.regions.explanation),/हिन्दी العربية 中文/);
  note('Independent answer/explanation math, Unicode and correct option retained in structured local draft');
  await page.reload();
  await page.getByRole('button',{name:'Reopen saved',exact:true}).click();
  await page.getByRole('tab',{name:'Answers',exact:true}).click();
  assert.equal(await page.getByLabel('Correct answer',{exact:true}).inputValue(),'option-c');
  await page.locator('[data-region="option-a"] .equation-chip').click();
  assert.equal(await page.locator('#latex-source').inputValue(),String.raw`\frac{3}{4}`);
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await page.getByRole('tab',{name:'Explanation',exact:true}).click();
  assert.match(await page.locator('[data-region="explanation"] .tiptap').textContent(),/हिन्दी العربية 中文/);
  note('Reload and reopen preserve editable math, all regions, scripts and correct option');
  await page.evaluate(()=>localStorage.setItem('gdtutor-question-editor-experiment-v1','{"version":999}'));
  await page.getByRole('button',{name:'Reopen saved',exact:true}).click();
  assert.match(await page.getByRole('status').textContent(),/No valid saved/);
  assert.match(await page.locator('[data-region="explanation"] .tiptap').textContent(),/हिन्दी العربية 中文/);
  note('Invalid saved draft is rejected without replacing the current content');
  await page.getByLabel('Appearance',{exact:true}).selectOption('system');
  await page.emulateMedia({colorScheme:'dark'});
  await page.waitForFunction(()=>document.documentElement.dataset.theme==='dark');
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  note('System appearance follows live color-scheme preference');
  await page.getByRole('tab',{name:'Prompt',exact:true}).click();
  await page.getByRole('button',{name:'Show student preview'}).click();
  await page.screenshot({path:path.join(captures,'desktop-dark.png'),fullPage:true});
  for (const theme of ['light','dark']) {
    await page.getByLabel('Appearance',{exact:true}).selectOption(theme);
    for (const width of [320,390,768,1440]) {
      await page.setViewportSize({width,height:900});
      await page.locator('[data-region="prompt"] .equation-chip').first().click();
      await page.locator('#latex-source').fill(String.raw`\int_0^1\frac{x^2+1}{\sqrt{x+2}}\,dx`);
      const layout = await page.locator('dialog').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth}));
      assert.ok(layout.scroll <= layout.width + 1);
      assert.ok(await page.getByRole('button',{name:'Apply equation',exact:true}).isEnabled());
      note('Equation dialog and candidate preview fit viewport',{width,theme});
      if(width===390) await page.screenshot({path:path.join(captures,`mobile-equation-${theme}.png`),fullPage:true});
      if([320,390].includes(width) && theme==='light') {
        await page.getByRole('button',{name:'Open math keyboard',exact:true}).click();
        await page.waitForFunction(()=>window.mathVirtualKeyboard.visible);
        await page.locator('dialog .ML__keyboard').waitFor({state:'visible'});
        await page.locator('dialog .MLK__plate').scrollIntoViewIfNeeded();
        const prior = await page.locator('#latex-source').inputValue();
        await page.locator('dialog .MLK__keycap').filter({hasText:/^7$/}).first().click();
        await page.waitForFunction(before=>document.querySelector('#latex-source')?.value !== before,prior);
        const keyboardLayout = await page.locator('dialog').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth}));
        assert.ok(keyboardLayout.scroll <= keyboardLayout.width + 1);
        if(width===390) await page.screenshot({path:path.join(captures,'mobile-keyboard-light.png'),fullPage:true});
        note('Math keyboard works inside the modal without horizontal overflow',{width});
        await page.evaluate(()=>window.mathVirtualKeyboard.hide());
      }
      await page.keyboard.press('Escape');
      await page.locator('dialog').waitFor({state:'detached'});
      assert.equal(await page.locator('dialog').count(),0);
    }
  }
  await page.setViewportSize({width:390,height:900});
  await page.getByLabel('Appearance',{exact:true}).selectOption('light');
  await page.screenshot({path:path.join(captures,'mobile-light.png'),fullPage:true});
  assert.deepEqual(errors,[]); assert.deepEqual(unexpectedRequests,[]); assert.deepEqual(consoleErrors,[]);
  const report={date:'2026-10-16',browser:await browser.version(),mode:'Headless Chrome, production build fulfilled locally, no network',
    observations, page_errors:errors, console_errors:consoleErrors, unexpected_external_requests:unexpectedRequests,
    build_sha256:crypto.createHash('sha256').update(readFileSync(path.join(dist,'index.html'))).digest('hex'),
    limitations:['No native Word clipboard trial','No real mobile device or screen reader trial','No backend or capacity verification','Unicode retention is not full language accessibility certification']};
  writeFileSync(path.join(repo,process.env.QA_REPORT || 'docs/design/QUESTION-EDITOR-CHECKS.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({passed_observations:observations.length,captures:6,page_errors:errors,external_requests:unexpectedRequests}));
})().catch(async e=>{console.error(e); console.error({errors,consoleErrors,unexpectedRequests});
  const p=browser?.contexts()[0]?.pages()[0];
  if(p){console.error(await p.locator('math-field').evaluateAll(els=>els.map(el=>({value:el.value,focused:el.hasFocus?.()}))));await p.screenshot({path:path.join(repo,'.planning-review/question-editor-failure.png'),fullPage:true});}
  process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();});
