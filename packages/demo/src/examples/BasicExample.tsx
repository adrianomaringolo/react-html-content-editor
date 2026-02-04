import { useState } from "react";
import { ContentEditor, ContentValue } from "react-html-content-editor";

const initialValue: ContentValue = {
  html: `<div class="welcome">
  <h1>Welcome to React HTML Content Editor</h1>
  <p>This is a basic example demonstrating the core functionality.</p>
  <ul>
    <li>Edit HTML in the editor</li>
    <li>Switch to CSS tab to add styles</li>
    <li>Preview your changes in real-time</li>
  </ul>
</div>`,
  css: `.welcome {
  font-family: system-ui, sans-serif;
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.welcome h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.welcome p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.welcome ul {
  list-style-position: inside;
}

.welcome li {
  margin-bottom: 0.5rem;
}`,
};

function BasicExample() {
  const [value, setValue] = useState<ContentValue>(initialValue);

  const handleChange = (newValue: ContentValue) => {
    setValue(newValue);
    console.log("Content changed:", newValue);
  };

  return (
    <div className='example-container'>
      <div className='example-header'>
        <h2>Basic Usage</h2>
        <p>
          The simplest way to use the ContentEditor. Edit HTML and CSS, then
          switch to preview mode to see the results.
        </p>
      </div>

      <div className='example-info'>
        <strong>Try it:</strong> Switch between the HTML and CSS tabs to edit
        content, then click the Preview tab to see your changes rendered.
      </div>

      <div className='example-content'>
        <ContentEditor value={value} onChange={handleChange} height='500px' />
      </div>

      <div
        style={{ marginTop: "1.5rem", fontSize: "0.875rem", color: "#6b7280" }}
      >
        <p>
          <strong>Current HTML length:</strong> {value.html.length} characters
        </p>
        <p>
          <strong>Current CSS length:</strong> {value.css.length} characters
        </p>
      </div>
    </div>
  );
}

export default BasicExample;
