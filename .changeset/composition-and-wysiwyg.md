---
"react-html-content-editor": minor
---

Add a composition API and an integrated WYSIWYG editor.

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
