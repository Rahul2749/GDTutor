import katex from 'katex';
import {mathResult, MAX_LATEX} from './model.mjs';

export const MAX_PASTE = 100000;
const text = (value, marks = []) => ({type:'text', text:value, ...(marks.length ? {marks} : {})});
const paragraph = content => ({type:'paragraph', ...(content.length ? {content} : {})});
function equation(latex, display = false) {
  const rendered = mathResult(latex, display);
  if (!rendered.html) throw Error(rendered.error);
  return {type:'equation', attrs:{latex, display}};
}

// Delimiters are explicit. Single-dollar currency and unmarked UnicodeMath stay text.
export function parsePlainText(source) {
  if (source.length > MAX_PASTE) throw Error('Paste exceeds the 100,000-character experiment limit.');
  const result = [], pattern = /\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]|\$\$([\s\S]*?)\$\$/g;
  let last = 0, match;
  function appendText(value) {
    value.split(/\r\n|\r|\n/).forEach((line,index)=>{
      if(index)result.push({type:'hardBreak'});
      if(line)result.push(text(line));
    });
  }
  for (match of source.matchAll(pattern)) {
    if (match.index > last) appendText(source.slice(last, match.index));
    result.push(equation(match[1] ?? match[2] ?? match[3], match[1] === undefined));
    last = match.index + match[0].length;
  }
  if (last < source.length) appendText(source.slice(last));
  if (result.some(node => node.type === 'text' && /\\[()[\]]|\$\$/.test(node.text))) throw Error('Unclosed math delimiter. Repair the retained source before importing.');
  return {type:'doc',content:[paragraph(result)]};
}

const symbolMap = new Map(Object.entries({
  '−':'-', '×':String.raw`\times `, '÷':String.raw`\div `, '∞':String.raw`\infty `,
  '≤':String.raw`\le `, '≥':String.raw`\ge `, '≠':String.raw`\ne `, '∫':String.raw`\int `,
  '∑':String.raw`\sum `, '∏':String.raw`\prod `, '→':String.raw`\to `,
  'α':String.raw`\alpha `, 'β':String.raw`\beta `, 'π':String.raw`\pi `,
  'θ':String.raw`\theta `, 'Δ':String.raw`\Delta `, '∂':String.raw`\partial `,
  '{':String.raw`\{`, '}':String.raw`\}`, '|':String.raw`\vert `,
}));

export function mathMLToLatex(source) {
  if (source.length > MAX_PASTE || /<!DOCTYPE|<!ENTITY/i.test(source)) throw Error('Oversized MathML or document entities are not supported.');
  const xml = new DOMParser().parseFromString(source, 'application/xml');
  if (xml.querySelector('parsererror') || xml.documentElement.localName !== 'math') throw Error('A valid MathML math element is required.');
  let count = 0;
  function visit(node, depth = 0) {
    if (++count > 1500 || depth > 24) throw Error('MathML exceeds the experiment structure limit.');
    if (node.nodeType === 3) {if (node.textContent.trim()) throw Error('Unstructured text inside MathML needs review.'); return '';}
    if (node.nodeType === 8) return '';
    const tag = node.localName;
    if (!['mi','mn','mo'].includes(tag) && [...node.childNodes].some(x=>x.nodeType===3 && x.textContent.trim())) throw Error('Unstructured MathML text needs review.');
    if (node.namespaceURI !== 'http://www.w3.org/1998/Math/MathML') throw Error('Foreign MathML namespace requires repair.');
    const children = [...node.children];
    if ([...node.attributes].some(a => a.namespaceURI !== 'http://www.w3.org/2000/xmlns/' && !['xmlns','display'].includes(a.name))) throw Error('MathML attributes outside the tested subset require review.');
    const values = () => children.map(x => visit(x, depth + 1));
    const arity = n => {if(children.length !== n) throw Error(`Invalid ${tag} structure.`); return values();};
    switch(tag) {
      case 'math': case 'mrow': return [...node.childNodes].map(x => visit(x,depth+1)).join('');
      case 'semantics': {
        // Never trust a TeX annotation over a conflicting presentation tree.
        if (!children.length || children.slice(1).some(x => !['annotation'].includes(x.localName))) throw Error('Unsupported MathML semantics.');
        return visit(children[0],depth+1);
      }
      case 'mi': case 'mn': case 'mo': {
        if (children.length) throw Error('Unexpected nested MathML token.');
        const value = node.textContent;
        if (symbolMap.has(value)) return symbolMap.get(value);
        if (/^[A-Za-z0-9.,+\-=()\[\]!:;/? ]+$/.test(value)) return value;
        throw Error(`MathML token outside the tested subset: ${value.slice(0,40)}`);
      }
      case 'mfrac': {const [a,b]=arity(2);return `\\frac{${a}}{${b}}`;}
      case 'msup': {const [a,b]=arity(2);return `{${a}}^{${b}}`;}
      case 'msub': {const [a,b]=arity(2);return `{${a}}_{${b}}`;}
      case 'msubsup': {const [a,b,c]=arity(3);return `{${a}}_{${b}}^{${c}}`;}
      case 'msqrt': if(!children.length)throw Error('Empty MathML root needs review.'); return `\\sqrt{${values().join('')}}`;
      case 'mroot': {const [a,b]=arity(2);return `\\sqrt[${b}]{${a}}`;}
      case 'mtable': {
        if (!children.length || children.length>8 || children.some(x=>x.localName!=='mtr')) throw Error('Unsupported MathML table.');
        const widths=children.map(x=>x.children.length);
        if(new Set(widths).size!==1 || widths[0]>8) throw Error('Irregular or oversized MathML matrix.');
        return `\\begin{matrix}${values().join('\\\\')}\\end{matrix}`;
      }
      case 'mtr': if(children.some(x=>x.localName!=='mtd')) throw Error('Invalid matrix row.'); return values().join('&');
      case 'mtd': return values().join('');
      default: throw Error(`MathML ${tag} is not in the tested subset. Keep the original and use LaTeX/manual repair.`);
    }
  }
  const latex=visit(xml.documentElement);
  if(!latex.trim() || latex.length>MAX_LATEX) throw Error('Empty or oversized MathML equation.');
  equation(latex);
  return latex;
}

export function normalizePaste({source, format = 'text', files = 0}) {
  const warnings=[];
  try {
    if (!source?.trim() || source.length>MAX_PASTE) throw Error('Empty or oversized source. Retain the original and use a smaller selection.');
    if (files) throw Error('Pasted files/images need an explicit image or document-import workflow; no editable conversion is assumed.');
    if (/<!DOCTYPE|<!ENTITY/i.test(source)) throw Error('Document declarations/entities are not accepted in this experiment.');
    let doc;
    if(format==='latex') doc={type:'doc',content:[paragraph([equation(source.trim())])]};
    else if(format==='mathml') doc={type:'doc',content:[paragraph([equation(mathMLToLatex(source))])]};
    else if(format==='text') doc=parsePlainText(source);
    else if(format==='html') {
      if (/<(?:\w+:)?oMath\b|mso-element\s*:\s*equation|<\s*(?:v:|o:OLEObject)/i.test(source)) throw Error('Word supplied Office math/image markup. Direct editable paste is not verified for this payload. Use explicit LaTeX/MathML or a reviewed DOCX-import fallback.');
      if (/class\s*=\s*["'][^"']*(?:katex|MathJax|mjx-)/i.test(source)) throw Error('Rendered math wrappers may duplicate or flatten equations. Copy explicit LaTeX/MathML from the source instead.');
      const template=document.createElement('template'); template.innerHTML=source;
      const allowed = new Set(['p','div','span','b','strong','i','em','br','ul','ol','li','math']);
      let nodes=0;
      function read(node,marks=[],depth=0) {
        if(++nodes>3000 || depth>20) throw Error('HTML exceeds the experiment structure limit.');
        if(node.nodeType===3) return [text(node.textContent,marks)];
        if(node.nodeType===8) return [];
        if(node.nodeType!==1) return [];
        const name=node.localName;
        if(!allowed.has(name)) throw Error(`HTML ${name} needs review; tables, images, links, scripts and embedded content are not imported silently.`);
        if(name==='math') return [equation(mathMLToLatex(new XMLSerializer().serializeToString(node)),node.getAttribute('display')==='block')];
        if([...node.attributes].some(a=>/^on/i.test(a.name) || ['src','href','srcdoc'].includes(a.name))) throw Error('Resource/link/event attributes need review and were not imported.');
        if(node.hasAttribute('style') || node.hasAttribute('class')) warnings.push('Source styling removed; inspect the normalized preview.');
        if(name==='span' && node.hasAttribute('data-equation')) {
          const latex=node.getAttribute('data-latex');
          if(latex===null || node.textContent!==latex || !['inline','block'].includes(node.getAttribute('data-display'))) throw Error('Equation clipboard metadata is incomplete or conflicts with its text. Repair the source.');
          return [equation(latex,node.getAttribute('data-display')==='block')];
        }
        const next=['b','strong'].includes(name)?[...marks,{type:'bold'}]:['i','em'].includes(name)?[...marks,{type:'italic'}]:marks;
        const content=[...node.childNodes].flatMap(x=>read(x,next,depth+1));
        if(name==='br') return [{type:'hardBreak'}];
        if(['p','div'].includes(name)) {
          if(content.some(x=>['paragraph','bulletList','orderedList','listItem'].includes(x.type))) return content;
          return [paragraph(content)];
        }
        if(name==='li') {
          const blocks=[];let pending=[];
          for(const child of content) {
            if(['paragraph','bulletList','orderedList'].includes(child.type)) {
              if(pending.length){blocks.push(paragraph(pending));pending=[];} blocks.push(child);
            } else pending.push(child);
          }
          if(pending.length) blocks.push(paragraph(pending));
          if(!blocks.length || blocks[0].type!=='paragraph') blocks.unshift(paragraph([]));
          return [{type:'listItem',content:blocks}];
        }
        if(['ul','ol'].includes(name)) {
          const items=content.filter(x=>x.type!=='text' || x.text.trim());
          if(items.some(x=>x.type!=='listItem')) throw Error('Unstructured list requires review.');
          return [{type:name==='ul'?'bulletList':'orderedList',content:items}];
        }
        return content;
      }
      const nodesOut=[...template.content.childNodes].flatMap(x=>read(x));
      const blocks=[];let inline=[];
      for(const node of nodesOut) {
        if(node.type==='text' && !node.text.trim() && !inline.length) continue;
        if(['paragraph','bulletList','orderedList'].includes(node.type)) {if(inline.length){blocks.push(paragraph(inline));inline=[];}blocks.push(node);}
        else inline.push(node);
      }
      if(inline.length) blocks.push(paragraph(inline));
      doc={type:'doc',content:blocks};
      if(!blocks.length) throw Error('No supported content found.');
    } else throw Error('Unknown source format.');
    return {doc, warnings:[...new Set(warnings)], error:null};
  } catch(error) {return {doc:null,warnings,error:error.message || 'Source needs repair.'};}
}

export function equationMathML(latex) {
  if(!mathResult(latex).html) throw Error('Equation needs repair before copying.');
  const markup=katex.renderToString(latex,{output:'mathml',throwOnError:true,trust:false,maxExpand:500,maxSize:20});
  const template=document.createElement('template');template.innerHTML=markup;
  const math=template.content.querySelector('math');
  if(!math) throw Error('No structured math output available.');
  math.querySelectorAll('annotation,annotation-xml').forEach(x=>x.remove());
  return new XMLSerializer().serializeToString(math);
}
