# Design Document: React HTML Content Editor

## Overview

The React HTML Content Editor is a standalone library that provides a sophisticated code editing experience for HTML and CSS content. Built on top of Monaco Editor (the same editor that powers VS Code), it offers multiple view modes, real-time preview, scroll synchronization, and auto-save functionality.

The library is designed to be framework-agnostic, dependency-light, and easily integrable into any React application. It removes all dependencies on Tailwind CSS and buildgrid-ui, making it suitable for projects with different styling approaches.

### Key Features

- **Dual Editor Support**: Separate Monaco Editor instances for HTML and CSS
- **Multiple View Modes**: Edit, preview, and split view
- **Fullscreen Mode**: Distraction-free editing experience
- **Scroll Synchronization**: Synchronized scrolling between editor and preview
- **Auto-Save**: Automatic change detection with save status indicators
- **Keyboard Shortcuts**: Ctrl+S for save, Monaco's built-in shortcuts
- **Format on Demand**: One-click code formatting for both HTML and CSS
- **TypeScript First**: Full type safety with exported type definitions
- **Theme Support**: Dark and light themes via CSS variables
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## Architecture

### Package Structure

The project uses a pnpm workspace monorepo structure:

```
react-html-content-editor/
├── packages/
│   ├── library/                    # The main library package
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ContentEditor.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Dialog.tsx
│   │   │   │   ├── Tabs.tsx
│   │   │   │   └── index.ts
│   │   │   ├── styles/
│   │   │   │   ├── content-editor.css
│   │   │   │   ├── button.css
│   │   │   │   ├── dialog.css
│   │   │   │   ├── tabs.css
│   │   │   │   └── index.css
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useScrollSync.ts
│   │   │   │   ├── useAutoSave.ts
│   │   │   │   └── useKeyboardShortcuts.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── demo/                       # Demo application
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── examples/
│       │       ├── BasicExample.tsx
│       │       ├── FullscreenExample.tsx
│       │       ├── AutoSaveExample.tsx
│       │       └── ThemeExample.tsx
│       ├── package.json
│       ├── vite.config.ts
│       └── index.html
│
├── package.json                    # Root workspace config
├── pnpm-workspace.yaml
├── .changeset/                     # Changesets for versioning
├── LICENSE
└── README.md
```

### Build System

**Vite Configuration** for the library:

```typescript
// packages/library/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*"],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ReactHTMLContentEditor",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@monaco-editor/react",
        "monaco-editor",
        "lucide-react",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@monaco-editor/react": "MonacoEditor",
          "lucide-react": "LucideReact",
        },
      },
    },
    sourcemap: true,
    minify: "terser",
  },
});
```

### Semantic Versioning

The project uses **Changesets** for version management:

1. Developers create changesets when making changes: `pnpm changeset`
2. Changesets are committed with the code
3. On release, changesets are consumed to bump versions and generate changelog
4. Git tags are created automatically

**Changeset Configuration**:

```json
// .changeset/config.json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["demo"]
}
```

## Components and Interfaces

### ContentEditor Component

The main component that orchestrates all functionality.

**Props Interface**:

```typescript
interface ContentValue {
  html: string;
  css: string;
}

interface ContentEditorProps {
  // Content values
  value: ContentValue;
  onChange: (value: ContentValue) => void;

  // Save functionality
  onSave?: () => Promise<void>;
  isSaving?: boolean;

  // Customization
  htmlLabel?: string;
  cssLabel?: string;
  className?: string;
  height?: string | number;
  defaultTab?: "html" | "css";

  // Monaco Editor options
  editorOptions?: editor.IStandaloneEditorOptions;
  theme?: "vs-dark" | "vs-light";

  // Error handling
  error?: string;
}
```

**State Management**:

```typescript
interface EditorState {
  // View state
  activeTab: "edit" | "preview";
  activeEditor: "html" | "css";
  isFullscreen: boolean;
  fullscreenMode: "edit" | "preview" | "split";

  // Save state
  savedValue: ContentValue;
  saveStatus: "saved" | "unsaved" | "saving";

  // Sync state
  syncScroll: boolean;
}
```

### Button Component

A simple, accessible button component to replace buildgrid-ui Button.

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}
```

**Implementation**: Uses CSS modules for styling with variants.

### Dialog Component

A modal dialog component for help and confirmations.

```typescript
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}
```

**Implementation**: Uses React Portal and focus trap for accessibility.

### Tabs Component

A tabs component for switching between HTML/CSS editors and edit/preview modes.

```typescript
interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}
```

**Implementation**: Uses compound component pattern with context.

### Custom Hooks

#### useScrollSync

Manages scroll synchronization between editor and preview.

```typescript
interface UseScrollSyncProps {
  editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>;
  previewRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
}

interface UseScrollSyncReturn {
  handleEditorScroll: () => void;
  handlePreviewScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

function useScrollSync(props: UseScrollSyncProps): UseScrollSyncReturn;
```

**Logic**:

- Calculates scroll percentage in source element
- Applies same percentage to target element
- Uses ref to prevent infinite loops
- Debounces scroll events for performance

#### useAutoSave

Manages auto-save functionality and unsaved changes detection.

```typescript
interface UseAutoSaveProps {
  value: ContentValue;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
}

interface UseAutoSaveReturn {
  savedValue: ContentValue;
  saveStatus: "saved" | "unsaved" | "saving";
  hasUnsavedChanges: boolean;
  handleSave: () => Promise<void>;
}

function useAutoSave(props: UseAutoSaveProps): UseAutoSaveReturn;
```

**Logic**:

- Tracks saved value separately from current value
- Compares values to determine unsaved changes
- Manages save status state machine
- Handles save errors gracefully

#### useKeyboardShortcuts

Manages keyboard shortcuts for the editor.

```typescript
interface UseKeyboardShortcutsProps {
  onSave?: () => void;
  canSave: boolean;
}

function useKeyboardShortcuts(props: UseKeyboardShortcutsProps): void;
```

**Logic**:

- Listens for Ctrl+S / Cmd+S
- Prevents default browser save dialog
- Triggers save callback if available
- Handles beforeunload event for unsaved changes

## Data Models

### ContentValue

Represents the HTML and CSS content being edited.

```typescript
interface ContentValue {
  html: string;
  css: string;
}
```

**Validation**:

- Both fields are required (can be empty strings)
- No maximum length enforced (handled by Monaco)
- Sanitization is the responsibility of the consuming application

### SaveStatus

Represents the current save state.

```typescript
type SaveStatus = "saved" | "unsaved" | "saving";
```

**State Transitions**:

- `saved` → `unsaved`: When content changes
- `unsaved` → `saving`: When save is triggered
- `saving` → `saved`: When save succeeds
- `saving` → `unsaved`: When save fails

### ViewMode

Represents the current view configuration.

```typescript
type ViewMode = "edit" | "preview" | "split";
```

**Behavior**:

- `edit`: Shows only the editor(s)
- `preview`: Shows only the rendered preview
- `split`: Shows editor and preview side-by-side

### EditorType

Represents which editor is currently active.

```typescript
type EditorType = "html" | "css";
```

## Styling Approach

### CSS Modules

Each component has its own CSS module file:

```css
/* content-editor.module.css */
.editor-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.fullscreen-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--bg-primary);
}

.editor-tabs {
  display: flex;
  gap: var(--spacing-1);
}

/* ... more styles */
```

### CSS Variables for Theming

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-border: #e5e7eb;
  --color-error: #ef4444;
  --color-success: #10b981;
  --color-warning: #f59e0b;

  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-muted: #f3f4f6;

  /* Text */
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
}

[data-theme="dark"] {
  --color-border: #374151;
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --bg-muted: #374151;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-muted: #9ca3af;
}
```

### Responsive Design

```css
/* Mobile-first approach */
.split-view {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .split-view {
    flex-direction: row;
  }
}
```

## Preview Rendering with CSS

### HTML + CSS Injection

The preview pane renders HTML with CSS applied:

```typescript
function PreviewPane({ html, css }: { html: string; css: string }) {
  return (
    <div className={styles.previewContainer}>
      <style>{css}</style>
      <div
        className="content-preview"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
```

### CSS Scoping Strategy

To prevent CSS from leaking out of the preview:

1. **Isolation**: Preview is rendered in a separate container
2. **Scoped Class**: Apply a unique class to the preview container
3. **CSS Reset**: Apply a minimal reset to the preview container
4. **Documentation**: Warn users about potential XSS risks

```css
.preview-container {
  all: initial;
  display: block;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  line-height: 1.5;
  color: var(--text-primary);
}
```

## Monaco Editor Integration

### Configuration

```typescript
const htmlEditorOptions: editor.IStandaloneEditorOptions = {
  language: "html",
  theme: "vs-dark",
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: "on",
  wordWrap: "on",
  autoClosingBrackets: "always",
  autoClosingQuotes: "always",
  formatOnPaste: true,
  formatOnType: true,
  tabSize: 2,
  scrollBeyondLastLine: false,
  automaticLayout: true,
};

const cssEditorOptions: editor.IStandaloneEditorOptions = {
  ...htmlEditorOptions,
  language: "css",
};
```

### Editor Lifecycle

```typescript
function ContentEditor({ value, onChange }: ContentEditorProps) {
  const htmlEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const cssEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleHtmlEditorMount: OnMount = (editor) => {
    htmlEditorRef.current = editor;
  };

  const handleCssEditorMount: OnMount = (editor) => {
    cssEditorRef.current = editor;
  };

  const handleFormatHtml = () => {
    htmlEditorRef.current?.getAction('editor.action.formatDocument')?.run();
  };

  const handleFormatCss = () => {
    cssEditorRef.current?.getAction('editor.action.formatDocument')?.run();
  };

  return (
    <>
      <Editor
        value={value.html}
        onChange={(val) => onChange({ ...value, html: val || '' })}
        onMount={handleHtmlEditorMount}
        options={htmlEditorOptions}
      />
      <Editor
        value={value.css}
        onChange={(val) => onChange({ ...value, css: val || '' })}
        onMount={handleCssEditorMount}
        options={cssEditorOptions}
      />
    </>
  );
}
```

## Scroll Synchronization Implementation

### Algorithm

```typescript
function useScrollSync({ editorRef, previewRef, enabled }: UseScrollSyncProps) {
  const isScrollingSyncRef = useRef(false);

  const handleEditorScroll = useCallback(() => {
    if (
      !enabled ||
      isScrollingSyncRef.current ||
      !previewRef.current ||
      !editorRef.current
    ) {
      return;
    }

    const editor = editorRef.current;
    const preview = previewRef.current;

    const scrollTop = editor.getScrollTop();
    const scrollHeight = editor.getScrollHeight();
    const clientHeight = editor.getLayoutInfo().height;
    const maxScroll = scrollHeight - clientHeight;

    if (maxScroll <= 0) return;

    const scrollPercent = scrollTop / maxScroll;
    const previewMaxScroll = preview.scrollHeight - preview.clientHeight;

    isScrollingSyncRef.current = true;
    preview.scrollTop = scrollPercent * previewMaxScroll;

    requestAnimationFrame(() => {
      isScrollingSyncRef.current = false;
    });
  }, [enabled, editorRef, previewRef]);

  const handlePreviewScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!enabled || isScrollingSyncRef.current || !editorRef.current) {
        return;
      }

      const preview = e.currentTarget;
      const editor = editorRef.current;

      const scrollTop = preview.scrollTop;
      const maxScroll = preview.scrollHeight - preview.clientHeight;

      if (maxScroll <= 0) return;

      const scrollPercent = scrollTop / maxScroll;
      const editorMaxScroll =
        editor.getScrollHeight() - editor.getLayoutInfo().height;

      isScrollingSyncRef.current = true;
      editor.setScrollTop(scrollPercent * editorMaxScroll);

      requestAnimationFrame(() => {
        isScrollingSyncRef.current = false;
      });
    },
    [enabled, editorRef],
  );

  return { handleEditorScroll, handlePreviewScroll };
}
```

### Integration with Monaco

```typescript
useEffect(() => {
  if (!editorRef.current) return;

  const disposable = editorRef.current.onDidScrollChange(() => {
    handleEditorScroll();
  });

  return () => disposable.dispose();
}, [handleEditorScroll]);
```

## Error Handling

### Error Display

```typescript
function ErrorMessage({ error }: { error?: string }) {
  if (!error) return null;

  return (
    <div className={styles.errorMessage} role="alert">
      <AlertCircle className={styles.errorIcon} />
      <span>{error}</span>
    </div>
  );
}
```

### Save Error Handling

```typescript
async function handleSave() {
  if (!onSave || isSaving) return;

  setSaveStatus("saving");

  try {
    await onSave();
    setSavedValue(value);
    setSaveStatus("saved");
  } catch (error) {
    console.error("Save failed:", error);
    setSaveStatus("unsaved");
    // Error is handled by parent component
  }
}
```

### Validation

```typescript
function validateContent(value: ContentValue): string | null {
  if (value.html === undefined || value.html === null) {
    return "HTML content is required";
  }

  if (value.css === undefined || value.css === null) {
    return "CSS content is required";
  }

  return null;
}
```

## Testing Strategy

The library will use a dual testing approach combining unit tests and property-based tests.

### Unit Testing

**Framework**: Vitest + React Testing Library

**Test Coverage**:

- Component rendering and interactions
- Button clicks and keyboard shortcuts
- Tab switching and mode changes
- Error display and validation
- Save status updates
- Theme switching

**Example Test**:

```typescript
describe('ContentEditor', () => {
  it('should call onChange when HTML content changes', () => {
    const onChange = vi.fn();
    const value = { html: '<p>Hello</p>', css: '' };

    render(<ContentEditor value={value} onChange={onChange} />);

    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: '<p>World</p>' } });

    expect(onChange).toHaveBeenCalledWith({
      html: '<p>World</p>',
      css: '',
    });
  });
});
```

### Property-Based Testing

**Framework**: fast-check

**Configuration**: Minimum 100 iterations per test

Property-based tests will validate universal properties across randomized inputs.

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property Reflection

After analyzing all acceptance criteria, I identified the following testable properties. Some criteria were combined to eliminate redundancy:

**Combined Properties**:

- Requirements 3.1 and 3.2 (HTML and CSS onChange) can be combined into a single property about content changes
- Requirements 4.1 and 4.2 (bidirectional scroll sync) can be combined into a single property about scroll synchronization
- Requirements 2.5 and 15.2 (CSS injection) are redundant - one property covers both
- Requirements 3.7 and 3.8 (HTML and CSS formatting) can be combined into a single property about formatting

**Properties vs Examples**:

- Most configuration and setup requirements (package.json, build output, etc.) are better tested as examples
- Universal behaviors (onChange, scroll sync, formatting) are tested as properties
- UI structure and specific interactions are tested as examples

### Property 1: Content Change Propagation

_For any_ ContentValue (html and css), when either the html or css is modified in the editor, the onChange callback should be called with a ContentValue object containing both the updated value and the unchanged value.

**Validates: Requirements 2.3, 3.1, 3.2**

**Rationale**: This property ensures that the component correctly propagates changes from both editors while preserving the other value. It validates the core data flow of the component.

### Property 2: Tab Switching Preserves Content

_For any_ ContentValue (html and css), switching between HTML and CSS editor tabs should preserve both values without data loss.

**Validates: Requirements 3.3**

**Rationale**: This property ensures that tab switching doesn't cause data loss, which is critical for user trust in the editor.

### Property 3: Format Preserves Validity

_For any_ valid HTML or CSS content, applying the format operation should produce valid formatted content that, when parsed, represents the same structure.

**Validates: Requirements 3.7, 3.8**

**Rationale**: This property ensures that formatting doesn't break valid code. It's a critical correctness property for code editors.

### Property 4: Scroll Synchronization Proportionality

_For any_ scroll position in either the editor or preview (when sync is enabled), the corresponding scroll position in the other pane should be proportional based on the scroll percentage.

**Validates: Requirements 4.1, 4.2**

**Rationale**: This property ensures that scroll synchronization maintains proportional positioning, providing a consistent user experience.

### Property 5: CSS Injection in Preview

_For any_ CSS content, when rendered in preview mode, the preview DOM should contain a style tag with that exact CSS content.

**Validates: Requirements 2.5, 15.2**

**Rationale**: This property ensures that CSS is correctly injected into the preview, which is essential for the preview to work correctly.

### Property 6: Preview Renders HTML with Styles

_For any_ HTML and CSS content, the preview should render the HTML with the CSS styles applied, such that elements styled by the CSS reflect those styles in the rendered output.

**Validates: Requirements 15.1**

**Rationale**: This property ensures that the preview correctly combines HTML and CSS, which is the core functionality of the preview feature.

### Property 7: Customization Props Applied

_For any_ valid customization props (className, htmlLabel, cssLabel, height, theme), the component should apply these props to the appropriate elements without errors.

**Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7**

**Rationale**: This property ensures that all customization options work correctly across different configurations.

### Property 8: Save Status State Machine

_For any_ sequence of content changes and save operations, the save status should follow the correct state transitions: saved → unsaved (on change) → saving (on save start) → saved (on success) or unsaved (on failure).

**Validates: Requirements 3.12, 3.13**

**Rationale**: This property ensures that the save status state machine is correct, which is critical for user feedback about data persistence.

## Error Handling

### Error Boundaries

The library will not include error boundaries internally, as this is the responsibility of the consuming application. However, all internal errors will be caught and logged.

### Error Prop

The `error` prop allows the parent component to display validation or save errors:

```typescript
<ContentEditor
  value={value}
  onChange={onChange}
  error="Failed to save content. Please try again."
/>
```

### Graceful Degradation

- If Monaco Editor fails to load, display a fallback textarea
- If formatting fails, log the error and keep the original content
- If scroll sync fails, disable it and log the error

## Testing Strategy

### Dual Testing Approach

The library uses both unit tests and property-based tests for comprehensive coverage:

**Unit Tests**:

- Specific examples and edge cases
- UI interactions (button clicks, tab switches)
- Error conditions and validation
- Component rendering and structure
- Integration between components

**Property Tests**:

- Universal properties across all inputs
- Content change propagation
- Scroll synchronization
- CSS injection and preview rendering
- Customization prop application
- Save status state machine

### Property-Based Testing Configuration

**Library**: fast-check for JavaScript/TypeScript

**Configuration**:

- Minimum 100 iterations per property test
- Each test tagged with: `Feature: react-html-content-editor, Property {number}: {property_text}`
- Custom generators for ContentValue, scroll positions, and editor states

**Example Property Test**:

```typescript
import fc from 'fast-check';
import { render, fireEvent } from '@testing-library/react';
import { ContentEditor } from '../ContentEditor';

describe('Property 1: Content Change Propagation', () => {
  it('should call onChange with both values when html changes', () => {
    // Feature: react-html-content-editor, Property 1: Content Change Propagation
    fc.assert(
      fc.property(
        fc.record({
          html: fc.string(),
          css: fc.string(),
        }),
        fc.string(),
        (initialValue, newHtml) => {
          const onChange = jest.fn();
          const { container } = render(
            <ContentEditor value={initialValue} onChange={onChange} />
          );

          // Simulate HTML change
          const htmlEditor = container.querySelector('[data-editor="html"]');
          fireEvent.change(htmlEditor, { target: { value: newHtml } });

          // Verify onChange was called with both values
          expect(onChange).toHaveBeenCalledWith({
            html: newHtml,
            css: initialValue.css,
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Coverage Goals

- **Unit Tests**: 80%+ code coverage
- **Property Tests**: All identified properties (8 properties)
- **Integration Tests**: Key user workflows (edit → save, fullscreen, scroll sync)
- **Accessibility Tests**: ARIA labels, keyboard navigation, screen reader support

### Continuous Integration

Tests run on:

- Every commit (via GitHub Actions)
- Before publishing (via pnpm scripts)
- On pull requests

## Accessibility Considerations

### Keyboard Navigation

- Tab key navigates between interactive elements
- Enter/Space activates buttons
- Escape closes dialogs and exits fullscreen
- Ctrl+S triggers save

### ARIA Labels

```typescript
<button aria-label="Format HTML code">
  <Wand2 />
</button>

<div role="tablist">
  <button role="tab" aria-selected={activeTab === 'html'}>
    HTML
  </button>
  <button role="tab" aria-selected={activeTab === 'css'}>
    CSS
  </button>
</div>

<div role="alert" aria-live="polite">
  {saveStatus === 'saved' && 'Content saved successfully'}
</div>
```

### Screen Reader Support

- Save status changes announced via `aria-live="polite"`
- Error messages announced via `role="alert"`
- Tab changes announced via ARIA attributes
- Focus management when switching modes

### High Contrast Mode

CSS variables allow easy customization for high contrast:

```css
@media (prefers-contrast: high) {
  :root {
    --color-border: #000000;
    --color-primary: #0000ff;
    --text-primary: #000000;
    --bg-primary: #ffffff;
  }
}
```

## Performance Considerations

### Optimization Strategies

1. **Debounced Scroll Sync**: Scroll events are debounced using `requestAnimationFrame`
2. **Memoized Components**: Expensive components wrapped in `React.memo`
3. **Callback Memoization**: Event handlers wrapped in `useCallback`
4. **Lazy Loading**: Monaco Editor loaded on demand
5. **Virtual Scrolling**: For large documents (handled by Monaco)

### Bundle Size

Target bundle sizes:

- Library (minified + gzipped): < 50KB
- CSS (minified + gzipped): < 5KB
- Total (excluding Monaco): < 55KB

Monaco Editor is a peer dependency, so its size is not included in the library bundle.

### Memory Management

- Editor instances properly disposed on unmount
- Event listeners cleaned up in useEffect cleanup functions
- Refs cleared when components unmount

## Security Considerations

### XSS Prevention

**Warning in Documentation**:

> ⚠️ **Security Warning**: This component uses `dangerouslySetInnerHTML` to render HTML content in the preview. You must sanitize user-provided HTML before passing it to the component to prevent XSS attacks. Consider using a library like DOMPurify.

**Recommended Usage**:

```typescript
import DOMPurify from 'dompurify';

function MyEditor() {
  const [value, setValue] = useState({ html: '', css: '' });

  const sanitizedValue = {
    html: DOMPurify.sanitize(value.html),
    css: value.css, // CSS is safer but can still be sanitized
  };

  return (
    <ContentEditor
      value={sanitizedValue}
      onChange={setValue}
    />
  );
}
```

### CSS Injection

CSS injection is less dangerous than HTML injection but can still cause issues:

- Styles are scoped to the preview container
- Documentation warns about potential style leakage
- Consuming applications should validate CSS if accepting user input

## Migration Guide

For users migrating from the original component in the Next.js app:

### Breaking Changes

1. **Props Interface Changed**:

   ```typescript
   // Old
   <ContentEditor
     value={htmlString}
     onChange={(html) => setHtml(html)}
   />

   // New
   <ContentEditor
     value={{ html: htmlString, css: cssString }}
     onChange={({ html, css }) => {
       setHtml(html);
       setCss(css);
     }}
   />
   ```

2. **No Tailwind Classes**: Custom className props must use standard CSS

3. **No buildgrid-ui**: Component is self-contained

### Migration Steps

1. Install the library: `pnpm add @sympro/react-html-content-editor`
2. Install peer dependencies: `pnpm add @monaco-editor/react lucide-react`
3. Update imports: `import { ContentEditor } from '@sympro/react-html-content-editor'`
4. Update props to use ContentValue object
5. Add CSS editing if needed
6. Test thoroughly

## Future Enhancements

Potential features for future versions:

1. **JavaScript Editor**: Add a third editor for JavaScript
2. **Live Preview**: Real-time preview updates as you type
3. **Syntax Validation**: Real-time HTML/CSS validation
4. **Code Snippets**: Predefined code snippets for common patterns
5. **Collaborative Editing**: Real-time collaboration support
6. **Version History**: Undo/redo across sessions
7. **Export Options**: Export as HTML file, CodePen, etc.
8. **Themes**: More built-in themes beyond dark/light
9. **Mobile Support**: Touch-optimized interface for mobile devices
10. **Plugin System**: Allow extending functionality via plugins
