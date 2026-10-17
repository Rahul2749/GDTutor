const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3000/';
const checks = [], captures = [], errors = [], external = [], writes = [];
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const assert = (ok, message) => { if (!ok) throw Error(message); };
async function check(name, action) { try { await action(); checks.push({name, passed:true}); } catch (e) { checks.push({name, passed:false, error:e.message}); } }
async function capture(page, name) {
  const file = `docs/design/previews/shells/${name}.png`;
  fs.mkdirSync(path.dirname(file), {recursive:true});
  await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
  await page.screenshot({path:file, fullPage:true});
  captures.push({path:file, sha256:sha(file), visually_reviewed:false});
}
(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROME_PATH, headless:true});
  const context = await browser.newContext();
  context.on('page', p => {
    p.on('pageerror', e => errors.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    p.on('request', r => { if (!r.url().startsWith(base)) external.push(r.url()); if (!['GET','HEAD'].includes(r.method())) writes.push(r.url()); });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  const fixtures = {public:'home', student:'overview', staff:'courses', admin:'courses'};
  async function ready() { await page.waitForFunction(() => !document.querySelector('#appearance')?.disabled); }
  try {
    for (const [area, section] of Object.entries(fixtures)) {
      await check(`${area}: direct route is HTTP 200 with preview boundaries`, async () => {
        const r = await page.goto(`${base}layout-preview/${area}/${section}`);
        await ready();
        assert(r.status() === 200, 'HTTP status');
        assert(await page.getByText('Sample content · no account session', {exact:true}).isVisible(), 'Missing sample boundary');
        assert((await page.locator('meta[name=robots]').getAttribute('content')).includes('noindex'), 'Indexing policy');
      });
      for (const mode of ['light','dark']) {
        await page.locator('#appearance').selectOption(mode);
        for (const width of [320,360,390,768,820,1024,1440,1920]) {
          await page.setViewportSize({width,height:900});
          await check(`${area}/${mode}/${width}: content, navigation and target layout`, async () => {
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Page overflow');
            assert(await page.locator('main').count() === 1 && await page.locator('h1').count() === 1, 'Main/heading count');
            assert(await page.locator('main h1').isVisible(), 'Missing page heading');
            assert(await page.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map(e=>e.id); return new Set(ids).size === ids.length; }), 'Duplicate IDs');
            const menu = page.getByRole('button',{name:'Menu',exact:false});
            assert(await menu.isVisible() === (area === 'public' || width < 900), 'Menu breakpoint');
            const workspace = page.getByRole('navigation',{name:'Workspace navigation',exact:true});
            assert(await workspace.isVisible() === (area !== 'public' && width >= 900), 'Sidebar breakpoint');
            if (width < 768) {
              for (const element of await page.locator('button:visible, select:visible').all()) assert((await element.boundingBox()).height >= 44, 'Small mobile control');
            }
            const heading = await page.locator('main h1').boundingBox();
            const sectionBox = await page.locator('main section').first().boundingBox();
            assert(Math.abs(heading.x-sectionBox.x) < 1, 'Content edge alignment');
          });
          if ([390,768,1440].includes(width) && (area !== 'admin' || width === 1440)) await capture(page,`${area}-${mode}-${width}`);
        }
        await page.setViewportSize({width:390,height:900});
        await check(`${area}/${mode}: menu Escape, route selection, Back and theme persistence`, async () => {
          const menu = page.getByRole('button',{name:'Menu',exact:false});
          await menu.click();
          assert(await menu.getAttribute('aria-expanded') === 'true', 'Menu state');
          const nav = page.getByRole('navigation',{name:'Expanded navigation',exact:true});
          const links = nav.getByRole('link');
          await links.first().focus();
          await page.keyboard.press('Escape');
          assert(await menu.getAttribute('aria-expanded') === 'false', 'Escape did not close');
          assert(await menu.evaluate(e=>e===document.activeElement), 'Escape focus not restored');
          await menu.click();
          const target = area === 'public' ? nav.getByRole('link',{name:'Classes & batches',exact:true}) : nav.getByRole('link',{name:area === 'student' ? 'My classes' : 'Question bank',exact:true});
          const href = await target.getAttribute('href');
          await target.click();
          await page.waitForURL(base.replace(/\/$/,'')+href);
          await ready();
          assert(await page.getByRole('button',{name:'Menu',exact:false}).getAttribute('aria-expanded') === 'false', 'Navigation did not close menu');
          assert(await page.locator('html').getAttribute('data-theme') === mode, 'Theme lost on navigation');
          await page.getByRole('button',{name:'Menu',exact:false}).click();
          assert(await page.getByRole('navigation',{name:'Expanded navigation'}).locator('[aria-current=page]').count() >= 1, 'Active destination missing');
          await page.keyboard.press('Escape');
          await page.goBack();
          await ready();
          assert(page.url().endsWith(`/${area}/${section}`), 'Back URL');
        });
        await check(`${area}/${mode}: long content and 200% text reflow`, async () => {
          await page.setViewportSize({width:320,height:900});
          await page.getByText('Long-content layout sample',{exact:true}).click();
          assert(await page.locator('details[open]').count() === 1, 'Disclosure failed');
          await page.evaluate(() => document.documentElement.style.fontSize='200%');
          try { assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Zoom overflow'); }
          finally { await page.evaluate(() => document.documentElement.style.removeProperty('font-size')); }
        });
      }
      await check(`${area}: reachable links resolve and fixtures respect navigation scope`, async () => {
        const hrefs = await page.locator('a[href^="/layout-preview/"]').evaluateAll(es => [...new Set(es.map(e=>e.getAttribute('href')))]);
        for (const href of hrefs) assert((await context.request.get(base.replace(/\/$/,'')+href)).status() === 200, `Broken link ${href}`);
        if (area === 'staff') assert(await page.locator('a[href="/layout-preview/admin/orders"], a[href="/layout-preview/staff/orders"]').count() === 0, 'Admin nav leaked into instructor fixture');
        if (area === 'admin') assert(await page.locator('a[href="/layout-preview/admin/orders"]').count() > 0, 'Admin fixture absent');
        if (['staff','admin'].includes(area)) assert(await page.getByRole('region',{name:'Sample course table, scroll horizontally if needed'}).evaluate(e=>e.scrollWidth>e.clientWidth), 'Wide table not locally scrollable on mobile');
      });
    }
    await check('Skip link moves keyboard focus into the main content', async () => {
      await page.goto(base+'layout-preview/student/overview'); await ready();
      await page.getByRole('link',{name:'Skip to content',exact:true}).focus();
      await page.keyboard.press('Enter');
      assert(await page.locator('main').evaluate(e=>e===document.activeElement), 'Skip target focus');
    });
    await check('Touch tablet navigation works in both orientations and themes', async () => {
      for (const viewport of [{width:768,height:1024},{width:1024,height:768}]) {
        const touch = await browser.newContext({viewport,hasTouch:true,isMobile:true});
        try {
          const p = await touch.newPage(); await p.goto(base+'layout-preview/student/overview');
          await p.waitForFunction(()=>!document.querySelector('#appearance').disabled);
          for (const mode of ['light','dark']) {
            await p.locator('#appearance').selectOption(mode);
            assert(await p.evaluate(()=>document.documentElement.scrollWidth <= innerWidth), 'Tablet overflow');
            assert((await p.locator('#appearance').boundingBox()).height >= 44, 'Tablet control too small');
            if (viewport.width < 900) { await p.getByRole('button',{name:'Menu',exact:false}).tap(); assert(await p.getByRole('navigation',{name:'Expanded navigation'}).isVisible(), 'Touch menu failed'); await p.getByRole('button',{name:'Menu',exact:false}).tap(); }
          }
        } finally { await touch.close(); }
      }
    });
  } catch (e) { checks.push({name:'Suite completion',passed:false,error:e.message}); }
  finally {
    const source_sha256 = {};
    for (const file of ['apps/web/src/components/layout/workspace-shell.tsx','apps/web/src/components/layout/workspace-shell.module.css','apps/web/src/app/(preview)/layout-preview/navigation.ts','apps/web/src/app/(preview)/layout-preview/layout.tsx','apps/web/src/app/(preview)/layout-preview/page.tsx','apps/web/src/app/(preview)/layout-preview/[area]/[section]/page.tsx','apps/web/src/app/(preview)/layout-preview/preview.module.css','apps/web/src/styles/tokens.css','apps/web/package-lock.json','tools/frontend/verify-shells.cjs']) source_sha256[file]=sha(file);
    const report = {checked_at_utc:new Date().toISOString(),browser:browser.version(),base_url:base,scope:'Local production HTTP; Chrome viewport/media and touch emulation. Not real-device, authorization or screen-reader certification.',checks,captures,source_sha256,page_errors:errors,external_requests:external,write_requests:writes,passed:checks.every(c=>c.passed)&&!errors.length&&!external.length&&!writes.length};
    fs.writeFileSync('docs/design/RESPONSIVE-SHELL-CHECKS.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify({passed:report.passed,checks:checks.length,failures:checks.filter(c=>!c.passed),errors,external,writes,captures:captures.length}));
    await browser.close(); if (!report.passed) process.exitCode=1;
  }
})();
