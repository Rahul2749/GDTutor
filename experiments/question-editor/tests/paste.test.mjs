import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parsePlainText,normalizePaste} from '../src/paste.mjs';

test('explicit delimiters create independent equations while currency remains text',()=>{
  const doc=parsePlainText(String.raw`Cost $200. Compute \(\frac{1}{2}\) and \[x^2\].`);
  const nodes=doc.content[0].content;
  assert.equal(nodes.filter(x=>x.type==='equation').length,2);
  assert.equal(nodes[0].text,'Cost $200. Compute ');
  assert.equal(nodes.find(x=>x.type==='equation').attrs.display,false);
  assert.equal(nodes.filter(x=>x.type==='equation')[1].attrs.display,true);
});
test('unclosed delimiters, invalid equations and oversized transfers are blocked atomically',()=>{
  for(const source of [String.raw`Keep text \(x+1`,String.raw`\(\unknowncommand{a}\)`, 'x'.repeat(100001)]) {
    const result=normalizePaste({source,format:'text'});
    assert.equal(result.doc,null);assert.ok(result.error);
  }
});
test('explicit LaTeX imports preserve source and reject external-resource commands',()=>{
  const latex=String.raw`\mathrm{SO}_{4}^{2-}`;
  assert.equal(normalizePaste({source:latex,format:'latex'}).doc.content[0].content[0].attrs.latex,latex);
  assert.ok(normalizePaste({source:String.raw`\href{https://example.com}{x}`,format:'latex'}).error);
});
test('files, entities and empty input cannot silently become editable content',()=>{
  for(const payload of [{source:'image',files:1},{source:'<!DOCTYPE math><math/>',format:'mathml'},{source:' '}]) {
    assert.ok(normalizePaste(payload).error);
  }
});
test('plain-text line breaks survive normalization',()=>{
  const nodes=parsePlainText('First\r\nSecond\nThird').content[0].content;
  assert.equal(nodes.filter(x=>x.type==='hardBreak').length,2);
  assert.deepEqual(nodes.filter(x=>x.type==='text').map(x=>x.text),['First','Second','Third']);
});
