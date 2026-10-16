import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialDraft, readDraft, mathResult, templates} from '../src/model.mjs';

test('synthetic formula templates render with the candidate and preserve source', () => {
  for (const [, latex] of templates) assert.ok(mathResult(latex).html, latex);
});
test('unsupported, unsafe and excessive input produces repair feedback', () => {
  for (const latex of [String.raw`\unknowncommand{1}`, String.raw`\href{https://example.com}{x}`, String.raw`\includegraphics{x}`, '{', 'x'.repeat(4001)]) {
    assert.ok(mathResult(latex).error, latex.slice(0,40));
  }
});
test('question/options/explanation source and correct answer survive serialization', () => {
  const draft = initialDraft();
  draft.regions['option-c'].content[0].content.push({type:'text', text:' हिन्दी العربية 中文'});
  assert.deepEqual(readDraft(JSON.stringify(draft)), draft);
});
test('invalid region, version, node type and excessive nesting are rejected', () => {
  const missing = initialDraft(); delete missing.regions.prompt;
  assert.throws(() => readDraft(JSON.stringify(missing)));
  const unsupported = initialDraft(); unsupported.regions.prompt.content.push({type:'script'});
  assert.throws(() => readDraft(JSON.stringify(unsupported)));
  const nested = initialDraft(); let cursor = nested.regions.prompt;
  for(let i=0;i<25;i++){cursor.content=[{type:'paragraph',content:[]}];cursor=cursor.content[0];}
  assert.throws(() => readDraft(JSON.stringify(nested)));
  assert.throws(() => readDraft('{"version":2}'));
  assert.throws(() => readDraft('x'.repeat(120001)));
});
