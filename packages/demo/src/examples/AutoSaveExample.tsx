import { useState } from "react";
import { ContentEditor, ContentValue } from "react-html-content-editor";

const initialValue: ContentValue = {
  html: `<div class="note">
  <h2>📝 My Notes</h2>
  <p>
    This editor demonstrates auto-save functionality. Try making changes and
    watch the save status indicator update automatically.
  </p>
  
  <h3>Shopping List</h3>
  <ul>
    <li>Milk</li>
    <li>Eggs</li>
    <li>Bread</li>
    <li>Coffee</li>
  </ul>
  
  <h3>Todo Today</h3>
  <ol>
    <li>Review pull requests</li>
    <li>Update documentation</li>
    <li>Fix bug #123</li>
  </ol>
  
  <p class="tip">
    💡 <strong>Tip:</strong> Press Ctrl+S (or Cmd+S on Mac) to manually trigger a save.
  </p>
</div>`,
  css: `.note {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  background: #fffbeb;
  border: 2px solid #fbbf24;
  border-radius: 8px;
  font-family: system-ui, sans-serif;
}

.note h2 {
  font-size: 1.75rem;
  color: #92400e;
  margin-bottom: 1rem;
}

.note h3 {
  font-size: 1.25rem;
  color: #b45309;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.note p {
  color: #78350f;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.note ul,
.note ol {
  color: #78350f;
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.note li {
  margin-bottom: 0.5rem;
}

.note .tip {
  background: #fef3c7;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #f59e0b;
  margin-top: 1.5rem;
}`,
};

function AutoSaveExample() {
  const [value, setValue] = useState<ContentValue>(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSaving(false);
    setSaveCount((prev) => prev + 1);
    setLastSaved(new Date());

    console.log("Content saved:", value);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className='example-container'>
      <div className='example-header'>
        <h2>Auto-Save Functionality</h2>
        <p>
          Demonstrates automatic save detection with status indicators. The
          editor tracks unsaved changes and provides visual feedback about the
          save state.
        </p>
      </div>

      <div className='example-info'>
        <strong>Try it:</strong> Make changes to the content and watch the save
        status indicator. Click the save button or press Ctrl+S (Cmd+S on Mac)
        to save. The editor will show "Unsaved changes" when you modify content
        and "Saved" after saving completes.
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          padding: "1rem",
          background: "#f9fafb",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
        }}
      >
        <div>
          <strong>Save Count:</strong> {saveCount}
        </div>
        <div>
          <strong>Last Saved:</strong>{" "}
          {lastSaved ? formatTime(lastSaved) : "Never"}
        </div>
        <div>
          <strong>Status:</strong>{" "}
          <span
            style={{
              color: isSaving ? "#f59e0b" : "#10b981",
              fontWeight: 600,
            }}
          >
            {isSaving ? "Saving..." : "Ready"}
          </span>
        </div>
      </div>

      <div className='example-content'>
        <ContentEditor
          value={value}
          onChange={setValue}
          onSave={handleSave}
          isSaving={isSaving}
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
          Auto-Save Features
        </h3>
        <ul style={{ color: "#6b7280", fontSize: "0.875rem", lineHeight: 1.6 }}>
          <li>
            <strong>Unsaved Changes Detection:</strong> Automatically detects
            when content has been modified
          </li>
          <li>
            <strong>Save Status Indicator:</strong> Shows "Saved", "Unsaved
            changes", or "Saving..." status
          </li>
          <li>
            <strong>Manual Save:</strong> Click the save button or use Ctrl+S
            (Cmd+S) keyboard shortcut
          </li>
          <li>
            <strong>Browser Warning:</strong> Warns before leaving the page with
            unsaved changes
          </li>
          <li>
            <strong>Fullscreen Warning:</strong> Prompts before closing
            fullscreen mode with unsaved changes
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AutoSaveExample;
