import { useState } from "react";
import { ContentEditor, ContentValue } from "react-html-content-editor";

const initialValue: ContentValue = {
  html: `<article class="blog-post">
  <header>
    <h1>Fullscreen Editing Experience</h1>
    <p class="meta">Published on <time>January 15, 2024</time></p>
  </header>
  
  <section>
    <h2>Distraction-Free Writing</h2>
    <p>
      The fullscreen mode provides an immersive editing experience, perfect for
      focused work on larger documents.
    </p>
    
    <h3>Key Features</h3>
    <ul>
      <li><strong>Edit Mode:</strong> Focus on writing your HTML and CSS</li>
      <li><strong>Preview Mode:</strong> See the rendered output</li>
      <li><strong>Split View:</strong> Edit and preview side-by-side with scroll sync</li>
    </ul>
    
    <blockquote>
      "The split view with scroll synchronization is a game-changer for content editing."
    </blockquote>
    
    <h3>How to Use</h3>
    <ol>
      <li>Click the fullscreen button in the editor toolbar</li>
      <li>Choose your preferred view mode (Edit, Preview, or Split)</li>
      <li>Use Escape key to exit fullscreen anytime</li>
    </ol>
  </section>
  
  <footer>
    <p>Happy editing! 🚀</p>
  </footer>
</article>`,
  css: `.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
  font-family: Georgia, serif;
  line-height: 1.8;
  color: #1a1a1a;
}

.blog-post header {
  margin-bottom: 3rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 2rem;
}

.blog-post h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #111827;
}

.blog-post .meta {
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
}

.blog-post h2 {
  font-size: 1.875rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #374151;
}

.blog-post h3 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #4b5563;
}

.blog-post p {
  margin-bottom: 1rem;
}

.blog-post ul,
.blog-post ol {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.blog-post li {
  margin-bottom: 0.5rem;
}

.blog-post blockquote {
  margin: 2rem 0;
  padding: 1rem 1.5rem;
  border-left: 4px solid #667eea;
  background: #f9fafb;
  font-style: italic;
  color: #4b5563;
}

.blog-post footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  color: #6b7280;
}`,
};

function FullscreenExample() {
  const [value, setValue] = useState<ContentValue>(initialValue);

  return (
    <div className='example-container'>
      <div className='example-header'>
        <h2>Fullscreen Mode</h2>
        <p>
          Experience distraction-free editing with fullscreen mode. Switch
          between edit, preview, and split view modes for maximum productivity.
        </p>
      </div>

      <div className='example-info'>
        <strong>Try it:</strong> Click the fullscreen button (expand icon) in
        the editor toolbar. Once in fullscreen, try switching between Edit,
        Preview, and Split view modes. In Split view, enable scroll sync to see
        synchronized scrolling between editor and preview.
      </div>

      <div className='example-content'>
        <ContentEditor
          value={value}
          onChange={setValue}
          height='600px'
          htmlLabel='Article HTML'
          cssLabel='Article Styles'
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
          Fullscreen Features
        </h3>
        <ul style={{ color: "#6b7280", fontSize: "0.875rem", lineHeight: 1.6 }}>
          <li>
            <strong>Edit Mode:</strong> Full-screen editor for focused coding
          </li>
          <li>
            <strong>Preview Mode:</strong> Full-screen preview to see your work
          </li>
          <li>
            <strong>Split View:</strong> Side-by-side editing and preview with
            optional scroll synchronization
          </li>
          <li>
            <strong>Keyboard Shortcuts:</strong> Press Escape to exit fullscreen
          </li>
          <li>
            <strong>Unsaved Changes Warning:</strong> Get prompted before
            closing with unsaved changes
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FullscreenExample;
