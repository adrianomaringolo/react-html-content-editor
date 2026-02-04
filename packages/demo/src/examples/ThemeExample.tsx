import { useState } from "react";
import { ContentEditor, ContentValue } from "react-html-content-editor";

const initialValue: ContentValue = {
  html: `<div class="theme-demo">
  <h1>🎨 Theme Customization</h1>
  
  <section class="intro">
    <p>
      The ContentEditor supports both light and dark themes for the Monaco Editor.
      Switch between themes to find the one that works best for your workflow.
    </p>
  </section>
  
  <section class="features">
    <h2>Theme Features</h2>
    <div class="feature-grid">
      <div class="feature">
        <h3>☀️ Light Theme</h3>
        <p>Clean and bright, perfect for well-lit environments</p>
      </div>
      <div class="feature">
        <h3>🌙 Dark Theme</h3>
        <p>Easy on the eyes, ideal for low-light coding sessions</p>
      </div>
      <div class="feature">
        <h3>🎯 Syntax Highlighting</h3>
        <p>Full Monaco Editor syntax highlighting in both themes</p>
      </div>
      <div class="feature">
        <h3>⚙️ Customizable</h3>
        <p>Pass custom Monaco Editor options for full control</p>
      </div>
    </div>
  </section>
  
  <section class="code-sample">
    <h2>Code Example</h2>
    <pre><code>import { ContentEditor } from 'react-html-content-editor';

function MyEditor() {
  return (
    &lt;ContentEditor
      value={value}
      onChange={setValue}
      theme="vs-dark"
    /&gt;
  );
}</code></pre>
  </section>
</div>`,
  css: `.theme-demo {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

.theme-demo h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.intro {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f0f9ff;
  border-left: 4px solid #0ea5e9;
  border-radius: 4px;
}

.intro p {
  color: #0c4a6e;
  line-height: 1.6;
  margin: 0;
}

.features {
  margin-bottom: 2rem;
}

.features h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.feature {
  padding: 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.feature:hover {
  border-color: #667eea;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.1);
}

.feature h3 {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: #374151;
}

.feature p {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.code-sample {
  margin-top: 2rem;
}

.code-sample h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.code-sample pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
}

.code-sample code {
  color: #f9fafb;
}`,
};

function ThemeExample() {
  const [value, setValue] = useState<ContentValue>(initialValue);
  const [theme, setTheme] = useState<"vs-dark" | "vs-light">("vs-dark");

  return (
    <div className='example-container'>
      <div className='example-header'>
        <h2>Theme Customization</h2>
        <p>
          Switch between light and dark themes for the Monaco Editor. The theme
          affects the editor's appearance while maintaining full syntax
          highlighting and functionality.
        </p>
      </div>

      <div className='example-controls'>
        <button
          className={theme === "vs-light" ? "primary" : ""}
          onClick={() => setTheme("vs-light")}
        >
          ☀️ Light Theme
        </button>
        <button
          className={theme === "vs-dark" ? "primary" : ""}
          onClick={() => setTheme("vs-dark")}
        >
          🌙 Dark Theme
        </button>
      </div>

      <div className='example-info'>
        <strong>Current Theme:</strong> {theme === "vs-dark" ? "Dark" : "Light"}{" "}
        • <strong>Try it:</strong> Click the theme buttons above to switch
        between light and dark modes. Notice how the editor's appearance changes
        while preserving all functionality.
      </div>

      <div className='example-content'>
        <ContentEditor
          value={value}
          onChange={setValue}
          theme={theme}
          height='500px'
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
          Theme Customization Options
        </h3>
        <ul style={{ color: "#6b7280", fontSize: "0.875rem", lineHeight: 1.6 }}>
          <li>
            <strong>Built-in Themes:</strong> Choose between "vs-light" (light)
            and "vs-dark" (dark) themes
          </li>
          <li>
            <strong>Syntax Highlighting:</strong> Full Monaco Editor syntax
            highlighting in both themes
          </li>
          <li>
            <strong>Custom Options:</strong> Pass custom Monaco Editor options
            via the editorOptions prop
          </li>
          <li>
            <strong>CSS Variables:</strong> Customize the component's UI colors
            using CSS custom properties
          </li>
          <li>
            <strong>Consistent Experience:</strong> Theme applies to both HTML
            and CSS editors
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#fef3c7",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          color: "#78350f",
        }}
      >
        <strong>💡 Pro Tip:</strong> You can also customize the component's UI
        theme by setting the <code>data-theme</code> attribute on a parent
        element. The component includes CSS variables for easy customization.
      </div>
    </div>
  );
}

export default ThemeExample;
