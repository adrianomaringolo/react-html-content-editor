---
"react-html-content-editor": major
---

Make Monaco Editor optional

The code panes no longer require Monaco. By default they render the new built-in
`TextareaCodeEditor`: a plain textarea with a line-number gutter, `Tab` /
`Shift + Tab` indent-outdent, indentation-preserving `Enter`, light/dark palettes
matching Monaco's `vs` / `vs-dark`, and preview scroll sync. No syntax
highlighting, and the Format action is hidden because there is nothing to format
with.

Monaco moves to a dedicated entry point that is the only module importing it, so
projects that never import it never resolve those packages:

```bash
npm install @monaco-editor/react monaco-editor
```

```tsx
import { ContentEditor } from "react-html-content-editor";
import { MonacoCodeEditor } from "react-html-content-editor/monaco";

<ContentEditor value={value} onChange={setValue} codeEditor={MonacoCodeEditor} />;
```

Any component implementing the exported `CodeEditorProps` contract works as
`codeEditor`, so CodeMirror, Ace or a custom surface can be plugged in too.

### Breaking changes

- `@monaco-editor/react` and `monaco-editor` moved from `dependencies` to
  **optional** `peerDependencies`. Install them yourself if you want Monaco;
  editors that relied on them being pulled in transitively must add the two
  packages and pass `codeEditor={MonacoCodeEditor}` to keep the previous look and
  behaviour.
- `MonacoEditorWrapper` was removed. Use `MonacoCodeEditor` from
  `react-html-content-editor/monaco`.
- `useContentEditorContext()` now exposes editor-agnostic handles:
  `handleHtmlEditorMount` / `handleCssEditorMount` became
  `handleHtmlEditorReady` / `handleCssEditorReady` (they receive a
  `CodeEditorHandle | null` instead of a Monaco instance), and `htmlEditorRef` /
  `cssEditorRef` now hold a `CodeEditorHandle`. The context also gained
  `codeEditor` and `canFormat`.
- `useScrollSync` expects a `CodeEditorHandle` instead of a Monaco editor
  instance: `getScrollHeight()` + `getLayoutInfo().height` are replaced by a
  single `getMaxScroll()`.

### Fixed

- Fullscreen split-view scroll sync no longer reads stale state. The scroll
  listener was registered once on editor mount, so toggling sync or switching to
  split view after the editor mounted had no effect.
