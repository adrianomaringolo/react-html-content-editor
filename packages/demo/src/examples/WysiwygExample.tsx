import { useState } from "react";
import { ContentEditor } from "react-html-content-editor";

/**
 * WYSIWYG Editor Example (Work in Progress)
 *
 * This example demonstrates a WYSIWYG (What You See Is What You Get) editor
 * built on top of the ContentEditor component. This is currently in development
 * and shows how you can extend the editor with visual editing capabilities.
 *
 * Features being developed:
 * - Visual toolbar for text formatting (bold, italic, headings, etc.)
 * - Inline editing with contentEditable
 * - Real-time HTML generation from visual edits
 * - Drag and drop image support
 * - Link insertion dialog
 * - Table creation and editing
 */

interface WysiwygToolbarProps {
  onInsert: (html: string) => void;
}

function WysiwygToolbar({ onInsert }: WysiwygToolbarProps) {
  const insertHeading = (level: number) => {
    onInsert(`<h${level}>Heading ${level}</h${level}>\n`);
  };

  const insertParagraph = () => {
    onInsert(`<p>New paragraph</p>\n`);
  };

  const insertList = (ordered: boolean) => {
    const tag = ordered ? "ol" : "ul";
    onInsert(
      `<${tag}>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</${tag}>\n`,
    );
  };

  const insertButton = () => {
    onInsert(`<button class="btn">Click me</button>\n`);
  };

  const insertCard = () => {
    onInsert(
      `<div class="card">\n` +
        `  <h3>Card Title</h3>\n` +
        `  <p>Card content goes here.</p>\n` +
        `</div>\n`,
    );
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        padding: "1rem",
        background: "#f9fafb",
        borderRadius: "0.5rem",
        marginBottom: "1rem",
        flexWrap: "wrap",
        border: "2px dashed #e5e7eb",
      }}
    >
      <div style={{ width: "100%", marginBottom: "0.5rem" }}>
        <strong>🚧 WYSIWYG Toolbar (In Development)</strong>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            margin: "0.25rem 0 0 0",
          }}
        >
          Click buttons below to insert HTML elements
        </p>
      </div>

      <button
        onClick={() => insertHeading(1)}
        style={{
          padding: "0.5rem 1rem",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "0.375rem",
          cursor: "pointer",
          fontSize: "1.25rem",
          fontWeight: "bold",
        }}
        title='Insert H1'
      >
        H1
      </button>

      <button
        onClick={() => insertHeading(2)}
        style={{
          padding: "0.5rem 1rem",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "0.375rem",
          cursor: "pointer",
          fontSize: "1.125rem",
          fontWeight: "bold",
        }}
        title='Insert H2'
      >
        H2
      </button>

      <button
        onClick={() => insertHeading(3)}
        style={{
          padding: "0.5rem 1rem",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "0.375rem",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "bold",
        }}
        title='Insert H3'
      >
        H3
      </button>

      <button
        onClick={insertParagraph}
        style={{
          padding: "0.5rem 1rem",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "0.375rem",
          cursor: "pointer",
        }}
        title='Insert Paragraph'
      >
        ¶ Paragraph
      </button>

      <button
        onClick={() => insertList(false)}
        style={{
          padding: "0.5rem 1rem",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "0.375rem",
          cursor: "pointer",
        }}
        title='Insert Bullet List'
      >
        • List
      </button>

      <button
        onClick={() => insertList(true)}
        style={{
          padding: "0.5rem 1rem",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "0.375rem",
          cursor: "pointer",
        }}
        title='Insert Numbered List'
      >
        1. Numbered
      </button>

      <button
        onClick={insertButton}
        style={{
          padding: "0.5rem 1rem",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "0.375rem",
          cursor: "pointer",
        }}
        title='Insert Button'
      >
        🔘 Button
      </button>

      <button
        onClick={insertCard}
        style={{
          padding: "0.5rem 1rem",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "0.375rem",
          cursor: "pointer",
        }}
        title='Insert Card'
      >
        📄 Card
      </button>
    </div>
  );
}

export function WysiwygExample() {
  const [content, setContent] = useState({
    html: `<div class="container">
  <h1>Welcome to WYSIWYG Editor</h1>
  <p>This is a <strong>work in progress</strong> example of a visual editor built on top of ContentEditor.</p>
  
  <h2>Current Features</h2>
  <ul>
    <li>Insert common HTML elements via toolbar</li>
    <li>Edit HTML directly in the code editor</li>
    <li>See live preview with custom styles</li>
    <li>Toggle between edit and preview modes</li>
  </ul>
  
  <h2>Planned Features</h2>
  <ol>
    <li>Inline text editing with contentEditable</li>
    <li>Drag and drop components</li>
    <li>Image upload and management</li>
    <li>Link insertion dialog</li>
    <li>Table editor</li>
    <li>Undo/Redo functionality</li>
  </ol>
  
  <div class="card">
    <h3>Try It Out!</h3>
    <p>Use the toolbar above to insert elements, or edit the HTML directly.</p>
    <button class="btn">Click Me</button>
  </div>
</div>`,
    css: `.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  color: #1e40af;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  border-bottom: 3px solid #3b82f6;
  padding-bottom: 0.5rem;
}

h2 {
  color: #1e3a8a;
  font-size: 1.875rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

h3 {
  color: #1e40af;
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
  color: #374151;
}

ul, ol {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

strong {
  color: #dc2626;
  font-weight: 600;
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-top: 2rem;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.card h3 {
  color: white;
  margin-top: 0;
}

.card p {
  color: rgba(255, 255, 255, 0.9);
}

.btn {
  background: white;
  color: #667eea;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn:active {
  transform: translateY(0);
}`,
  });

  const handleInsert = (html: string) => {
    setContent((prev) => ({
      ...prev,
      html: prev.html + "\n" + html,
    }));
  };

  const handleSave = async () => {
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Content saved:", content);
    alert("Content saved successfully!");
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "0.5rem",
          }}
        >
          🚧 WYSIWYG Editor (Work in Progress)
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
          This example demonstrates a visual editor being built on top of
          ContentEditor. Use the toolbar to insert elements, or edit the
          HTML/CSS directly.
        </p>

        <div
          style={{
            background: "#fef3c7",
            border: "1px solid #fbbf24",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <strong style={{ color: "#92400e" }}>⚠️ Development Status:</strong>
          <p
            style={{
              color: "#92400e",
              margin: "0.5rem 0 0 0",
              fontSize: "0.875rem",
            }}
          >
            This is a proof-of-concept showing how to build a WYSIWYG editor.
            Future versions will include inline editing, drag-and-drop, and more
            visual tools.
          </p>
        </div>
      </div>

      <WysiwygToolbar onInsert={handleInsert} />

      <ContentEditor
        value={content}
        onChange={setContent}
        onSave={handleSave}
        height='600px'
        theme='vs-dark'
      />

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#f9fafb",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            marginBottom: "0.5rem",
          }}
        >
          💡 Implementation Tips
        </h3>
        <ul
          style={{
            margin: "0.5rem 0 0 1.5rem",
            color: "#6b7280",
            fontSize: "0.875rem",
          }}
        >
          <li>Use the toolbar to quickly insert common HTML structures</li>
          <li>Switch to the HTML editor to fine-tune the markup</li>
          <li>Use the CSS editor to customize the visual appearance</li>
          <li>Toggle between Edit and Preview to see your changes</li>
          <li>Click both Edit and Preview buttons for split view</li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#eff6ff",
          borderRadius: "0.5rem",
          border: "1px solid #3b82f6",
        }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            marginBottom: "0.5rem",
            color: "#1e40af",
          }}
        >
          🔮 Planned Features
        </h3>
        <ul
          style={{
            margin: "0.5rem 0 0 1.5rem",
            color: "#1e40af",
            fontSize: "0.875rem",
          }}
        >
          <li>
            <strong>Inline Editing:</strong> Click directly on preview to edit
            text
          </li>
          <li>
            <strong>Component Library:</strong> Drag and drop pre-built
            components
          </li>
          <li>
            <strong>Image Manager:</strong> Upload and manage images with
            preview
          </li>
          <li>
            <strong>Link Dialog:</strong> Visual interface for creating links
          </li>
          <li>
            <strong>Table Editor:</strong> Visual table creation and editing
          </li>
          <li>
            <strong>History:</strong> Undo/Redo with keyboard shortcuts
          </li>
          <li>
            <strong>Templates:</strong> Save and load content templates
          </li>
        </ul>
      </div>
    </div>
  );
}
