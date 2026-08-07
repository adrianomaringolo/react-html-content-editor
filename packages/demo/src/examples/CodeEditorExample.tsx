import { useState } from "react";
import {
  ContentEditor,
  type CodeEditorComponent,
  type ContentValue,
} from "react-html-content-editor";
import { MonacoCodeEditor } from "react-html-content-editor/monaco";
import { CodeMirrorCodeEditor } from "../editors/CodeMirrorCodeEditor";
import { AceCodeEditor } from "../editors/AceCodeEditor";
import { HighlightCodeEditor } from "../editors/HighlightCodeEditor";

const initialValue: ContentValue = {
  html: `<section class="card">
  <h2>One editor, five surfaces</h2>
  <p>
    The HTML and CSS panes render whatever component you pass to
    <code>codeEditor</code>. Switch below — the content stays put.
  </p>
</section>`,
  css: `.card {
  font-family: system-ui, sans-serif;
  max-width: 480px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.card h2 {
  margin: 0 0 0.5rem;
}`,
};

type EditorChoice =
  | "textarea"
  | "monaco"
  | "codemirror"
  | "ace"
  | "highlight";

type ChoiceInfo = {
  label: string;
  /** `undefined` means the built-in default. */
  component?: CodeEditorComponent;
  install?: string;
  hint: string;
  format: string;
  snippet: string;
};

const CHOICES: Record<EditorChoice, ChoiceInfo> = {
  textarea: {
    label: "Built-in textarea",
    hint: "The default. A plain textarea with a line-number gutter, indentation handling and light/dark palettes. No extra dependency, nothing added to your bundle.",
    format: "No — the Format action is hidden.",
    snippet: `import { ContentEditor } from 'react-html-content-editor';

<ContentEditor value={value} onChange={setValue} />`,
  },
  monaco: {
    label: "Monaco",
    component: MonacoCodeEditor,
    install: "npm install @monaco-editor/react monaco-editor",
    hint: "The editor behind VS Code: highlighting, IntelliSense, folding and the full editorOptions surface. The heaviest option by a wide margin.",
    format: "Yes — editor.action.formatDocument.",
    snippet: `// npm install @monaco-editor/react monaco-editor

import { ContentEditor } from 'react-html-content-editor';
import { MonacoCodeEditor } from 'react-html-content-editor/monaco';

<ContentEditor
  value={value}
  onChange={setValue}
  codeEditor={MonacoCodeEditor}
/>`,
  },
  codemirror: {
    label: "CodeMirror 6",
    component: CodeMirrorCodeEditor,
    install:
      "npm install codemirror @codemirror/state @codemirror/view @codemirror/lang-html @codemirror/lang-css @codemirror/theme-one-dark",
    hint: "Highlighting, bracket matching and a real undo history at a fraction of Monaco's weight. The adapter is ~90 lines and ships with this demo.",
    format: "No — CodeMirror has no built-in formatter.",
    snippet: `// npm install codemirror @codemirror/state @codemirror/view \\
//   @codemirror/lang-html @codemirror/lang-css @codemirror/theme-one-dark

import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import type { CodeEditorHandle, CodeEditorProps } from 'react-html-content-editor';

function CodeMirrorCodeEditor({
  defaultValue, language, onChange, onReady, className,
}: CodeEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const view = new EditorView({
      parent: hostRef.current!,
      state: EditorState.create({
        doc: defaultValue,
        extensions: [
          basicSetup,
          language === 'css' ? css() : html(),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onChange(update.state.doc.toString());
          }),
        ],
      }),
    });

    const handle: CodeEditorHandle = {
      focus: () => view.focus(),
      format: () => false,
      getScrollTop: () => view.scrollDOM.scrollTop,
      getMaxScroll: () =>
        Math.max(0, view.scrollDOM.scrollHeight - view.scrollDOM.clientHeight),
      setScrollTop: (top) => { view.scrollDOM.scrollTop = top; },
      onScroll: (listener) => {
        view.scrollDOM.addEventListener('scroll', listener);
        return () => view.scrollDOM.removeEventListener('scroll', listener);
      },
    };
    onReady?.(handle);

    return () => { onReady?.(null); view.destroy(); };
  }, []);

  return <div ref={hostRef} className={className} style={{ flex: 1, minHeight: 0 }} />;
}

CodeMirrorCodeEditor.canFormat = false;

<ContentEditor
  value={value}
  onChange={setValue}
  codeEditor={CodeMirrorCodeEditor}
/>`,
  },
  ace: {
    label: "Ace",
    component: AceCodeEditor,
    install: "npm install ace-builds",
    hint: "The only non-Monaco option here that can reformat: ext-beautify handles HTML and CSS, so the Format action stays live. Syntax workers are switched off to keep it to one import.",
    format: "Yes — via ext-beautify.",
    snippet: `// npm install ace-builds

import ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/theme-monokai';
import beautify from 'ace-builds/src-noconflict/ext-beautify';
import type { CodeEditorHandle, CodeEditorProps } from 'react-html-content-editor';

function AceCodeEditor({
  defaultValue, language, onChange, onReady, className,
}: CodeEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = ace.edit(hostRef.current!, {
      value: defaultValue,
      mode: \`ace/mode/\${language}\`,
      theme: 'ace/theme/monokai',
      wrap: true,
      useWorker: false,
    });
    editor.on('change', () => onChange(editor.getValue()));

    // Ace does not observe its container; re-layout on resize.
    const observer = new ResizeObserver(() => editor.resize());
    observer.observe(hostRef.current!);

    const handle: CodeEditorHandle = {
      focus: () => editor.focus(),
      format: () => { beautify.beautify(editor.session); return true; },
      getScrollTop: () => editor.session.getScrollTop(),
      getMaxScroll: () => Math.max(
        0,
        editor.renderer.layerConfig.maxHeight - editor.renderer.$size.scrollerHeight,
      ),
      setScrollTop: (top) => editor.session.setScrollTop(top),
      onScroll: (listener) => {
        editor.session.on('changeScrollTop', listener);
        return () => editor.session.off('changeScrollTop', listener);
      },
    };
    onReady?.(handle);

    return () => { observer.disconnect(); onReady?.(null); editor.destroy(); };
  }, []);

  // Ace positions its layers absolutely.
  return <div ref={hostRef} className={className} style={{ flex: 1, position: 'relative' }} />;
}

AceCodeEditor.canFormat = true;

<ContentEditor value={value} onChange={setValue} codeEditor={AceCodeEditor} />`,
  },
  highlight: {
    label: "Custom (no deps)",
    component: HighlightCodeEditor,
    hint: "Not a wrapper around anything: a transparent textarea over a coloured <pre>, with a ~40-line regex highlighter. Proof that codeEditor accepts a surface you write yourself.",
    format: "No — nothing to format with.",
    snippet: `// No dependencies. The textarea and the <pre> share every property that
// affects layout, so the caret lands exactly on the coloured glyphs.

import type { CodeEditorHandle, CodeEditorProps } from 'react-html-content-editor';

function HighlightCodeEditor({
  defaultValue, language, onChange, onReady, ariaLabel,
}: CodeEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(defaultValue);

  useEffect(() => {
    const handle: CodeEditorHandle = {
      focus: () => ref.current?.focus(),
      format: () => false,
      getScrollTop: () => ref.current?.scrollTop ?? 0,
      getMaxScroll: () => Math.max(
        0,
        (ref.current?.scrollHeight ?? 0) - (ref.current?.clientHeight ?? 0),
      ),
      setScrollTop: (top) => { if (ref.current) ref.current.scrollTop = top; },
      onScroll: (listener) => {
        ref.current?.addEventListener('scroll', listener);
        return () => ref.current?.removeEventListener('scroll', listener);
      },
    };
    onReady?.(handle);
    return () => onReady?.(null);
  }, []);

  return (
    <div className='hce-editor'>
      <pre className='hce-highlight' aria-hidden='true'>
        <code>{tokenize(text, language).map(renderToken)}</code>
      </pre>
      <textarea
        ref={ref}
        className='hce-input'
        value={text}
        aria-label={ariaLabel}
        onChange={(e) => { setText(e.target.value); onChange(e.target.value); }}
      />
    </div>
  );
}

HighlightCodeEditor.canFormat = false;`,
  },
};

const ORDER: EditorChoice[] = [
  "textarea",
  "monaco",
  "codemirror",
  "ace",
  "highlight",
];

export function CodeEditorExample() {
  const [value, setValue] = useState<ContentValue>(initialValue);
  const [choice, setChoice] = useState<EditorChoice>("textarea");

  const active = CHOICES[choice];

  return (
    <div className='example-container'>
      <div className='example-header'>
        <h2>Code editor: bring your own</h2>
        <p>
          The HTML/CSS panes render whatever you pass to <code>codeEditor</code>
          . Monaco is an optional peer dependency shipped in its own entry
          point; anything else implementing <code>CodeEditorProps</code> —
          CodeMirror, Ace, or a surface you write yourself — drops in the same
          way. The four adapters below live in this demo&rsquo;s{" "}
          <code>src/editors/</code>, ready to copy.
        </p>
      </div>

      <div className='example-controls' role='group' aria-label='Code editor'>
        {ORDER.map((key) => (
          <button
            key={key}
            type='button'
            className={choice === key ? "primary" : ""}
            onClick={() => setChoice(key)}
            aria-pressed={choice === key}
          >
            {CHOICES[key].label}
          </button>
        ))}
      </div>

      <div className='example-info'>
        <strong>{active.label}:</strong> {active.hint}
        <br />
        <strong>Format action:</strong> {active.format}
        {active.install ? (
          <>
            <br />
            <strong>Install:</strong> <code>{active.install}</code>
          </>
        ) : (
          <>
            <br />
            <strong>Install:</strong> nothing — no dependency.
          </>
        )}
      </div>

      <div className='example-content'>
        {/* Remounting on switch is intentional: it swaps the editor surface. */}
        <ContentEditor
          key={choice}
          value={value}
          onChange={setValue}
          codeEditor={active.component}
          height='460px'
        />
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Usage
        </h3>
        <pre>
          <code>{active.snippet}</code>
        </pre>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Writing your own adapter
        </h3>
        <p style={{ marginBottom: "0.75rem" }}>
          Two contracts, and that is the whole surface:
        </p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>Props in.</strong> The pane passes{" "}
            <code>defaultValue</code>, <code>language</code>,{" "}
            <code>theme</code>, <code>options</code>, <code>onChange</code>,{" "}
            <code>onReady</code>, <code>className</code> and{" "}
            <code>ariaLabel</code>. The surface is <em>uncontrolled</em>: seed it
            once from <code>defaultValue</code> and report every edit through{" "}
            <code>onChange</code>.
          </li>
          <li>
            <strong>Handle out.</strong> Call <code>onReady(handle)</code> on
            mount and <code>onReady(null)</code> on unmount. The handle&rsquo;s
            six methods — <code>focus</code>, <code>format</code>,{" "}
            <code>getScrollTop</code>, <code>getMaxScroll</code>,{" "}
            <code>setScrollTop</code>, <code>onScroll</code> — are what power the
            Format action and preview scroll sync.
          </li>
          <li>
            <strong>Declare formatting.</strong> Set{" "}
            <code>MyEditor.canFormat = false</code> when the implementation
            cannot reformat; the toolbars then hide the Format action instead of
            showing a button that does nothing.
          </li>
          <li>
            Every option above uses the <em>same</em> <code>ContentEditor</code>{" "}
            props, so switching is a one-line change and no content is lost.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CodeEditorExample;
