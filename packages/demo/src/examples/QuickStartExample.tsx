import { useState } from "react";
import { ContentEditor } from "react-html-content-editor";

export function QuickStartExample() {
  const [content, setContent] = useState({
    html: "<h1>Hello World!</h1>\n<p>Start editing to see the magic happen.</p>",
    css: "h1 {\n  color: #3b82f6;\n  font-size: 2rem;\n}\n\np {\n  color: #6b7280;\n}",
  });

  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "3rem 2rem",
          borderRadius: "1rem",
          marginBottom: "2rem",
          boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            marginBottom: "1rem",
          }}
        >
          React HTML Content Editor
        </h1>
        <p
          style={{ fontSize: "1.25rem", opacity: 0.95, marginBottom: "1.5rem" }}
        >
          A powerful, feature-rich HTML and CSS editor built with React and
          Monaco Editor
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>✨</span>
            <span>Monaco Editor Integration</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🎨</span>
            <span>Live Preview</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>⚡</span>
            <span>Auto-Save</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🖥️</span>
            <span>Fullscreen Mode</span>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "1rem" }}
        >
          🚀 Quick Start
        </h2>

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            1. Installation
          </h3>
          <pre
            style={{
              background: "#1e1e1e",
              color: "#d4d4d4",
              padding: "1rem",
              borderRadius: "0.375rem",
              overflow: "auto",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            <code>npm install react-html-content-editor</code>
          </pre>
        </div>

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            2. Import Styles
          </h3>
          <p
            style={{
              color: "#6b7280",
              marginBottom: "0.75rem",
              fontSize: "0.875rem",
            }}
          >
            Don't forget to import the CSS file in your app:
          </p>
          <pre
            style={{
              background: "#1e1e1e",
              color: "#d4d4d4",
              padding: "1rem",
              borderRadius: "0.375rem",
              overflow: "auto",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            <code>{`import "react-html-content-editor/dist/style.css";`}</code>
          </pre>
        </div>

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            3. Basic Usage
          </h3>
          <pre
            style={{
              background: "#1e1e1e",
              color: "#d4d4d4",
              padding: "1rem",
              borderRadius: "0.375rem",
              overflow: "auto",
              fontSize: "0.875rem",
              margin: 0,
              lineHeight: "1.6",
            }}
          >
            <code>{`import { useState } from "react";
import { ContentEditor } from "react-html-content-editor";
import "react-html-content-editor/dist/style.css";

function App() {
  const [content, setContent] = useState({
    html: "<h1>Hello World!</h1>",
    css: "h1 { color: blue; }"
  });

  return (
    <ContentEditor
      value={content}
      onChange={setContent}
      height="500px"
    />
  );
}`}</code>
          </pre>
        </div>

        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #3b82f6",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "#1e40af",
            }}
          >
            💡 Pro Tips
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#1e40af" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Toggle Views:</strong> Click the Code and Eye icons to
              switch between edit and preview modes
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Split View:</strong> Enable both Code and Eye buttons to
              see editor and preview side-by-side
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Keyboard Shortcuts:</strong> Use Ctrl/⌘+S to save,
              Ctrl/⌘+Shift+F to format, Ctrl/⌘+Shift+M for fullscreen
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Auto-Save:</strong> Add an <code>onSave</code> prop to
              enable auto-save functionality
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Demo */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "1rem" }}
        >
          🎮 Try It Now
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
          Edit the HTML and CSS below to see the live preview. Try clicking the
          Code and Eye buttons to toggle between different view modes!
        </p>

        <ContentEditor
          value={content}
          onChange={setContent}
          height='500px'
          theme='vs-dark'
        />
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "600",
            marginBottom: "1.5rem",
          }}
        >
          ✨ Key Features
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🎨</div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Monaco Editor
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
              Powered by VS Code's editor with syntax highlighting,
              IntelliSense, and code formatting
            </p>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>👁️</div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Live Preview
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
              See your HTML and CSS changes in real-time with instant preview
              updates
            </p>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⚡</div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Auto-Save
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
              Built-in auto-save with debouncing and visual save status
              indicators
            </p>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🖥️</div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Fullscreen Mode
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
              Distraction-free editing with fullscreen mode and split view
              support
            </p>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⌨️</div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Keyboard Shortcuts
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
              Boost productivity with keyboard shortcuts for save, format, and
              fullscreen
            </p>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🎭</div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Themes
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
              Support for light and dark themes with customizable Monaco themes
            </p>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>♿</div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Accessible
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
              Built with accessibility in mind, including ARIA labels and
              keyboard navigation
            </p>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📦</div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Lightweight
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
              Only 8.4 KB gzipped, with tree-shaking support for minimal bundle
              size
            </p>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔧</div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Customizable
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
              Extensive props for customization including height, theme, and
              editor options
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "2rem",
          borderRadius: "1rem",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          📚 Explore More Examples
        </h2>
        <p style={{ opacity: 0.95, marginBottom: "1.5rem" }}>
          Check out the navigation above to see more advanced examples:
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "1rem",
              borderRadius: "0.5rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <strong>🚧 WYSIWYG</strong>
            <p
              style={{
                fontSize: "0.875rem",
                margin: "0.5rem 0 0 0",
                opacity: 0.9,
              }}
            >
              Visual editor in development
            </p>
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "1rem",
              borderRadius: "0.5rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <strong>🖥️ Fullscreen</strong>
            <p
              style={{
                fontSize: "0.875rem",
                margin: "0.5rem 0 0 0",
                opacity: 0.9,
              }}
            >
              Distraction-free editing
            </p>
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "1rem",
              borderRadius: "0.5rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <strong>⚡ Auto-Save</strong>
            <p
              style={{
                fontSize: "0.875rem",
                margin: "0.5rem 0 0 0",
                opacity: 0.9,
              }}
            >
              Automatic content saving
            </p>
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "1rem",
              borderRadius: "0.5rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <strong>🎨 Themes</strong>
            <p
              style={{
                fontSize: "0.875rem",
                margin: "0.5rem 0 0 0",
                opacity: 0.9,
              }}
            >
              Light and dark themes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
