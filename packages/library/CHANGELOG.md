# react-html-content-editor

## 1.4.0

### Minor Changes

- 3526293: Ship Monaco as a transitive dependency

  `@monaco-editor/react` and `monaco-editor` moved from `peerDependencies` to
  `dependencies`. Consuming projects no longer need to install them directly —
  they are pulled in automatically with the library. `react`, `react-dom` and
  `lucide-react` remain peer dependencies.

  Both packages are still marked `external` in the bundle, so Monaco is not
  duplicated into the published output.

## 1.3.0

### Minor Changes

- 591b2f7: Add more WYSIWYG controls:

  - `WysiwygEmoji` / `WysiwygSpecialChar` — pickers that insert an emoji or a
    special character.
  - `WysiwygClearColor` — reset the text color to the inherited default.
  - `WysiwygLinkEditor` — place inside the editor; when the caret is in a link, a
    floating bar lets you open, edit (change URL) or remove it.
  - `WysiwygFullscreen` — toggle fullscreen for the standalone editor.

  Also exposes `rootRef` on the Wysiwyg context.

- be742c5: Add more WYSIWYG controls:

  - `WysiwygUndo` / `WysiwygRedo` — undo and redo edits.
  - `WysiwygAlignMenu` — a single text-alignment control whose trigger shows the
    alignment currently applied to the selection and opens a picker with
    left / center / justify / right (composed from `WysiwygAlign`).

- 4d40c4f: Add WYSIWYG image controls:

  - `WysiwygImage` — insert an image with no server. By default it opens a file
    picker and embeds the file as a base64 data URI; pass `getSrc` to insert by
    URL/link instead.
  - `WysiwygImageUpload` — pick a file, upload it via your `upload(file)` handler,
    and insert the returned URL. Disables itself and shows a spinner while
    uploading; supports `onError`.
  - `WysiwygImageResizer` — click an image in the editor to reveal a floating bar
    of size presets (S/M/L + reset) and a pixel-width input that set the image
    width; place it inside the editor. The bar is rendered in a portal and
    anchored to the image so it stays put regardless of ancestor transforms.

  All work inside a standalone `Wysiwyg` or a `ContentEditorWysiwyg`.

- 1bb4bff: Add a batch of WYSIWYG controls and a reusable dropdown primitive:

  - **`WysiwygDropdown`** — reusable popover/trigger primitive (now powering the
    grouped controls, incl. a refactored `WysiwygAlignMenu`).
  - **Inline:** `WysiwygSubscript`, `WysiwygSuperscript`, `WysiwygInlineCode`.
  - **Block:** `WysiwygCodeBlock`, `WysiwygHorizontalRule`, `WysiwygIndent`,
    `WysiwygOutdent`, and `WysiwygHeadingMenu` (H1–H6 + paragraph in one dropdown).
  - **Color / font:** `WysiwygTextColor`, `WysiwygHighlight` (swatch pickers),
    `WysiwygFontFamily` (dropdown).
  - **`WysiwygFontSizeInput`** — numeric input to type an exact font size in px.
  - **`WysiwygWordCount`** — read-only word/character counter.

- 4e4e76d: Add table, task-list and document WYSIWYG controls, and improve link and font-size UX:

  - **Tables:** `WysiwygTable` (insert from a size picker) and `WysiwygTableEditor`
    (floating bar to add/remove rows and columns, or delete the table).
  - **`WysiwygTaskList`** — insert a checklist; click an item's checkbox to toggle it.
  - **Text:** `WysiwygCaseTransform` (UPPER / lower / Title / Sentence, preserving
    inline markup), `WysiwygLineHeight` and `WysiwygLetterSpacing`.
  - **Documents:** `WysiwygCallout` (colored info boxes), `WysiwygTableOfContents`
    (built from the headings), `WysiwygFindReplace` (find/replace panel),
    `WysiwygPrint`, and `WysiwygExport` (HTML / Markdown / plain text, plus an
    exported `htmlToMarkdown` helper).
  - **`WysiwygLink`** now opens an inline popover with a URL field instead of a
    `window.prompt` (the `getUrl` prop still works as an override).
  - **`WysiwygFontSizeInput`** gains − / + steppers and applies the size live as you
    type or step, re-sizing an existing span in place instead of nesting.

  Toolbar popovers (grouped dropdowns and the find & replace panel) now render in a
  body portal, so they are no longer clipped by the editor container near an edge
  and flip to stay within the viewport.

## 1.2.1

### Patch Changes

- b4d7d6b: Update package metadata and README for npm: point `homepage` at the docs site
  (https://adrianomaringolo.github.io/react-html-content-editor/), add a cover
  banner and a live-demo/docs links row, link the AI-agent `llms.txt` reference,
  and refresh the feature list. No runtime code changes.

## 1.2.0

### Minor Changes

- 0d8bf97: Add a composition API and an integrated WYSIWYG editor.

  - **Composition API for `ContentEditor`**: assemble the editor from parts —
    `ContentEditorToolbar`, `ContentEditorBody`, `ContentEditorCode`,
    `ContentEditorPreview` and `ContentEditorWysiwyg`. Passing children opts in;
    without children the existing default layout renders unchanged, so this is
    fully backwards compatible. New `useContentEditorContext` hook and
    `defaultMode` prop.
  - **Integrated WYSIWYG**: a `Code / Visual` toolbar switch toggles between the
    Monaco HTML/CSS + preview view and a rich-text surface; both edit the same
    value and the CSS is applied to the visual editor.
  - **Standalone WYSIWYG components**: `Wysiwyg` with composable toolbar controls
    (bold, italic, headings, lists, links, font size, alignment, …), the generic
    `WysiwygControl` building block and `useWysiwygContext` for building your own
    controls.

## 1.1.0

### Minor Changes

- 908668c: Initial release with comprehensive features:

  - Monaco Editor integration for HTML and CSS editing
  - Live preview with real-time updates
  - Toggle buttons for Edit/Preview modes with split view support
  - Fullscreen mode for distraction-free editing
  - Auto-save functionality with visual status indicators
  - Keyboard shortcuts (Ctrl/⌘+S, Ctrl/⌘+Shift+F, Ctrl/⌘+Shift+M)
  - Multiple themes support (light/dark)
  - Scroll synchronization between editor and preview
  - Accessibility features with ARIA labels
  - Comprehensive test suite with 120+ passing tests
  - TypeScript support with full type definitions
  - Lightweight bundle (8.4 KB gzipped)

### Patch Changes

- 0c55ed4: Exporting correct library version

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
