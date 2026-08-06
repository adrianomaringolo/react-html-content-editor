import { useState } from "react";
import { ContentEditor, ContentValue } from "react-html-content-editor";
import { MonacoCodeEditor } from "react-html-content-editor/monaco";

const initialValue: ContentValue = {
  html: `<section class="card">
  <h2>Optional Monaco</h2>
  <p>
    The editor works out of the box with no editor dependency. Install
    Monaco only when you want syntax highlighting and formatting.
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

type EditorChoice = "textarea" | "monaco";

const CHOICES: Record<
  EditorChoice,
  { label: string; hint: string; snippet: string }
> = {
  textarea: {
    label: "Built-in textarea",
    hint: "Default. No extra dependency, ~0 kB added to your bundle.",
    snippet: `import { ContentEditor } from 'react-html-content-editor';

<ContentEditor value={value} onChange={setValue} />`,
  },
  monaco: {
    label: "Monaco",
    hint: "Syntax highlighting, IntelliSense and Format. Requires the optional peer dependencies.",
    snippet: `// npm install @monaco-editor/react monaco-editor

import { ContentEditor } from 'react-html-content-editor';
import { MonacoCodeEditor } from 'react-html-content-editor/monaco';

<ContentEditor
  value={value}
  onChange={setValue}
  codeEditor={MonacoCodeEditor}
/>`,
  },
};

export function CodeEditorExample() {
  const [value, setValue] = useState<ContentValue>(initialValue);
  const [choice, setChoice] = useState<EditorChoice>("textarea");

  const active = CHOICES[choice];

  return (
    <div className='example-container'>
      <div className='example-header'>
        <h2>Code editor: textarea or Monaco</h2>
        <p>
          Monaco is an optional peer dependency. Without it the HTML/CSS panes
          use a built-in textarea with a line-number gutter; install it and pass{" "}
          <code>codeEditor</code> to upgrade the same editor in place.
        </p>
      </div>

      <div className='example-controls' role='group' aria-label='Code editor'>
        {(Object.keys(CHOICES) as EditorChoice[]).map((key) => (
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
      </div>

      <div className='example-content'>
        {/* Remounting on switch is intentional: it swaps the editor surface. */}
        <ContentEditor
          key={choice}
          value={value}
          onChange={setValue}
          codeEditor={choice === "monaco" ? MonacoCodeEditor : undefined}
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
          What changes
        </h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>Textarea:</strong> line numbers, Tab / Shift+Tab
            indentation, indentation-preserving Enter, light and dark palettes,
            scroll sync. No syntax highlighting, and the Format action is hidden
            because there is nothing to format with.
          </li>
          <li>
            <strong>Monaco:</strong> everything above plus highlighting,
            IntelliSense, the Format action and the full{" "}
            <code>editorOptions</code> surface.
          </li>
          <li>
            Both share the same props, so switching is a one-line change and no
            content is lost.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CodeEditorExample;
