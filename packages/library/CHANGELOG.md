# react-html-content-editor

## 1.0.0

### Major Changes

- Initial release of React HTML Content Editor library

  This is the first public release of the React HTML Content Editor, a sophisticated standalone library for editing HTML and CSS content with Monaco Editor integration.

  ## Features

  - **Dual Editor Support**: Separate Monaco Editor instances for HTML and CSS
  - **Multiple View Modes**: Edit, preview, and split view options
  - **Fullscreen Mode**: Distraction-free editing experience
  - **Scroll Synchronization**: Synchronized scrolling between editor and preview
  - **Auto-Save**: Automatic change detection with save status indicators
  - **Keyboard Shortcuts**: Ctrl+S for save, Monaco's built-in shortcuts
  - **Format on Demand**: One-click code formatting for both HTML and CSS
  - **TypeScript First**: Full type safety with exported type definitions
  - **Theme Support**: Dark and light themes via CSS variables
  - **Accessibility**: ARIA labels, keyboard navigation, screen reader support
  - **Customization**: Extensive props for customizing appearance and behavior
  - **Zero Framework Dependencies**: Works with any React project without Tailwind or other UI libraries

  ## Breaking Changes

  This is the initial release, so there are no breaking changes from previous versions.

  ## Installation

  ```bash
  npm install react-html-content-editor
  # or
  pnpm add react-html-content-editor
  # or
  yarn add react-html-content-editor
  ```

  ## Peer Dependencies

  This library requires the following peer dependencies:

  - react ^18.0.0
  - react-dom ^18.0.0
  - @monaco-editor/react ^4.6.0
  - monaco-editor ^0.44.0
  - lucide-react ^0.263.0

  ## Basic Usage

  ```tsx
  import { ContentEditor } from "react-html-content-editor";
  import "react-html-content-editor/styles.css";

  function App() {
    const [value, setValue] = useState({
      html: "<h1>Hello World</h1>",
      css: "h1 { color: blue; }",
    });

    return <ContentEditor value={value} onChange={setValue} />;
  }
  ```

  ## Documentation

  For complete documentation, API reference, and examples, please visit the GitHub repository.

- BREAKING CHANGE: Update ContentValue interface to require explicit null handling

### Minor Changes

- Add new customization options for editor appearance

### Patch Changes

- Fix scroll synchronization edge case with empty content
