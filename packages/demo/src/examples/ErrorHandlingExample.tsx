import { useState } from "react";
import { ContentEditor, ContentValue } from "react-html-content-editor";

const initialValue: ContentValue = {
  html: `<div class="error-demo">
  <h1>⚠️ Error Handling Demo</h1>
  
  <section class="warning">
    <h2>Understanding Errors</h2>
    <p>
      This example demonstrates how the ContentEditor handles and displays errors.
      Errors can come from validation, save failures, or other operations.
    </p>
  </section>
  
  <section class="examples">
    <h2>Common Error Scenarios</h2>
    
    <div class="scenario">
      <h3>1. Validation Errors</h3>
      <p>Content fails validation rules (e.g., required fields, format checks)</p>
    </div>
    
    <div class="scenario">
      <h3>2. Save Failures</h3>
      <p>Network issues or server errors prevent saving</p>
    </div>
    
    <div class="scenario">
      <h3>3. Content Too Large</h3>
      <p>Content exceeds maximum allowed size</p>
    </div>
  </section>
  
  <section class="best-practices">
    <h2>Best Practices</h2>
    <ul>
      <li>Always validate user input before saving</li>
      <li>Provide clear, actionable error messages</li>
      <li>Allow users to retry failed operations</li>
      <li>Preserve user content even when errors occur</li>
    </ul>
  </section>
</div>`,
  css: `.error-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

.error-demo h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #991b1b;
  margin-bottom: 1.5rem;
}

.warning {
  background: #fef2f2;
  border: 2px solid #fca5a5;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.warning h2 {
  font-size: 1.5rem;
  color: #991b1b;
  margin-bottom: 0.75rem;
}

.warning p {
  color: #7f1d1d;
  line-height: 1.6;
  margin: 0;
}

.examples {
  margin-bottom: 2rem;
}

.examples h2 {
  font-size: 1.75rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

.scenario {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.scenario h3 {
  font-size: 1.125rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.scenario p {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.best-practices {
  background: #f0fdf4;
  border: 2px solid #86efac;
  border-radius: 8px;
  padding: 1.5rem;
}

.best-practices h2 {
  font-size: 1.5rem;
  color: #166534;
  margin-bottom: 0.75rem;
}

.best-practices ul {
  color: #14532d;
  line-height: 1.6;
  margin: 0;
  padding-left: 1.5rem;
}

.best-practices li {
  margin-bottom: 0.5rem;
}`,
};

type ErrorType = "none" | "validation" | "save" | "size";

function ErrorHandlingExample() {
  const [value, setValue] = useState<ContentValue>(initialValue);
  const [errorType, setErrorType] = useState<ErrorType>("none");
  const [isSaving, setIsSaving] = useState(false);

  const getErrorMessage = (): string | undefined => {
    switch (errorType) {
      case "validation":
        return "Validation failed: HTML content must include a closing tag for all opened tags.";
      case "save":
        return "Failed to save content: Network error. Please check your connection and try again.";
      case "size":
        return "Content too large: Maximum allowed size is 50KB. Current size exceeds the limit.";
      default:
        return undefined;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);

    // Simulate save failure if error type is "save"
    if (errorType === "save") {
      throw new Error("Network error");
    }

    console.log("Content saved successfully:", value);
  };

  const triggerError = (type: ErrorType) => {
    setErrorType(type);
  };

  const clearError = () => {
    setErrorType("none");
  };

  return (
    <div className='example-container'>
      <div className='example-header'>
        <h2>Error Handling</h2>
        <p>
          Demonstrates how the ContentEditor displays and handles various error
          scenarios. Errors are shown below the editor with clear, actionable
          messages.
        </p>
      </div>

      <div className='example-controls'>
        <button onClick={() => triggerError("validation")}>
          Trigger Validation Error
        </button>
        <button onClick={() => triggerError("save")}>Trigger Save Error</button>
        <button onClick={() => triggerError("size")}>Trigger Size Error</button>
        <button onClick={clearError} className='primary'>
          Clear Error
        </button>
      </div>

      <div className='example-info'>
        <strong>Try it:</strong> Click the buttons above to simulate different
        error scenarios. Notice how the error message appears below the editor
        with a red border. The error prop accepts any string message you want to
        display.
      </div>

      {errorType !== "none" && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "0.375rem",
            padding: "1rem",
            marginBottom: "1rem",
            color: "#991b1b",
            fontSize: "0.875rem",
          }}
        >
          <strong>Current Error Type:</strong> {errorType}
        </div>
      )}

      <div className='example-content'>
        <ContentEditor
          value={value}
          onChange={setValue}
          onSave={errorType === "save" ? handleSave : undefined}
          isSaving={isSaving}
          error={getErrorMessage()}
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
          Error Handling Features
        </h3>
        <ul style={{ color: "#6b7280", fontSize: "0.875rem", lineHeight: 1.6 }}>
          <li>
            <strong>Error Display:</strong> Errors are shown below the editor
            with an alert icon
          </li>
          <li>
            <strong>Visual Feedback:</strong> Editor border turns red when an
            error is present
          </li>
          <li>
            <strong>Accessibility:</strong> Error messages use role="alert" for
            screen reader announcements
          </li>
          <li>
            <strong>Graceful Degradation:</strong> Editor remains functional
            even when errors occur
          </li>
          <li>
            <strong>Content Preservation:</strong> User content is never lost
            due to errors
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#f0fdf4",
          border: "1px solid #86efac",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          color: "#166534",
        }}
      >
        <strong>💡 Implementation Tip:</strong> Pass error messages via the{" "}
        <code>error</code> prop. The component handles the display and styling
        automatically. Clear the error by passing <code>undefined</code> or an
        empty string.
      </div>

      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          background: "#fef3c7",
          border: "1px solid #fbbf24",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          color: "#78350f",
        }}
      >
        <strong>⚠️ Security Note:</strong> Always validate and sanitize HTML
        content on the server side. The ContentEditor uses{" "}
        <code>dangerouslySetInnerHTML</code> for preview rendering, so you must
        protect against XSS attacks by sanitizing user input.
      </div>
    </div>
  );
}

export default ErrorHandlingExample;
