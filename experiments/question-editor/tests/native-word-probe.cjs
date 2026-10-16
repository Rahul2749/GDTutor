// Called immediately after Word copies the known PUB-01 equation. Never reads prior user clipboard content.
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/rahul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {writeFileSync,mkdirSync} = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const repo = path.resolve(__dirname,'../../..');
const dest = path.join(repo,'Project Files/Question Samples/clipboard-captures');
let browser;
(async()=>{
  browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const page = await browser.newPage();
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4174/',{waitUntil:'networkidle'});
  await page.evaluate(()=>{
    window.__nativeWordPaste=null;
    document.addEventListener('paste',e=>{window.__nativeWordPaste={trusted:e.isTrusted,types:[...e.clipboardData.types],html:e.clipboardData.getData('text/html'),text:e.clipboardData.getData('text/plain'),files:e.clipboardData.files.length};},{capture:true,once:true});
  });
  await page.getByRole('textbox',{name:'Question prompt rich text',exact:true}).click();
  await page.keyboard.press('Control+V');
  await page.waitForFunction(()=>window.__nativeWordPaste!==null,null,{timeout:10000});
  const result = await page.evaluate(()=>window.__nativeWordPaste);
  mkdirSync(dest,{recursive:true});
  const payloads=[];
  for(const [format,key] of [['text/html','html'],['text/plain','text']]){
    const file=path.join(dest,`word-to-chrome.${key==='html'?'html':'txt'}`);
    writeFileSync(file,result[key]);
    payloads.push({format,characters:result[key].length,sha256:crypto.createHash('sha256').update(result[key]).digest('hex'),local_path:path.relative(repo,file).replaceAll('\\','/')});
  }
  const usable=!!(result.html || result.text || result.files);
  const report={date:'2026-10-16',source:'PUB-01 equation 1, copied by native Word immediately before this browser process',browser:await browser.version(),url:page.url(),method:'Real Control+V into editor, captured native trusted paste event; no injected DataTransfer',trusted:result.trusted,types:result.types,files:result.files,payloads,result:usable?'payload_captured_fidelity_not_verified':'environment_gap_no_usable_clipboard_payload',app_result:usable?'Payload captured; application normalization tested separately':'No payload reached the automated Chrome paste event. Direct Word-to-browser fidelity is NOT verified.'};
  writeFileSync(path.join(repo,'docs/reference/WORD-TO-BROWSER-PROBE.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({trusted:result.trusted,types:result.types,html_characters:result.html.length,text_characters:result.text.length}));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close()});
