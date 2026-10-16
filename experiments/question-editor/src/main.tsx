import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Node, type Editor, type JSONContent} from '@tiptap/core';
import {EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {MathfieldElement} from 'mathlive';
import 'mathlive/fonts.css';
import 'katex/dist/katex.min.css';
import {initialDraft, mathResult, readDraft, regionKeys, STORAGE_KEY, templates, MAX_DRAFT} from './model.mjs';
import {normalizePaste, equationMathML, MAX_PASTE} from './paste.mjs';
import './styles.css';

type Draft = {version: number; correctOption: string; regions: Record<string, JSONContent>};
type Target = {editor: Editor; pos: number | null; region: string; latex: string; display: boolean};
type Appearance = 'light' | 'dark' | 'system';
type PasteTarget = {editor: Editor; region: string; source: string; plain: string; format: string; files: number};

MathfieldElement.soundsDirectory = null;
// Importing fonts.css bundles every font locally; no CDN or remote service is used.

function equationExtension(open: (target: Target) => void, region: string) {
  return Node.create({
    name: 'equation', group: 'inline', inline: true, atom: true, selectable: true,
    addAttributes() {return {latex: {default: ''}, display: {default: false}};},
    // Do not accept equation HTML from an arbitrary clipboard in this subphase.
    parseHTML() {return [];},
    renderHTML({node}) {return ['span', {'data-equation':'','data-latex':node.attrs.latex,'data-display':node.attrs.display?'block':'inline'}, node.attrs.latex];},
    renderText({node}) {return node.attrs.display ? `\\[${node.attrs.latex}\\]` : `\\(${node.attrs.latex}\\)`;},
    addNodeView() {
      return ({node, editor, getPos}) => {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'equation-chip'; button.contentEditable = 'false';
        const update = (latex: string, display: boolean) => {
          const result = mathResult(latex, display);
          button.classList.toggle('display-equation', display);
          if (result.html) {button.innerHTML = result.html; button.classList.remove('invalid');}
          else {button.textContent = `Needs repair: ${latex}`; button.classList.add('invalid');}
          button.setAttribute('aria-label', `Edit equation in ${region}: ${latex}`);
        };
        update(node.attrs.latex, node.attrs.display);
        button.onclick = () => {
          const pos = getPos();
          if (typeof pos === 'number') {
            const current = editor.state.doc.nodeAt(pos);
            if (current?.type.name === 'equation') open({editor, pos, region, latex: current.attrs.latex, display: current.attrs.display});
          }
        };
        return {dom: button, stopEvent: () => true, update(next) {
          if (next.type.name !== 'equation') return false;
          update(next.attrs.latex, next.attrs.display); return true;
        }};
      };
    },
  });
}

function RichRegion({id, label, content, open, register, changed, reviewPaste}: {
  id: string; label: string; content: JSONContent; open: (target: Target) => void;
  register: (id: string, editor: Editor | null) => void; changed: (id: string, doc: JSONContent) => void;
  reviewPaste: (target: PasteTarget) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit.configure({heading: false, blockquote: false, codeBlock: false, code: false,
      horizontalRule: false, link: false, underline: false, strike: false}), equationExtension(open, id)],
    content, immediatelyRender: true,
    editorProps: {attributes: {'aria-label': `${label} rich text`, role: 'textbox', 'aria-multiline': 'true', dir: 'auto'},
      handlePaste: (_view, event) => {
        event.preventDefault();
        if (editor) {
          const html=event.clipboardData?.getData('text/html') ?? '';
          const plain=event.clipboardData?.getData('text/plain') ?? '';
          reviewPaste({editor,region:id,source:html || plain,plain,format:html?'html':plain.trim().startsWith('<math')?'mathml':'text',files:event.clipboardData?.files.length ?? 0});
        }
        return true;
      },
      handleDrop: (_view, event) => {event.preventDefault(); return true;}},
    onUpdate: ({editor}) => changed(id, editor.getJSON()),
  });
  useEffect(() => {register(id, editor); return () => register(id, null);}, [editor, id]);
  if (!editor) return null;
  return <section className="region" data-region={id}>
    <div className="region-heading"><h3>{label}</h3><button className="insert-button" onClick={() => open({editor, pos: null, region: id, latex: '', display: false})}>＋ Equation</button></div>
    <div className="toolbar" role="toolbar" aria-label={`${label} formatting`}>
      <button aria-label={`Bold in ${label}`} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></button>
      <button aria-label={`Italic in ${label}`} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button>
      <button onClick={() => editor.chain().focus().undo().run()}>Undo</button>
      <button onClick={() => editor.chain().focus().redo().run()}>Redo</button>
      <button onClick={() => reviewPaste({editor,region:id,source:'',plain:'',format:'text',files:0})}>Paste source</button>
    </div>
    <EditorContent editor={editor}/>
  </section>;
}

function FormulaDialog({target, apply, close}: {target: Target; apply: (latex: string, display: boolean) => void; close: () => void}) {
  const [latex, setLatex] = useState(target.latex);
  const [display, setDisplay] = useState(target.display);
  const [copyStatus, setCopyStatus] = useState('');
  const host = useRef<HTMLDivElement>(null);
  const field = useRef<MathfieldElement | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const keyboardDock = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(document.activeElement as HTMLElement);
  const result = mathResult(latex, display);
  useEffect(() => {
    const mf = new MathfieldElement();
    mf.mathVirtualKeyboardPolicy = 'manual'; mf.smartFence = false;
    mf.setAttribute('aria-label', 'Visual equation input');
    mf.addEventListener('input', () => setLatex(mf.value));
    host.current?.append(mf); field.current = mf;
    // Keep the touch keyboard inside the native dialog's modal top layer.
    if (keyboardDock.current) window.mathVirtualKeyboard.container = keyboardDock.current;
    window.mathVirtualKeyboard.layouts = [{label: 'Math', rows: [
      ['7', '8', '9', '+', String.raw`\frac{#0}{#?}`],
      ['4', '5', '6', '-', String.raw`#0^{#?}`],
      ['1', '2', '3', String.raw`\times`, String.raw`\sqrt{#0}`],
      ['0', 'x', '.', '=', {label: '⌫', command: ['performWithFeedback', 'deleteBackward']}],
    ]}];
    const resizeKeyboard = () => {
      if (keyboardDock.current) keyboardDock.current.style.height = `${window.mathVirtualKeyboard.boundingRect.height}px`;
    };
    window.mathVirtualKeyboard.addEventListener('geometrychange', resizeKeyboard);
    dialog.current?.showModal();
    const frame = requestAnimationFrame(() => mf.focus());
    return () => {cancelAnimationFrame(frame); window.mathVirtualKeyboard.hide();
      window.mathVirtualKeyboard.removeEventListener('geometrychange', resizeKeyboard);
      window.mathVirtualKeyboard.container = document.body;
      mf.remove(); field.current = null; returnFocus.current?.focus();};
  }, []);
  useEffect(() => {if (field.current?.value !== latex) field.current?.setValue(latex, {silenceNotifications: true});}, [latex]);
  function insert(value: string) {field.current?.focus(); field.current?.insert(value); if (field.current) setLatex(field.current.value);}
  async function copyEquation(format: 'latex' | 'mathml') {
    try {
      if(format==='latex') await navigator.clipboard.writeText(latex);
      else {
        const mml=equationMathML(latex);
        await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([mml],{type:'text/html'}),'text/plain':new Blob([mml],{type:'text/plain'})})]);
      }
      setCopyStatus(`${format==='latex'?'LaTeX source':'Presentation MathML'} copied. Word acceptance depends on the tested target workflow.`);
    } catch {setCopyStatus('Clipboard unavailable. Select and copy the source manually; no destination compatibility is implied.');}
  }
  return <dialog ref={dialog} className="formula-dialog" onCancel={close} aria-labelledby="formula-title"
    onKeyDownCapture={event => {if (event.key === 'Escape') {event.preventDefault(); close();}}}>
    <div className="dialog-header"><div><span className="eyebrow">EQUATION WORKSPACE</span><h2 id="formula-title">{target.pos === null ? 'Insert' : 'Edit'} equation</h2></div><button onClick={close} aria-label="Close equation editor">✕</button></div>
    <p>Editing <strong>{target.region.replace('option-', 'answer ')}</strong>. Use a template, type visually, or edit the LaTeX source.</p>
    <div className="template-grid" aria-label="Equation templates">{templates.map(([label, value]: string[]) => <button key={label} onClick={() => insert(value)}>{label}</button>)}</div>
    <label className="field-label">Visual input</label><div ref={host} className="mathfield-host"/>
    <button className="keyboard-toggle" onClick={() => {field.current?.focus(); window.mathVirtualKeyboard.show();
      if (keyboardDock.current) keyboardDock.current.style.height = `${window.mathVirtualKeyboard.boundingRect.height}px`;
    }}>Open math keyboard</button>
    <label className="field-label" htmlFor="latex-source">LaTeX source</label>
    <textarea id="latex-source" value={latex} onChange={e => setLatex(e.target.value)} spellCheck={false} autoCapitalize="off" rows={3}/>
    <label className="checkbox-label"><input type="checkbox" checked={display} onChange={e => setDisplay(e.target.checked)}/> Display style</label>
    <div className="math-preview" aria-label="Candidate student rendering">
      {result.html ? <div dangerouslySetInnerHTML={{__html: result.html}}/> : <p role="status">{result.error}</p>}
    </div>
    <div className="copy-actions"><button disabled={!result.html} onClick={() => copyEquation('latex')}>Copy LaTeX</button><button disabled={!result.html} onClick={() => copyEquation('mathml')}>Copy MathML</button></div>
    {copyStatus && <p role="status" className="copy-status">{copyStatus}</p>}
    <div ref={keyboardDock} className="keyboard-dock"/>
    <div className="dialog-actions"><button onClick={close}>Cancel</button><button className="primary" disabled={!result.html} onClick={() => apply(latex, display)}>Apply equation</button></div>
  </dialog>;
}

function PasteDialog({target,apply,close}: {target: PasteTarget; apply:(doc:JSONContent)=>void; close:()=>void}) {
  const [source,setSource]=useState(target.source);
  const [format,setFormat]=useState(target.format);
  const dialog=useRef<HTMLDialogElement>(null);
  const priorFocus=useRef<HTMLElement | null>(document.activeElement as HTMLElement);
  const result=normalizePaste({source,format,files:target.files});
  useEffect(()=>{dialog.current?.showModal();return()=>priorFocus.current?.focus();},[]);
  return <dialog ref={dialog} className="formula-dialog paste-dialog" aria-labelledby="paste-title" onCancel={close} onKeyDownCapture={e=>{if(e.key==='Escape'){e.preventDefault();close();}}}>
    <div className="dialog-header"><div><span className="eyebrow">REVIEW BEFORE INSERTING</span><h2 id="paste-title">Check your pasted content</h2></div><button onClick={close} aria-label="Close paste review">✕</button></div>
    <p>Destination: <strong>{target.region}</strong>. Your current question stays unchanged until you insert the reviewed content.</p>
    <label className="field-label" htmlFor="paste-format">Source format</label><select id="paste-format" value={format} onChange={e=>{setFormat(e.target.value);if(['text','latex'].includes(e.target.value) && target.plain)setSource(target.plain);else if(e.target.value==='html' && target.format==='html')setSource(target.source);}}>
      <option value="text">Text with explicit math delimiters</option><option value="latex">One LaTeX equation</option><option value="mathml">Presentation MathML subset</option><option value="html">Rich HTML subset</option></select>
    <label className="field-label" htmlFor="paste-source">Retained source — edit to repair</label><textarea id="paste-source" value={source} onChange={e=>setSource(e.target.value)} spellCheck={false} rows={5}/>
    <p className="paste-limit">Experiment limit: {MAX_PASTE.toLocaleString()} characters. Word native/legacy objects, images, tables and unsupported markup need a separate reviewed import or repair.</p>
    {result.error ? <p role="alert" className="paste-error">{result.error}</p> : <><h3>Normalized preview</h3><div className="math-preview paste-preview" aria-label="Normalized paste preview">{result.doc && <PreviewNode node={result.doc}/>}</div>{result.warnings.map((warning:string)=><p className="paste-limit" key={warning}>{warning}</p>)}</>}
    <div className="dialog-actions"><button onClick={close}>Cancel</button><button className="primary" disabled={!result.doc} onClick={()=>{if(result.doc)apply(result.doc);}}>Insert reviewed content</button></div>
  </dialog>;
}

function PreviewNode({node}: {node: JSONContent}) {
  if (node.type === 'text') {
    let result: React.ReactNode = node.text;
    for (const mark of node.marks ?? []) {
      if (mark.type === 'bold') result = <strong>{result}</strong>;
      if (mark.type === 'italic') result = <em>{result}</em>;
    }
    return <>{result}</>;
  }
  if (node.type === 'equation') {
    const result = mathResult(node.attrs?.latex, node.attrs?.display);
    return result.html ? <span className={`preview-equation ${node.attrs?.display ? 'display-equation' : ''}`} dangerouslySetInnerHTML={{__html: result.html}}/> : <span className="invalid">Needs repair: {node.attrs?.latex}</span>;
  }
  const children = node.content?.map((child, index) => <PreviewNode key={index} node={child}/>);
  switch (node.type) {
    case 'paragraph': return <p dir="auto">{children}</p>;
    case 'bulletList': return <ul>{children}</ul>;
    case 'orderedList': return <ol>{children}</ol>;
    case 'listItem': return <li>{children}</li>;
    case 'hardBreak': return <br/>;
    default: return <>{children}</>;
  }
}

function App() {
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [tab, setTab] = useState('prompt');
  const [target, setTarget] = useState<Target | null>(null);
  const [pasteTarget,setPasteTarget]=useState<PasteTarget | null>(null);
  const [appearance, setAppearance] = useState<Appearance>('system');
  const [status, setStatus] = useState('Synthetic practice question · nothing published');
  const [showPreview, setShowPreview] = useState(false);
  const editors = useRef<Record<string, Editor>>({});
  useEffect(() => {
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => {document.documentElement.dataset.theme = appearance === 'system' ? (system.matches ? 'dark' : 'light') : appearance;};
    update(); system.addEventListener('change', update); return () => system.removeEventListener('change', update);
  }, [appearance]);
  function changed(id: string, doc: JSONContent) {setDraft(d => ({...d, regions: {...d.regions, [id]: doc}}));}
  function apply(latex: string, display: boolean) {
    if (!target || !mathResult(latex, display).html) return;
    const {editor, pos} = target;
    if (pos === null) editor.chain().focus().insertContent({type: 'equation', attrs: {latex, display}}).run();
    else if (editor.state.doc.nodeAt(pos)?.type.name === 'equation') editor.chain().focus().setNodeSelection(pos).updateAttributes('equation', {latex, display}).run();
    setTarget(null); setStatus('Equation updated · save to keep this experiment draft');
  }
  function save() {
    try {
      const raw = JSON.stringify(draft); readDraft(raw);
      if (raw.length > MAX_DRAFT) throw Error('Draft is too large.');
      localStorage.setItem(STORAGE_KEY, raw); setStatus('Experiment draft saved in this browser');
    } catch {setStatus('Could not save this draft. Browser storage may be unavailable or the draft is too large.');}
  }
  function reopen() {
    try {
      const saved = readDraft(localStorage.getItem(STORAGE_KEY));
      for (const key of regionKeys) editors.current[key]?.commands.setContent(saved.regions[key]);
      setDraft(saved); setStatus('Saved structured draft reopened · equations remain editable');
    } catch {setStatus('No valid saved experiment draft found. Your current content is unchanged.');}
  }
  const labels: Record<string, string> = {prompt: 'Question prompt', 'option-a': 'Answer A', 'option-b': 'Answer B', 'option-c': 'Answer C', 'option-d': 'Answer D', explanation: 'Explanation'};
  return <div className="app-shell">
    <header className="app-header"><a href="#main" className="brand"><span className="brand-mark">gd</span><span>GD Tutor<span className="brand-caption">AUTHORING LAB</span></span></a>
      <label className="appearance-label">Appearance<select aria-label="Appearance" value={appearance} onChange={e => setAppearance(e.target.value as Appearance)}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label>
    </header>
    <main id="main"><div className="page-heading"><div><span className="eyebrow">EXPERIMENT 1.5.3</span><h1>Make ideas clear.</h1><p>Write a question. Give every equation room to make sense.</p></div><span className="scope-badge">Local prototype</span></div>
      <div className="experiment-note">Paste opens a review before insertion. Try text with explicit math delimiters, a LaTeX equation, or the tested HTML/MathML subset. Unsupported Word objects and images stay flagged for repair. Destination compatibility is recorded per experiment.</div>
      <div className="workspace">
        <section className="editor-panel" aria-label="Question authoring"><div className="panel-heading"><div><span className="eyebrow">QUESTION 01</span><h2>A little calculus</h2></div><button onClick={() => setShowPreview(x => !x)} aria-expanded={showPreview}>{showPreview ? 'Hide' : 'Show'} student preview</button></div>
          <div role="tablist" aria-label="Question sections" className="tabs">{[['prompt', 'Prompt'], ['answers', 'Answers'], ['explanation', 'Explanation']].map(([key, label]) => <button key={key} role="tab" id={`tab-${key}`} aria-controls={`panel-${key}`} aria-selected={tab === key} tabIndex={tab === key ? 0 : -1} onClick={() => setTab(key)} onKeyDown={e => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
            e.preventDefault(); const keys = ['prompt', 'answers', 'explanation']; const i = keys.indexOf(key);
            const next = e.key === 'Home' ? 0 : e.key === 'End' ? 2 : (i + (e.key === 'ArrowRight' ? 1 : 2)) % 3;
            setTab(keys[next]); document.getElementById(`tab-${keys[next]}`)?.focus();
          }}>{label}</button>)}</div>
          {['prompt', 'answers', 'explanation'].map(section => <div key={section} role="tabpanel" id={`panel-${section}`} aria-labelledby={`tab-${section}`} hidden={tab !== section}>
            {(section === 'answers' ? regionKeys.filter(x => x.startsWith('option-')) : [section]).map(id => <RichRegion key={id} id={id} label={labels[id]} content={draft.regions[id]} open={setTarget} changed={changed} reviewPaste={setPasteTarget} register={(key, editor) => {if (editor) editors.current[key] = editor; else delete editors.current[key];}}/>)}
            {section === 'answers' && <label className="correct-label">Correct answer<select aria-label="Correct answer" value={draft.correctOption} onChange={e => setDraft({...draft, correctOption: e.target.value})}>{['a', 'b', 'c', 'd'].map(x => <option value={`option-${x}`} key={x}>Answer {x.toUpperCase()}</option>)}</select></label>}
          </div>)}
          <div className="save-row"><p role="status">{status}</p><div><button onClick={reopen}>Reopen saved</button><button className="primary" onClick={save}>Save experiment</button></div></div>
        </section>
        <aside className="guide"><span className="eyebrow">A SMALL WORKSPACE. BIG IDEAS.</span><h2>From a thought<br/>to a formula.</h2><p>Select any equation to edit it. Use visual templates or LaTeX, with a consistent candidate preview.</p><ol><li><strong>Shape the question</strong><span>Add text and inline equations.</span></li><li><strong>Build each answer</strong><span>Keep formulas editable in every option.</span></li><li><strong>Explain the reasoning</strong><span>Save and reopen structured content.</span></li></ol><p className="guide-foot">Tiptap OSS · MathLive · KaTeX<br/>Candidates under evaluation</p></aside>
      </div>
      {showPreview && <section className="student-preview" aria-label="Student preview"><span className="eyebrow">STUDENT PREVIEW · CANDIDATE RENDERING</span><h2>Try it from the other side.</h2><PreviewNode node={draft.regions.prompt}/><div className="answer-preview-grid">{regionKeys.filter(x => x.startsWith('option-')).map(key => <div className="answer-preview" key={key}><PreviewNode node={draft.regions[key]}/></div>)}</div><h3>Explanation preview</h3><PreviewNode node={draft.regions.explanation}/></section>}
      <footer>Independent React experiment · no backend, publication or production data</footer>
    </main>{target && <FormulaDialog target={target} apply={apply} close={() => setTarget(null)}/>}
    {pasteTarget && <PasteDialog target={pasteTarget} close={()=>setPasteTarget(null)} apply={doc=>{
      pasteTarget.editor.chain().focus().insertContent(doc.content ?? []).run();
      setPasteTarget(null);setStatus('Reviewed content inserted · save this experiment draft to retain editable source');
    }}/>}
  </div>;
}

createRoot(document.getElementById('root')!).render(<App/>);
