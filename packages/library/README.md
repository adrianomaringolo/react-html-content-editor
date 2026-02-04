# React HTML Content Editor

A sophisticated HTML and CSS content editor built with Monaco Editor (the same editor that powers VS Code). Features multiple view modes, real-time preview, scroll synchronization, and auto-save functionality.

## Features

- **Dual Editor Support**: Separate Monaco Editor instances for HTML and CSS
- **Multiple View Modes**: Edit, preview, and split view options
- **Fullscreen Mode**: Distraction-free editing experience
- **Scroll Synchronization**: Synchronized scrolling between HTML editor and preview
- **Auto-Save**: Automatic change detection with save status indicators
- **Keyboard Shortcuts**: Comprehensive shortcuts for common actions (see [KEYBOARD_SHORTCUTS.md](./KEYBOARD_SHORTCUTS.md))
- **Format on Demand**: One-click code formatting for both HTML and CSS
- **Compact Toolbar**: Icon-based toolbar with tooltips showing keyboard shortcuts
- **TypeScript First**: Full type safety with exported type definitions
- **Theme Support**: Dark and light themes via CSS variables
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Customization**: Extensive props for customizing appearance and behavior
- **Zero Framework Dependencies**: Works with any React project without Tailwind or other UI libraries

## Installation

```bash
npm install react-html-content-editor
# or
pnpm add react-html-content-editor
# or
yarn add react-html-content-editor
```

## Peer Dependencies

This library requires the following peer dependencies to be installed in your project:

```bash
npm install react react-dom @monaco-editor/react monaco-editor lucide-react
```

**Required versions:**

- `react` ^18.0.0
- `react-dom` ^18.0.0
- `@monaco-editor/react` ^4.6.0
- `monaco-editor` ^0.44.0
- `lucide-react` ^0.263.0

## Importing Styles

**Important:** You must import the CSS file in your application for the component to display correctly.

```tsx
// In your main entry file (e.g., main.tsx, App.tsx, or index.tsx)
import "react-html-content-editor/dist/style.css";
```

The CSS file includes all necessary styles for:

- Component layout and structure
- Monaco Editor wrapper
- Buttons and controls
- Tabs and navigation
- Preview pane
- Dark theme support
- Responsive design

## Basic Usage

```tsx
import { useState } from "react";
import { ContentEditor } from "react-html-content-editor";
import "react-html-content-editor/dist/style.css"; // Import styles

function App() {
  const [value, setValue] = useState({
    html: "<h1>Hello World</h1>",
    css: "h1 { color: blue; }",
  });

  return <ContentEditor value={value} onChange={setValue} />;
}
```

## API Reference

### ContentEditor Props

#### `value` (required)

Type: `ContentValue`

The current HTML and CSS content.

```typescript
interface ContentValue {
  html: string;
  css: string;
}
```

#### `onChange` (required)

Type: `(value: ContentValue) => void`

Callback fired when the content changes in either editor.

#### `onSave` (optional)

Type: `() => Promise<void>`

Callback fired when the user triggers save (Ctrl+S or save button). Should return a Promise that resolves when save is complete.

```tsx
<ContentEditor
  value={value}
  onChange={setValue}
  onSave={async () => {
    await saveToServer(value);
  }}
/>
```

#### `isSaving` (optional)

Type: `boolean`

Indicates whether a save operation is in progress. Used to show loading state.

#### `htmlLabel` (optional)

Type: `string`

Default: `"HTML"`

Custom label for the HTML editor tab.

#### `cssLabel` (optional)

Type: `string`

Default: `"CSS"`

Custom label for the CSS editor tab.

#### `className` (optional)

Type: `string`

Additional CSS class name to apply to the root container.

#### `height` (optional)

Type: `string | number`

Default: `"400px"`

Height of the editor in normal (non-fullscreen) mode. Can be a number (pixels) or a CSS string.

```tsx
<ContentEditor height={600} {...props} />
<ContentEditor height="50vh" {...props} />
```

#### `defaultTab` (optional)

Type: `"html" | "css"`

Default: `"html"`

Which editor tab should be active by default.

#### `editorOptions` (optional)

Type: `editor.IStandaloneEditorOptions`

Monaco Editor configuration options. Merged with default options.

```tsx
<ContentEditor
  editorOptions={{
    fontSize: 16,
    lineNumbers: "off",
    minimap: { enabled: true },
  }}
  {...props}
/>
```

#### `theme` (optional)

Type: `"vs-dark" | "vs-light"`

Default: `"vs-dark"`

Monaco Editor theme.

#### `error` (optional)

Type: `string`

Error message to display below the editor.

```tsx
<ContentEditor error='Failed to save content. Please try again.' {...props} />
```

## Type Exports

The library exports the following TypeScript types:

```typescript
import type {
  ContentValue,
  ContentEditorProps,
  SaveStatus,
  ViewMode,
  EditorType,
} from "react-html-content-editor";
```

### `ContentValue`

```typescript
interface ContentValue {
  html: string;
  css: string;
}
```

### `SaveStatus`

```typescript
type SaveStatus = "saved" | "unsaved" | "saving";
```

### `ViewMode`

```typescript
type ViewMode = "edit" | "preview" | "split";
```

### `EditorType`

```typescript
type EditorType = "html" | "css";
```

## Advanced Usage

### With Auto-Save

```tsx
import { useState, useCallback } from "react";
import { ContentEditor } from "react-html-content-editor";

function AutoSaveEditor() {
  const [value, setValue] = useState({ html: "", css: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await fetch("/api/save", {
        method: "POST",
        body: JSON.stringify(value),
      });
    } finally {
      setIsSaving(false);
    }
  }, [value]);

  return (
    <ContentEditor
      value={value}
      onChange={setValue}
      onSave={handleSave}
      isSaving={isSaving}
    />
  );
}
```

### With Custom Styling

```tsx
<ContentEditor
  className='my-custom-editor'
  height='600px'
  theme='vs-light'
  editorOptions={{
    fontSize: 16,
    fontFamily: "Fira Code, monospace",
  }}
  {...props}
/>
```

### With Error Handling

```tsx
function EditorWithValidation() {
  const [value, setValue] = useState({ html: "", css: "" });
  const [error, setError] = useState<string>();

  const handleSave = async () => {
    try {
      await saveContent(value);
      setError(undefined);
    } catch (err) {
      setError("Failed to save content. Please try again.");
    }
  };

  return (
    <ContentEditor
      value={value}
      onChange={setValue}
      onSave={handleSave}
      error={error}
    />
  );
}
```

## Styling Customization

The library uses CSS modules and CSS variables for styling. You can customize the appearance by overriding CSS variables:

```css
.my-custom-editor {
  --color-primary: #3b82f6;
  --color-border: #e5e7eb;
  --bg-primary: #ffffff;
  --text-primary: #111827;
  --spacing-2: 0.5rem;
  --radius-md: 0.375rem;
}

/* Dark theme */
[data-theme="dark"] .my-custom-editor {
  --color-border: #374151;
  --bg-primary: #111827;
  --text-primary: #f9fafb;
}
```

### Available CSS Variables

- **Colors**: `--color-primary`, `--color-border`, `--color-error`, `--color-success`, `--color-warning`
- **Backgrounds**: `--bg-primary`, `--bg-secondary`, `--bg-muted`
- **Text**: `--text-primary`, `--text-secondary`, `--text-muted`
- **Spacing**: `--spacing-1` through `--spacing-4`
- **Border Radius**: `--radius-sm`, `--radius-md`, `--radius-lg`

## Keyboard Shortcuts

### Editor Shortcuts

All Monaco Editor shortcuts are available:

- **Ctrl+S / Cmd+S**: Save (triggers `onSave` callback)
- **Ctrl+F / Cmd+F**: Find
- **Ctrl+H / Cmd+H**: Find and replace
- **Ctrl+Z / Cmd+Z**: Undo
- **Ctrl+Y / Cmd+Y**: Redo
- **Alt+Shift+F**: Format document
- **Ctrl+/ / Cmd+/**: Toggle line comment
- **Ctrl+D / Cmd+D**: Add selection to next find match

### Component Shortcuts

- **Escape**: Close fullscreen mode or dialogs
- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and controls

## Security Warning

⚠️ **XSS Prevention**: This component uses `dangerouslySetInnerHTML` to render HTML content in the preview. You **must** sanitize user-provided HTML before passing it to the component to prevent XSS attacks.

### Recommended: Use DOMPurify

```tsx
import DOMPurify from "dompurify";
import { ContentEditor } from "react-html-content-editor";

function SafeEditor() {
  const [value, setValue] = useState({ html: "", css: "" });

  const sanitizedValue = {
    html: DOMPurify.sanitize(value.html),
    css: value.css,
  };

  return <ContentEditor value={sanitizedValue} onChange={setValue} />;
}
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

Monaco Editor requires modern browser features and does not support IE11.

## License

MIT © [Your Name]

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and contribution guidelines.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.
