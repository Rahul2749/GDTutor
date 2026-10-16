import katex from 'katex';

export const STORAGE_KEY = 'gdtutor-question-editor-experiment-v1';
export const MAX_LATEX = 4000;
export const MAX_DRAFT = 120000;
export const regionKeys = ['prompt', 'option-a', 'option-b', 'option-c', 'option-d', 'explanation'];
export const templates = [
  ['Fraction', String.raw`\frac{a}{b}`], ['Power', String.raw`x^{2}`],
  ['Root', String.raw`\sqrt{x+1}`], ['Integral', String.raw`\int_{0}^{1} x^{2}\,dx`],
  ['Sum', String.raw`\sum_{n=1}^{\infty}\frac{1}{n^{2}}`],
  ['Matrix', String.raw`\begin{pmatrix}a&b\\c&d\end{pmatrix}`],
  ['Vector', String.raw`\vec{v}=v_x\hat{i}+v_y\hat{j}`],
  ['Chemistry', String.raw`\mathrm{SO}_{4}^{2-}`],
  ['Greek', String.raw`\alpha+\beta=\pi`],
];

export function mathResult(latex, displayMode = false) {
  if (typeof latex !== 'string' || !latex.trim()) return {error: 'Enter an equation first.'};
  if (latex.length > MAX_LATEX) return {error: `Keep this experiment equation below ${MAX_LATEX} characters.`};
  if (/\\(?:href|url|includegraphics|html\w*|input|include|write|require|def|gdef|edef|newcommand|renewcommand)\b/.test(latex)) {
    return {error: 'This experiment does not allow resource, HTML or macro-definition commands. Source is kept for repair.'};
  }
  try {
    return {html: katex.renderToString(latex, {
      displayMode, throwOnError: true, trust: false, strict: 'error',
      maxExpand: 500, maxSize: 20, output: 'htmlAndMathml',
    })};
  } catch {
    return {error: 'This candidate renderer cannot render that source. Edit the LaTeX before applying; your input is retained.'};
  }
}

export function richDoc(text, latex) {
  return {type: 'doc', content: [{type: 'paragraph', content: [
    {type: 'text', text}, ...(latex ? [{type: 'equation', attrs: {latex, display: false}}] : []),
  ]}]};
}

export function initialDraft() {
  return {
    version: 1, correctOption: 'option-b',
    regions: {
      prompt: richDoc('Evaluate the definite integral. ', String.raw`\int_0^1 x^2\,dx`),
      'option-a': richDoc('A. ', String.raw`\frac{1}{2}`),
      'option-b': richDoc('B. ', String.raw`\frac{1}{3}`),
      'option-c': richDoc('C. ', String.raw`1`),
      'option-d': richDoc('D. ', String.raw`0`),
      explanation: richDoc('Use the power rule, then substitute the bounds. ', String.raw`\left[\frac{x^3}{3}\right]_0^1=\frac{1}{3}`),
    },
  };
}

export function readDraft(raw) {
  if (typeof raw !== 'string' || raw.length > MAX_DRAFT) throw Error('Draft is missing or exceeds this experiment’s size limit.');
  const value = JSON.parse(raw);
  if (value?.version !== 1 || !regionKeys.includes(value.correctOption) || !value.correctOption.startsWith('option-')) throw Error('Unrecognized experiment draft.');
  const allowed = new Set(['doc', 'paragraph', 'text', 'equation', 'bulletList', 'orderedList', 'listItem', 'hardBreak']);
  let nodes = 0;
  function check(node, depth = 0) {
    if (++nodes > 3000 || depth > 20 || !allowed.has(node?.type)) throw Error('Unsupported or excessive draft structure.');
    if (node.type === 'text' && typeof node.text !== 'string') throw Error('Invalid text.');
    if (node.type === 'equation' && (typeof node.attrs?.latex !== 'string' || node.attrs.latex.length > MAX_LATEX)) throw Error('Invalid equation source.');
    if (node.content !== undefined) {
      if (!Array.isArray(node.content)) throw Error('Invalid draft children.');
      node.content.forEach(child => check(child, depth + 1));
    }
  }
  for (const key of regionKeys) {
    if (value.regions?.[key]?.type !== 'doc') throw Error('A question region is missing.');
    check(value.regions[key]);
  }
  return value;
}
