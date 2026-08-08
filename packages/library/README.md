<p align="center">
  <img src="https://raw.githubusercontent.com/adrianomaringolo/react-html-content-editor/main/assets/cover.png" alt="React HTML Content Editor — HTML/CSS editor with a live preview and an integrated WYSIWYG mode" width="100%" />
</p>

<p align="center">
  <a href="https://adrianomaringolo.github.io/react-html-content-editor/"><b>Live demo &amp; documentation</b></a>
  ·
  <a href="https://www.npmjs.com/package/react-html-content-editor">npm</a>
  ·
  <a href="https://github.com/adrianomaringolo/react-html-content-editor">GitHub</a>
</p>

# React HTML Content Editor

A sophisticated HTML and CSS content editor with multiple view modes, real-time preview,
scroll synchronization, and auto-save functionality. Code editing works out of the box with
no editor dependency, and upgrades to Monaco Editor (the engine behind VS Code) with a
single prop when you want it.

> **Using an AI coding agent?** A self-contained, LLM-optimized reference lives at
> [`llms.txt`](https://github.com/adrianomaringolo/react-html-content-editor/blob/main/llms.txt)
> (also served at `/llms.txt` on the docs site). It covers the full API, imports,
> composition, custom WYSIWYG controls, and common gotchas in one file.

## Contents

- [Features](#features) · [Installation](#installation) · [Peer dependencies](#peer-dependencies) · [Importing styles](#importing-styles) · [Basic usage](#basic-usage)
- [API reference](#api-reference) — every `ContentEditor` prop
- [Custom code editors](#custom-code-editors) — Monaco, CodeMirror, Ace or your own surface
- [Composition API](#composition-api) — assemble the editor from parts
- [WYSIWYG editor](#wysiwyg-editor) — standalone usage and the full [control reference](#control-reference)
- [Hooks and primitives](#hooks-and-primitives) · [Type exports](#type-exports)
- [Styling customization](#styling-customization) · [Keyboard shortcuts](#keyboard-shortcuts) · [Security](#security-warning)

## Features

- **Dual Editor Support**: Separate code editors for HTML and CSS
- **Optional Monaco**: Ships with a dependency-free textarea editor (line numbers, indentation handling); pass `codeEditor={MonacoCodeEditor}` for syntax highlighting and formatting
- **Composition API**: Assemble the editor from small parts (`ContentEditorToolbar`, `ContentEditorBody`, `ContentEditorCode`, `ContentEditorPreview`, `ContentEditorWysiwyg`) — or drop in the batteries-included default
- **Integrated WYSIWYG**: Toggle between the code view (HTML/CSS + preview) and a rich-text visual editor, both editing the same value
- **Standalone WYSIWYG**: The same rich-text editor also works on its own over a plain HTML string, with no code panes
- **~50 WYSIWYG Controls**: Headings, inline formatting, colors, lists, task lists, tables, callouts, images, links, emoji, find & replace, print and export — pick only the ones you need (see [Control reference](#control-reference))
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
npm install react react-dom lucide-react
```

**Required versions:**

- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0
- `lucide-react` ^1.0.0

### Monaco Editor (optional)

Monaco is **opt-in**. Out of the box the HTML/CSS panes use the built-in
`TextareaCodeEditor`: a plain textarea with a line-number gutter, Tab/Shift+Tab
indentation and indentation-preserving Enter. Nothing extra to install, nothing
extra in your bundle.

For syntax highlighting, IntelliSense and formatting, install the optional peer
dependencies and pass the Monaco adapter:

```bash
npm install @monaco-editor/react monaco-editor
```

```tsx
import { ContentEditor } from "react-html-content-editor";
import { MonacoCodeEditor } from "react-html-content-editor/monaco";

<ContentEditor value={value} onChange={setValue} codeEditor={MonacoCodeEditor} />;
```

The `react-html-content-editor/monaco` entry point is the only module that
imports Monaco, so projects that never import it never resolve those packages —
the main entry point stays Monaco-free.

| | Built-in textarea | `MonacoCodeEditor` |
| --- | --- | --- |
| Extra install | none | `@monaco-editor/react`, `monaco-editor` |
| Line numbers | yes (documents up to 2,000 lines) | yes |
| Tab / Shift+Tab indent, auto-indent on Enter | yes | yes |
| Light / dark theme, scroll sync | yes | yes |
| Syntax highlighting, IntelliSense | no | yes |
| Format action (`Ctrl+Shift+F`) | hidden — nothing to format with | yes |

Both accept the same props, so switching is a one-line change and no content is
lost. You can also supply your own implementation: any component matching
`CodeEditorProps` (see [Custom code editors](#custom-code-editors)) works.

## Importing Styles

**Important:** You must import the CSS file in your application for the component to display correctly.

```tsx
// In your main entry file (e.g., main.tsx, App.tsx, or index.tsx)
import "react-html-content-editor/dist/style.css";
```

The CSS file includes all necessary styles for:

- Component layout and structure
- Code editor surface (including the built-in textarea editor)
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

Type: `Record<string, any>`

Code editor configuration options, merged with the defaults. Follows Monaco's option
naming; the built-in textarea editor honours the `fontSize`, `tabSize`, `wordWrap`,
`lineNumbers` and `readOnly` subset.

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

Code editor theme.

#### `codeEditor` (optional)

Type: `CodeEditorComponent`

Default: `TextareaCodeEditor`

Code editor implementation for the HTML/CSS panes. See
[Monaco Editor (optional)](#monaco-editor-optional) and
[Custom code editors](#custom-code-editors).

```tsx
import { MonacoCodeEditor } from "react-html-content-editor/monaco";

<ContentEditor value={value} onChange={setValue} codeEditor={MonacoCodeEditor} />;
```

#### `error` (optional)

Type: `string`

Error message to display below the editor.

```tsx
<ContentEditor error='Failed to save content. Please try again.' {...props} />
```

#### `children` (optional)

Type: `ReactNode`

When provided, the editor renders in **composition mode**: the given children are
rendered inside a shared context instead of the default layout. See
[Composition API](#composition-api).

```tsx
<ContentEditor value={value} onChange={setValue}>
  <ContentEditorToolbar />
  <ContentEditorBody>
    <ContentEditorCode />
    <ContentEditorPreview />
  </ContentEditorBody>
</ContentEditor>
```

#### `defaultMode` (optional)

Type: `"code" | "wysiwyg"` (default: `"code"`)

Initial view mode in composition mode: `code` (HTML/CSS + preview) or
`wysiwyg` (rich-text visual editor).

## Custom code editors

The `codeEditor` prop accepts any component that implements `CodeEditorProps`, so
you can plug in CodeMirror, Ace, a highlighted read-only view, or your own
surface. Two contracts to honour:

1. **Props in** — the pane passes `defaultValue`, `language`, `theme`, `options`,
   `onChange`, `onReady`, `className` and `ariaLabel`. The surface is
   uncontrolled: seed it from `defaultValue` and report edits via `onChange`.
2. **Handle out** — call `onReady(handle)` on mount and `onReady(null)` on
   unmount. The handle powers the Format action and preview scroll sync.

Set `MyEditor.canFormat = false` when the implementation cannot reformat
documents; the toolbars then hide the Format action entirely instead of showing
a button that does nothing.

> The [Code Editor demo](https://adrianomaringolo.github.io/react-html-content-editor/#code-editor)
> runs all five surfaces below side by side, and the adapters live in
> [`packages/demo/src/editors/`](../demo/src/editors) ready to copy.

| Adapter                | Install                                    | Format |
| ---------------------- | ------------------------------------------ | ------ |
| `TextareaCodeEditor`   | built in, the default                      | no     |
| `MonacoCodeEditor`     | `@monaco-editor/react` + `monaco-editor`   | yes    |
| CodeMirror 6           | `codemirror` + language/theme packages     | no     |
| Ace                    | `ace-builds`                               | yes    |
| Your own               | nothing                                    | up to you |

### Minimal example

```tsx
import type { CodeEditorHandle, CodeEditorProps } from "react-html-content-editor";

function MyCodeEditor({ defaultValue, onChange, onReady }: CodeEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handle: CodeEditorHandle = {
      focus: () => ref.current?.focus(),
      format: () => false, // no formatter -> toolbars hide the action
      getScrollTop: () => ref.current?.scrollTop ?? 0,
      getMaxScroll: () =>
        Math.max(0, (ref.current?.scrollHeight ?? 0) - (ref.current?.clientHeight ?? 0)),
      setScrollTop: (top) => {
        if (ref.current) ref.current.scrollTop = top;
      },
      onScroll: (listener) => {
        ref.current?.addEventListener("scroll", listener);
        return () => ref.current?.removeEventListener("scroll", listener);
      },
    };
    onReady?.(handle);
    return () => onReady?.(null);
  }, [onReady]);

  return (
    <textarea
      ref={ref}
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
}

// Set to false when the implementation cannot reformat documents;
// the toolbars then hide the Format action entirely.
MyCodeEditor.canFormat = false;
```

### CodeMirror 6

Highlighting, bracket matching and a real undo history at a fraction of Monaco's
weight. CodeMirror ships no formatter, hence `canFormat = false`.

```bash
npm install codemirror @codemirror/state @codemirror/view \
  @codemirror/lang-html @codemirror/lang-css @codemirror/theme-one-dark
```

```tsx
import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import type { CodeEditorHandle, CodeEditorProps } from "react-html-content-editor";

function CodeMirrorCodeEditor({
  defaultValue,
  language,
  theme,
  onChange,
  onReady,
  className,
  ariaLabel,
}: CodeEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const view = new EditorView({
      parent: hostRef.current!,
      state: EditorState.create({
        doc: defaultValue,
        extensions: [
          basicSetup,
          language === "css" ? css() : html(),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({ "aria-label": ariaLabel ?? language }),
          // The pane owns the height; CodeMirror fills it.
          EditorView.theme({ "&": { height: "100%" } }),
          theme === "vs-light" ? [] : oneDark,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onChange(update.state.doc.toString());
          }),
        ],
      }),
    });

    const handle: CodeEditorHandle = {
      focus: () => view.focus(),
      format: () => false,
      getScrollTop: () => view.scrollDOM.scrollTop,
      getMaxScroll: () =>
        Math.max(0, view.scrollDOM.scrollHeight - view.scrollDOM.clientHeight),
      setScrollTop: (top) => {
        view.scrollDOM.scrollTop = top;
      },
      onScroll: (listener) => {
        view.scrollDOM.addEventListener("scroll", listener);
        return () => view.scrollDOM.removeEventListener("scroll", listener);
      },
    };
    onReady?.(handle);

    return () => {
      onReady?.(null);
      view.destroy();
    };
    // Built once: the pane remounts the editor when the seed changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ flex: 1, minHeight: 0, minWidth: 0, overflow: "hidden" }}
    />
  );
}

CodeMirrorCodeEditor.canFormat = false;
```

Use a [`Compartment`](https://codemirror.net/docs/ref/#state.Compartment) for the
theme extension if you want light/dark switches to reconfigure the view in place
rather than tear it down — the demo adapter does.

### Ace

The only non-Monaco option here that can reformat: `ext-beautify` handles HTML and
CSS, so `canFormat` stays `true` and the Format action keeps working. Ace's syntax
workers are separate files, so the adapter turns them off to stay a single import.

```bash
npm install ace-builds
```

```tsx
import { useEffect, useRef } from "react";
import ace from "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-monokai";
import beautify from "ace-builds/src-noconflict/ext-beautify";
import type { CodeEditorHandle, CodeEditorProps } from "react-html-content-editor";

function AceCodeEditor({
  defaultValue,
  language,
  onChange,
  onReady,
  className,
}: CodeEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current!;
    const editor = ace.edit(host, {
      value: defaultValue,
      mode: `ace/mode/${language}`,
      theme: "ace/theme/monokai",
      wrap: true,
      showPrintMargin: false,
      useWorker: false,
    });

    const handleChange = () => onChange(editor.getValue());
    editor.on("change", handleChange);

    // Ace measures its container once and never observes it, so split-view and
    // fullscreen toggles have to ask it to re-layout.
    const observer = new ResizeObserver(() => editor.resize());
    observer.observe(host);

    const handle: CodeEditorHandle = {
      focus: () => editor.focus(),
      format: () => {
        beautify.beautify(editor.session);
        return true;
      },
      getScrollTop: () => editor.session.getScrollTop(),
      getMaxScroll: () =>
        Math.max(
          0,
          editor.renderer.layerConfig.maxHeight -
            editor.renderer.$size.scrollerHeight,
        ),
      setScrollTop: (top) => editor.session.setScrollTop(top),
      onScroll: (listener) => {
        editor.session.on("changeScrollTop", listener);
        return () => editor.session.off("changeScrollTop", listener);
      },
    };
    onReady?.(handle);

    return () => {
      observer.disconnect();
      editor.off("change", handleChange);
      onReady?.(null);
      editor.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ace positions its layers absolutely, so the host needs a positioning context.
  return (
    <div
      ref={hostRef}
      className={className}
      style={{ flex: 1, minHeight: 0, minWidth: 0, position: "relative" }}
    />
  );
}

AceCodeEditor.canFormat = true;
```

`ace-builds` ships type declarations but does not point at them from its
`package.json`, so under `moduleResolution: "bundler"` you need a one-line
ambient reference somewhere in your sources:

```ts
/// <reference path="../node_modules/ace-builds/ace.d.ts" />
```

### Rolling your own

`codeEditor` is not limited to wrapping an existing library. The demo's
`HighlightCodeEditor` is a transparent `<textarea>` layered over a coloured
`<pre>` with a ~40-line regex highlighter and no dependencies at all. The whole
trick is that both layers declare identical `font`, `line-height`, `padding`,
`tab-size` and `white-space: pre-wrap`, so the caret lands exactly on the
coloured glyphs:

```css
.hce-highlight,
.hce-input {
  position: absolute;
  inset: 0;
  margin: 0;
  border: 0;
  padding: 0.75rem 1rem;
  font: inherit;
  line-height: 1.5;
  tab-size: inherit;
  white-space: pre-wrap;
  word-break: break-word;
}

.hce-input {
  overflow: auto;
  resize: none;
  background: transparent;
  color: transparent; /* the layer underneath is what you read */
  caret-color: var(--hce-fg);
}
```

The textarea is the scroller, so `getScrollTop` / `setScrollTop` read and write
`textarea.scrollTop`, and the `<pre>` is dragged along in the scroll handler.
Note that a controlled `<textarea>` has a weak native undo stack — reach for
CodeMirror or Ace if undo history matters to you.

## Composition API

`ContentEditor` can be assembled from composable parts — the same pattern used by
the standalone `Wysiwyg`. Pass children to opt in; without children the
batteries-included default layout (toolbar, editors, preview, fullscreen) is
rendered exactly as before, so this is fully backwards compatible.

| Component               | Role                                                                 |
| ----------------------- | -------------------------------------------------------------------- |
| `ContentEditor`         | Root. Owns the shared value/state and provides context to children.  |
| `ContentEditorToolbar`  | Default toolbar: mode switch, view toggles, tabs, format & save.     |
| `ContentEditorBody`     | Lays visible panes out side-by-side (split) or stacked on mobile.    |
| `ContentEditorCode`     | HTML/CSS code editors. Visible in `code` mode.                       |
| `ContentEditorPreview`  | Live HTML+CSS preview. Visible in `code` mode.                       |
| `ContentEditorWysiwyg`  | Rich-text surface bound to the HTML value. Visible in `wysiwyg` mode.|
| `ContentEditorProvider` | Advanced: the context provider on its own, without the shell markup. |
| `ContentEditorShell`    | Advanced: the root container (height, fullscreen, error slot) on its own. |

Each pane decides its own visibility from the shared context, so you place them
in any order and the current mode/toggles determine what shows.

```tsx
import {
  ContentEditor,
  ContentEditorToolbar,
  ContentEditorBody,
  ContentEditorCode,
  ContentEditorPreview,
  ContentEditorWysiwyg,
} from "react-html-content-editor";
import "react-html-content-editor/dist/style.css";

function ComposedEditor() {
  const [value, setValue] = useState({ html: "<h1>Hi</h1>", css: "h1 { color: teal; }" });

  return (
    <ContentEditor value={value} onChange={setValue} height='520px'>
      <ContentEditorToolbar />
      <ContentEditorBody>
        <ContentEditorCode />
        <ContentEditorPreview />
        <ContentEditorWysiwyg />
      </ContentEditorBody>
    </ContentEditor>
  );
}
```

### Integrated WYSIWYG

Adding a `ContentEditorWysiwyg` pane makes the toolbar show a **Code / Visual**
switch. Both views edit the same `value.html`; the `value.css` is applied to the
WYSIWYG surface as a `<style>` tag, so the rich-text view reflects your styles.
Compose the WYSIWYG toolbar yourself, or omit children for a sensible default:

```tsx
<ContentEditorWysiwyg>
  <WysiwygToolbar>
    <WysiwygHeading level={1} />
    <WysiwygBold />
    <WysiwygItalic />
    <WysiwygLink />
  </WysiwygToolbar>
  <WysiwygContent placeholder='Start writing…' />
</ContentEditorWysiwyg>
```

`ContentEditorWysiwyg` props: `placeholder?`, `minHeight?` (`string | number`),
`className?` and `children?`. The full control set is documented under
[WYSIWYG editor](#wysiwyg-editor).

### Custom context access

Build your own controls with the `useContentEditorContext` hook, which exposes
the value, save state, current mode, view toggles and editor refs:

```tsx
import { useContentEditorContext } from "react-html-content-editor";

function WordCount() {
  const { value } = useContentEditorContext();
  const words = value.html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean);
  return <span>{words.length} words</span>;
}

// then: <ContentEditorToolbar><WordCount /></ContentEditorToolbar>
```

It throws when called outside a `<ContentEditor>`. For manual wiring the
underlying `ContentEditorProvider` and `ContentEditorShell` are exported too.

## WYSIWYG editor

The rich-text editor is available two ways, and both share the same controls,
the same `useWysiwygContext()` hook and the same custom-control API:

- **Inside `ContentEditor`** — add a `ContentEditorWysiwyg` pane in composition
  mode (see [Integrated WYSIWYG](#integrated-wysiwyg)). The toolbar gains a
  **Code / Visual** switch and both views edit the same `value.html`.
- **Standalone `Wysiwyg`** — a self-contained editor over a single HTML string,
  with no code panes, preview or CSS.

### Standalone usage

`Wysiwyg` is a compound component: you place the controls you want in the
toolbar, in any order, and nothing you leave out ships in your bundle.

```tsx
import { useState } from "react";
import {
  Wysiwyg,
  WysiwygToolbar,
  WysiwygContent,
  WysiwygSeparator,
  WysiwygHeadingMenu,
  WysiwygBold,
  WysiwygItalic,
  WysiwygUnorderedList,
  WysiwygOrderedList,
  WysiwygAlignMenu,
  WysiwygLink,
  WysiwygLinkEditor,
  WysiwygWordCount,
} from "react-html-content-editor";
import "react-html-content-editor/dist/style.css";

function Editor() {
  const [html, setHtml] = useState("<p>Hi</p>");

  return (
    <Wysiwyg value={html} onChange={setHtml}>
      <WysiwygToolbar>
        <WysiwygHeadingMenu />
        <WysiwygSeparator />
        <WysiwygBold />
        <WysiwygItalic />
        <WysiwygSeparator />
        <WysiwygUnorderedList />
        <WysiwygOrderedList />
        <WysiwygAlignMenu />
        <WysiwygLink />
        <WysiwygWordCount />
      </WysiwygToolbar>
      <WysiwygContent placeholder='Start writing…' minHeight='320px' />
      <WysiwygLinkEditor />
    </Wysiwyg>
  );
}
```

#### `Wysiwyg` props

| Prop           | Type                       | Default | Notes                                          |
| -------------- | -------------------------- | ------- | ---------------------------------------------- |
| `value`        | `string`                   | —       | Controlled HTML value.                         |
| `defaultValue` | `string`                   | `""`    | Initial HTML when uncontrolled.                |
| `onChange`     | `(html: string) => void`   | —       | Fired with the new HTML on every edit.         |
| `disabled`     | `boolean`                  | `false` | Read-only surface; every control is disabled.  |
| `className`    | `string`                   | `""`    | Applied to the root element.                   |
| `children`     | `ReactNode`                | —       | Required. The toolbar, content and extras.     |

#### `WysiwygContent` props

| Prop         | Type               | Default              |
| ------------ | ------------------ | -------------------- |
| `placeholder`| `string`           | `"Start writing…"`   |
| `minHeight`  | `string \| number` | `"240px"`            |
| `className`  | `string`           | `""`                 |
| `aria-label` | `string`           | `"Rich text editor"` |

`WysiwygToolbar` is the `role="toolbar"` container for the controls — it takes
`className?` and `aria-label?` (default `"Formatting"`). `WysiwygSeparator`
draws a vertical divider between groups and takes a `className?`.

### Control reference

Every control accepts `className?` and `title?` (`NamedControlProps`) — `title`
is the tooltip *and* the accessible label, so translate it for non-English UIs.
Extra props are listed below where they exist.

Controls marked **contextual** render no toolbar button: place them anywhere
inside the editor and they appear as a floating bar when the caret (or the
click) lands on the element they edit.

> The [All Controls demo](https://adrianomaringolo.github.io/react-html-content-editor/#wysiwyg-controls)
> renders every one of these in a single toolbar, with its icon and description.

#### History

| Control        | Function                    |
| -------------- | --------------------------- |
| `WysiwygUndo`  | Undo the last edit          |
| `WysiwygRedo`  | Redo the last undone edit   |

#### Blocks

| Control                  | Function                                        | Extra props                        |
| ------------------------ | ----------------------------------------------- | ---------------------------------- |
| `WysiwygHeading`         | Turn the block into a heading                   | `level: 1\|2\|3\|4\|5\|6` (required) |
| `WysiwygHeadingMenu`     | H1–H6 + paragraph in one dropdown; the trigger shows the current level | `levels?` (default `[1..6]`) |
| `WysiwygParagraph`       | Reset the block to a paragraph                  |                                    |
| `WysiwygBlockquote`      | Format the block as a quote                     |                                    |
| `WysiwygCodeBlock`       | Format the block as a `<pre>` code block        |                                    |
| `WysiwygHorizontalRule`  | Insert a horizontal rule                        |                                    |
| `WysiwygIndent`          | Increase block indentation                      |                                    |
| `WysiwygOutdent`         | Decrease block indentation                      |                                    |

#### Inline formatting

| Control                  | Function                                        | Extra props                                    |
| ------------------------ | ----------------------------------------------- | ---------------------------------------------- |
| `WysiwygBold`            | Toggle bold                                     |                                                |
| `WysiwygItalic`          | Toggle italic                                   |                                                |
| `WysiwygUnderline`       | Toggle underline                                |                                                |
| `WysiwygStrikethrough`   | Toggle strikethrough                            |                                                |
| `WysiwygSubscript`       | Toggle subscript                                |                                                |
| `WysiwygSuperscript`     | Toggle superscript                              |                                                |
| `WysiwygInlineCode`      | Wrap the selection in inline `<code>` (or unwrap it) |                                           |
| `WysiwygFontSize`        | Dropdown of preset font sizes                   | `options?: WysiwygFontSizeOption[]`            |
| `WysiwygFontSizeInput`   | Type an exact size in px, with −/+ steppers     | `min?` (`1`), `max?` (`400`), `step?` (`1`)    |
| `WysiwygFontFamily`      | Dropdown to set the font family                 | `options?: WysiwygFontFamilyOption[]`          |
| `WysiwygTextColor`       | Swatch picker for text color (`foreColor`)      | `colors?: string[]`                            |
| `WysiwygClearColor`      | Reset the text color to the inherited default   |                                                |
| `WysiwygHighlight`       | Swatch picker for highlight color (`hiliteColor`) | `colors?: string[]` — include `"transparent"` to clear |
| `WysiwygCaseTransform`   | Change case: UPPER / lower / Title / Sentence   | `modes?: WysiwygCaseMode[]`                    |
| `WysiwygLineHeight`      | Set the line height of the selected block(s)    | `options?: WysiwygLineHeightOption[]`          |
| `WysiwygLetterSpacing`   | Set the letter spacing of the selection         | `options?: WysiwygLetterSpacingOption[]`       |
| `WysiwygEmoji`           | Insert an emoji from a picker                   | `emojis?: string[]`                            |
| `WysiwygSpecialChar`     | Insert a special character (—, ©, ±, …)         | `characters?: string[]`                        |

#### Lists

| Control                 | Function                                                        |
| ----------------------- | --------------------------------------------------------------- |
| `WysiwygUnorderedList`  | Toggle a bulleted list                                           |
| `WysiwygOrderedList`    | Toggle a numbered list                                           |
| `WysiwygTaskList`       | Insert a checklist; clicking an item's box toggles `data-checked` |

The task-list checkbox is drawn in CSS rather than embedded as an `<input>`, so
`Enter` continues the list normally and the emitted HTML stays clean. The
toggle handler lives on the control, so keep `WysiwygTaskList` mounted for
existing checklists to stay interactive.

#### Tables

| Control              | Function                                                            | Extra props                                                       |
| -------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `WysiwygTable`       | Insert a table by dragging over a size grid                         | `maxRows?` (`8`), `maxCols?` (`8`), `withHeaderRow?` (`true`)      |
| `WysiwygTableEditor` | **Contextual** — caret inside a cell opens a bar to insert/delete rows and columns, or delete the table | `className?`               |

#### Documents

| Control                   | Function                                                | Extra props                                          |
| ------------------------- | -------------------------------------------------------- | ---------------------------------------------------- |
| `WysiwygCallout`          | Insert a colored callout / info box you can type into    | `variants?: WysiwygCalloutVariant[]` (info, success, warning, danger) |
| `WysiwygTableOfContents`  | Insert a TOC built from the headings, adding `id`s as needed (a static snapshot — re-run it after editing headings) |                          |
| `WysiwygFindReplace`      | Find and replace text, with a case-sensitivity toggle    |                                                      |
| `WysiwygPrint`            | Open the content in a new window and print it            | `documentTitle?` (default `document.title`), `css?`   |
| `WysiwygExport`           | Download as HTML, Markdown or plain text                 | `fileName?` (`"document"`), `formats?: WysiwygExportFormat[]` |

`htmlToMarkdown(html)` — the Markdown serializer behind the export control — is
exported on its own, so you can reuse it for a "copy as Markdown" action.

#### Alignment

| Control            | Function                                                            | Extra props                                            |
| ------------------ | -------------------------------------------------------------------- | ------------------------------------------------------ |
| `WysiwygAlign`     | Align a block — one button per value                                 | `value: "left"\|"center"\|"right"\|"justify"` (required) |
| `WysiwygAlignMenu` | One button showing the current alignment; opens a picker             |                                                        |

#### Links

| Control             | Function                                                                    | Extra props                                    |
| ------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------- |
| `WysiwygLink`       | Wrap the selection in a link (built-in URL popover)                          | `getUrl?: () => string \| null` to use your own dialog; return `null` to cancel |
| `WysiwygUnlink`     | Remove the link from the selection                                            |                                                |
| `WysiwygLinkEditor` | **Contextual** — caret inside a link opens a bar to open / edit / remove it   | `getUrl?: (current: string) => string \| null` |

#### Images

See [Image controls](#image-controls) below for the full walkthrough.

| Control                | Function                                                       |
| ---------------------- | -------------------------------------------------------------- |
| `WysiwygImage`         | Insert an image as a base64 data URI, or by URL via `getSrc`    |
| `WysiwygImageUpload`   | Pick a file, upload it with your handler, insert the returned URL |
| `WysiwygImageResizer`  | **Contextual** — click an image to resize it with presets or an exact pixel width |

#### Utilities

| Control                   | Function                                              | Extra props                                                  |
| ------------------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| `WysiwygClearFormatting`  | Strip inline formatting from the selection             |                                                              |
| `WysiwygFullscreen`       | Toggle fullscreen on the `Wysiwyg` root (Fullscreen API) |                                                            |
| `WysiwygWordCount`        | Read-only word / character counter (not a button)      | `render?: ({ words, characters }) => ReactNode`               |
| `WysiwygDropdown`         | The popover primitive the grouped controls are built on | `title`, `trigger`, `triggerAriaLabel?`, `triggerData?`, `active?`, `closeOnSelect?` (`true`) |
| `WysiwygControl`          | The button primitive every named control is built on   | See [Building custom WYSIWYG controls](#building-custom-wysiwyg-controls) |

### Image controls

Two ready-made controls insert images. Both work inside a standalone `Wysiwyg`
or a `ContentEditorWysiwyg`.

**`WysiwygImage`** — no server required. By default it opens a file picker and
embeds the chosen file as a **base64 data URI**. Pass `getSrc` to insert by
**URL/link** instead (it may be async):

```tsx
import { WysiwygImage } from "react-html-content-editor";

// base64 (default): pick a file, embed it inline
<WysiwygImage />

// link: resolve a URL yourself
<WysiwygImage getSrc={() => window.prompt("Image URL")} />
```

Props: `getSrc?: () => string | null | Promise<string | null>`,
`accept?` (default `"image/*"`), plus `className`/`title`.

**`WysiwygImageUpload`** — pick a file, upload it via your handler, then insert
the returned URL. The control disables itself and shows a spinner while
uploading:

```tsx
import { WysiwygImageUpload } from "react-html-content-editor";

<WysiwygImageUpload
  upload={async (file) => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    const { url } = await res.json();
    return url; // the URL to insert
  }}
  onError={(err) => console.error(err)}
/>
```

Props: `upload: (file: File) => Promise<string>` (required),
`accept?` (default `"image/*"`), `onError?`, plus `className`/`title`.

**`WysiwygImageResizer`** — click an image in the editor to reveal a small
floating bar with size presets and a **pixel-width input**. Selecting a preset
or entering a width sets the image's `width` (height stays `auto` to preserve
aspect ratio); the reset button restores the natural size. The bar is rendered
in a portal and anchored to the image. It renders no toolbar button — place it
anywhere inside the editor:

```tsx
import { WysiwygImageResizer } from "react-html-content-editor";

<Wysiwyg value={html} onChange={setHtml}>
  <WysiwygToolbar>{/* … */}</WysiwygToolbar>
  <WysiwygContent />
  <WysiwygImageResizer />
</Wysiwyg>;

// custom presets:
<WysiwygImageResizer
  options={[
    { label: "S", width: "25%", title: "Small" },
    { label: "M", width: "50%", title: "Medium" },
    { label: "Full", width: "100%" },
  ]}
/>;
```

Props: `options?: WysiwygImageSizeOption[]` (default S 25% / M 50% / L 100%),
`showReset?` (default `true`), `showPixelInput?` (default `true`), `resetTitle?`,
`className?`.

### Building custom WYSIWYG controls

Every built-in control is composed from the generic `WysiwygControl` building
block, and you build your own the same way. Drop the result into any
`WysiwygToolbar` (standalone `Wysiwyg` **or** inside `ContentEditorWysiwyg`).

**1. Declarative — wrap any `execCommand`.** Pass a `command` (and optional
`value` / `useCss`), plus an `isActive` predicate so the button reflects the
current selection:

```tsx
import { WysiwygControl } from "react-html-content-editor";
import { Highlighter } from "lucide-react";

function WysiwygHighlight() {
  return (
    <WysiwygControl
      command='hiliteColor'
      value='#fde047'
      useCss
      title='Highlight'
      isActive={({ queryValue }) => {
        const color = queryValue("hiliteColor") || queryValue("backColor");
        return !!color && color !== "transparent" && color !== "rgba(0, 0, 0, 0)";
      }}
    >
      <Highlighter size={16} aria-hidden='true' />
    </WysiwygControl>
  );
}
```

**2. Bespoke behaviour — `onActivate` + `useWysiwygContext`.** Read the editor
context and run whatever you like, while inheriting the toolbar button styling:

```tsx
import { WysiwygControl, useWysiwygContext } from "react-html-content-editor";
import { CalendarPlus } from "lucide-react";

function WysiwygInsertDate() {
  const { exec } = useWysiwygContext();
  return (
    <WysiwygControl
      command='insertText'
      title="Insert today's date"
      onActivate={() => exec("insertText", new Date().toLocaleDateString())}
    >
      <CalendarPlus size={16} aria-hidden='true' />
    </WysiwygControl>
  );
}

// then: <WysiwygToolbar> … <WysiwygHighlight /> <WysiwygInsertDate /> </WysiwygToolbar>
```

**3. Own UI — not just a button.** A control can keep local state and render
its own popover, menu or input. Here a text-colour picker applies `foreColor`:

```tsx
import { useWysiwygContext } from "react-html-content-editor";
import { Palette } from "lucide-react";
import { useState } from "react";

function WysiwygTextColor() {
  const { exec } = useWysiwygContext();
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button
        type='button'
        aria-label='Text color'
        aria-expanded={open}
        onMouseDown={(e) => e.preventDefault()} // keep the selection
        onClick={() => setOpen((o) => !o)}
      >
        <Palette size={16} aria-hidden='true' />
      </button>
      {open && (
        <div role='menu' style={{ position: "absolute", top: "100%" }}>
          {["#ef4444", "#3b82f6", "#7c3aed"].map((color) => (
            <button
              key={color}
              role='menuitem'
              style={{ background: color }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                exec("foreColor", color, true);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </span>
  );
}
```

> Call `e.preventDefault()` on `onMouseDown` in any custom control so pressing
> it doesn't collapse the editor's text selection before your command runs.

`useWysiwygContext()` exposes:

| Member         | Type                                                        | Use                                                     |
| -------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| `exec`         | `(command, value?, useCss?) => void`                        | Run a `document.execCommand` against the selection.      |
| `commit`       | `(html: string) => void`                                    | Persist HTML you mutated in the DOM yourself.            |
| `isActive`     | `(command: string) => boolean`                              | Whether a toggle command is on for the selection.        |
| `queryValue`   | `(command: string) => string`                               | Resolved command value (e.g. `formatBlock` → `"h2"`).    |
| `value`        | `string`                                                    | Current HTML.                                            |
| `version`      | `number`                                                    | Bumped on every selection/content change — read it to re-render on selection. |
| `disabled`     | `boolean`                                                   | The editor is read-only.                                 |
| `editorRef`    | `RefObject<HTMLDivElement>`                                 | The `contentEditable` surface.                           |
| `rootRef`      | `RefObject<HTMLDivElement>`                                 | The `Wysiwyg` root (used for fullscreen, portals).       |

Controls that reflect the selection (a dropdown showing the current font size,
say) should read `version` so React re-renders them when the caret moves.

## Hooks and primitives

Beyond the editor components, the package exports:

| Export                     | What it is                                                                    |
| -------------------------- | ----------------------------------------------------------------------------- |
| `useContentEditorContext`  | Shared `ContentEditor` state (composition mode).                               |
| `useWysiwygContext`        | Shared `Wysiwyg` state, for custom controls.                                   |
| `useScrollSync`            | Keeps two scrollable elements proportionally in sync.                          |
| `useAutoSave`              | Change detection + save status (`saved` / `unsaved` / `saving`).               |
| `useKeyboardShortcuts`     | The Ctrl/Cmd+S, Ctrl/Cmd+Shift+F and Ctrl/Cmd+Shift+M bindings.                |
| `TextareaCodeEditor`       | The default, dependency-free code surface — usable standalone.                 |
| `htmlToMarkdown`           | HTML → Markdown serializer used by `WysiwygExport`.                            |
| `Button`, `Tabs`, `Dialog` | The unstyled-ish UI primitives the editor is built from (with their sub-parts). |
| `version`                  | The package version string.                                                    |

## Type Exports

Everything is exported from the package root:

```typescript
// Core
import type {
  ContentValue,
  ContentEditorProps,
  SaveStatus,
  ViewMode,
  EditorType,
  ContentEditorMode,
  ContentEditorContextValue,
} from "react-html-content-editor";

// Code editors
import type {
  CodeEditorComponent,
  CodeEditorHandle,
  CodeEditorProps,
} from "react-html-content-editor";

// Composition parts
import type {
  ContentEditorProviderProps,
  ContentEditorShellProps,
  ContentEditorToolbarProps,
  ContentEditorBodyProps,
  ContentEditorCodeProps,
  ContentEditorPreviewProps,
  ContentEditorWysiwygProps,
} from "react-html-content-editor";

// WYSIWYG
import type {
  WysiwygProps,
  WysiwygContextValue,
  WysiwygToolbarProps,
  WysiwygContentProps,
  WysiwygControlProps,
  WysiwygDropdownProps,
  NamedControlProps, // { className?, title? } — shared by the named controls
} from "react-html-content-editor";
```

Parametrized controls export their own props (and, where relevant, an option
type): `WysiwygHeadingProps`, `WysiwygHeadingMenuProps`, `WysiwygAlignProps`,
`WysiwygAlignMenuProps`, `WysiwygFontSizeProps` + `WysiwygFontSizeOption`,
`WysiwygFontSizeInputProps`, `WysiwygFontFamilyProps` +
`WysiwygFontFamilyOption`, `WysiwygTextColorProps`,
`WysiwygCaseTransformProps` + `WysiwygCaseMode`, `WysiwygLineHeightProps` +
`WysiwygLineHeightOption`, `WysiwygLetterSpacingProps` +
`WysiwygLetterSpacingOption`, `WysiwygHighlightProps`, `WysiwygEmojiProps`,
`WysiwygSpecialCharProps`, `WysiwygWordCountProps`, `WysiwygLinkProps`,
`WysiwygLinkEditorProps`, `WysiwygTableProps`, `WysiwygTableEditorProps`,
`WysiwygCalloutProps` + `WysiwygCalloutVariant`, `WysiwygPrintProps`,
`WysiwygExportProps` + `WysiwygExportFormat`, `WysiwygImageProps`,
`WysiwygImageUploadProps`, `WysiwygImageResizerProps` +
`WysiwygImageSizeOption`.

The bundled UI primitives export theirs as well: `ButtonProps`, `TabsProps`,
`TabsListProps`, `TabsTriggerProps`, `TabsContentProps`, `DialogProps`,
`DialogTriggerProps`, `DialogContentProps`, `DialogHeaderProps`,
`DialogTitleProps`, `DialogDescriptionProps`, `DialogFooterProps`.

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

### `ContentEditorMode`

```typescript
type ContentEditorMode = "code" | "wysiwyg";
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

### Styling the built-in code editor

`TextareaCodeEditor` defaults to Monaco's `vs` / `vs-dark` palettes (picked from
the `theme` prop) and exposes its own variables so you can restyle the code
surface without touching the rest of the editor:

- `--rhce-code-bg`, `--rhce-code-fg` — editor background and text
- `--rhce-code-gutter-bg`, `--rhce-code-gutter-fg` — line-number column
- `--rhce-code-selection` — selection highlight
- `--rhce-code-font` — monospace font stack

```css
.my-editor {
  --rhce-code-bg: #0b1021;
  --rhce-code-fg: #e6e6f0;
  --rhce-code-gutter-fg: #5b6180;
  --rhce-code-font: "JetBrains Mono", monospace;
}
```

These have no effect when `codeEditor={MonacoCodeEditor}` is used — Monaco paints
its own surface, so theme it through Monaco's own API (`monaco.editor.defineTheme`)
or the `theme` prop instead.

### Styling `ContentEditorToolbar`

`ContentEditorToolbar` accepts a `className`, letting you restyle the toolbar
surface and the buttons inside it. The toolbar renders standard `<button>`
elements, and active toggles expose `aria-pressed="true"` — a convenient hook
for the "selected" look.

```tsx
<ContentEditorToolbar className='my-toolbar' />
```

```css
/* A dark, pill-shaped toolbar */
.my-toolbar {
  background: #0f172a;
  border-bottom-color: #1e293b;
  border-radius: 0.75rem 0.75rem 0 0;
  padding: 0.5rem 0.75rem;
}

.my-toolbar button {
  border-radius: 9999px;
  color: #cbd5e1;
}

/* Highlight the active mode / view toggle */
.my-toolbar button[aria-pressed="true"] {
  background: #6d28d9;
  color: #fff;
}

.my-toolbar button:hover {
  background: #1e293b;
}
```

You can also **replace the toolbar contents entirely** by passing children —
the shared state is still available through `useContentEditorContext`, so you
can wire your own buttons:

```tsx
import { useContentEditorContext, ContentEditorToolbar } from "react-html-content-editor";

function ModeSwitch() {
  const { mode, setMode } = useContentEditorContext();
  return (
    <div className='segmented'>
      <button data-active={mode === "code"} onClick={() => setMode("code")}>
        Code
      </button>
      <button data-active={mode === "wysiwyg"} onClick={() => setMode("wysiwyg")}>
        Visual
      </button>
    </div>
  );
}

<ContentEditorToolbar className='my-toolbar'>
  <ModeSwitch />
</ContentEditorToolbar>;
```

> When you pass children, only the left group is replaced — the built-in
> format/save actions on the right are hidden so you have full control.

## Keyboard Shortcuts

### Editor Shortcuts

With `MonacoCodeEditor`, all Monaco shortcuts are available:

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

⚠️ **XSS Prevention**: The preview pane and the WYSIWYG surface both render the HTML you pass in as real DOM (`dangerouslySetInnerHTML` / `contentEditable`). The library does **not** sanitize it. If the HTML can come from someone other than the person looking at the screen — stored content, an API, another user — sanitize it before passing it in, and sanitize again on the server before storing or re-serving it.

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

The library requires modern browser features and does not support IE11.

## License

MIT © [Adriano Maringolo](https://github.com/adrianomaringolo)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and contribution guidelines.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.
