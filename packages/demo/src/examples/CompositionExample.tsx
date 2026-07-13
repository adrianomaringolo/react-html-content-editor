import { useState } from "react";
import {
  ContentEditor,
  ContentEditorToolbar,
  ContentEditorBody,
  ContentEditorCode,
  ContentEditorPreview,
  ContentEditorWysiwyg,
  WysiwygToolbar,
  WysiwygSeparator,
  WysiwygBold,
  WysiwygItalic,
  WysiwygUnderline,
  WysiwygHeading,
  WysiwygParagraph,
  WysiwygUnorderedList,
  WysiwygOrderedList,
  WysiwygLink,
  WysiwygContent,
} from "react-html-content-editor";

/**
 * ContentEditor — composition + integrated WYSIWYG
 *
 * The ContentEditor is assembled from composable parts, exactly like the
 * standalone Wysiwyg. Toggle between the code view (Monaco HTML/CSS + live
 * preview) and the visual WYSIWYG editor from the toolbar — both edit the
 * same shared value. The toolbar itself is fully styleable via `className`.
 */

const INITIAL = {
  html: `<h1>Compose the whole editor</h1>
<p>Switch between <strong>Code</strong> and <strong>Visual</strong> from the toolbar. Both views edit the same HTML — and the CSS you write is applied to the visual editor too.</p>
<ul>
  <li>Monaco HTML/CSS editors + live preview</li>
  <li>Rich-text WYSIWYG surface</li>
  <li>One shared value, assembled by composition</li>
</ul>`,
  css: `h1 {
  color: #6d28d9;
  font-size: 1.75rem;
}
p { line-height: 1.6; }
ul { color: #374151; }`,
};

const SNIPPET = `<ContentEditor value={content} onChange={setContent}>
  <ContentEditorToolbar className="toolbar-pill" />
  <ContentEditorBody>
    <ContentEditorCode />
    <ContentEditorPreview />
    <ContentEditorWysiwyg>
      <WysiwygToolbar>
        <WysiwygHeading level={1} />
        <WysiwygBold />
        <WysiwygItalic />
        <WysiwygLink />
      </WysiwygToolbar>
      <WysiwygContent />
    </ContentEditorWysiwyg>
  </ContentEditorBody>
</ContentEditor>`;

type ToolbarStyle = "default" | "pill" | "minimal" | "accent";

const TOOLBAR_STYLES: Record<
  ToolbarStyle,
  { label: string; className: string; css: string }
> = {
  default: {
    label: "Default",
    className: "",
    css: "/* No className — the built-in toolbar styling. */",
  },
  pill: {
    label: "Dark pills",
    className: "toolbar-pill",
    css: `.toolbar-pill {
  background: #0f172a;
  border-bottom: none;
  border-radius: 0.75rem 0.75rem 0 0;
}
/* neutralise the built-in button-group chrome */
.toolbar-pill > div > div {
  background: transparent;
  border-color: transparent;
}
.toolbar-pill button {
  border-radius: 9999px;
  color: #cbd5e1;
  border-color: transparent;
}
.toolbar-pill button[aria-pressed="true"] {
  background: #7c3aed;
  color: #fff;
}
.toolbar-pill button:hover {
  background: rgba(255, 255, 255, 0.1);
}`,
  },
  minimal: {
    label: "Minimal underline",
    className: "toolbar-minimal",
    css: `.toolbar-minimal {
  background: transparent;
  border-bottom: 2px solid var(--border, #e5e7eb);
  padding-left: 0;
  padding-right: 0;
}
.toolbar-minimal > div > div {
  background: transparent;
  border-color: transparent;
}
.toolbar-minimal button {
  background: transparent;
  border-color: transparent;
}
.toolbar-minimal button[aria-pressed="true"] {
  color: #7c3aed;
  border-radius: 0;
  box-shadow: inset 0 -2px 0 #7c3aed;
}`,
  },
  accent: {
    label: "Soft accent",
    className: "toolbar-accent",
    css: `.toolbar-accent {
  background: #f5f3ff;
  border-bottom-color: #ddd6fe;
}
.toolbar-accent > div > div {
  background: #fff;
  border-color: #ede9fe;
}
.toolbar-accent button[aria-pressed="true"] {
  background: #7c3aed;
  color: #fff;
  border-color: transparent;
}`,
  },
};

export function CompositionExample() {
  const [content, setContent] = useState(INITIAL);
  const [toolbarStyle, setToolbarStyle] = useState<ToolbarStyle>("pill");

  const active = TOOLBAR_STYLES[toolbarStyle];

  return (
    <div>
      <div className='example-header'>
        <h2>ContentEditor by composition</h2>
        <p>
          The full editor is now assembled from composable parts. Drop in a{" "}
          <code>ContentEditorToolbar</code>, the code and preview panes, and an
          integrated <code>ContentEditorWysiwyg</code>. The toolbar shows a{" "}
          <strong>Code / Visual</strong> switch whenever a WYSIWYG pane is
          present.
        </p>
      </div>

      <div className='example-controls' role='group' aria-label='Toolbar style'>
        {(Object.keys(TOOLBAR_STYLES) as ToolbarStyle[]).map((key) => (
          <button
            key={key}
            className={toolbarStyle === key ? "primary" : ""}
            onClick={() => setToolbarStyle(key)}
            aria-pressed={toolbarStyle === key}
          >
            {TOOLBAR_STYLES[key].label}
          </button>
        ))}
      </div>

      <ContentEditor value={content} onChange={setContent} height='520px'>
        <ContentEditorToolbar className={active.className} />
        <ContentEditorBody>
          <ContentEditorCode />
          <ContentEditorPreview />
          <ContentEditorWysiwyg>
            <WysiwygToolbar>
              <WysiwygHeading level={1} />
              <WysiwygHeading level={2} />
              <WysiwygParagraph />
              <WysiwygSeparator />
              <WysiwygBold />
              <WysiwygItalic />
              <WysiwygUnderline />
              <WysiwygSeparator />
              <WysiwygUnorderedList />
              <WysiwygOrderedList />
              <WysiwygLink />
            </WysiwygToolbar>
            <WysiwygContent placeholder='Start writing…' minHeight='360px' />
          </ContentEditorWysiwyg>
        </ContentEditorBody>
      </ContentEditor>

      <div className='wysiwyg-panels'>
        <section className='wysiwyg-panel'>
          <header className='wysiwyg-panel__header'>Compose it</header>
          <pre className='wysiwyg-code'>
            <code>{SNIPPET}</code>
          </pre>
        </section>
        <section className='wysiwyg-panel'>
          <header className='wysiwyg-panel__header'>
            Toolbar CSS — {active.label}
          </header>
          <pre className='wysiwyg-code'>
            <code>{active.css}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}
