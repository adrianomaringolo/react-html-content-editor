---
"react-html-content-editor": minor
---

Add more WYSIWYG controls:

- `WysiwygEmoji` / `WysiwygSpecialChar` — pickers that insert an emoji or a
  special character.
- `WysiwygClearColor` — reset the text color to the inherited default.
- `WysiwygLinkEditor` — place inside the editor; when the caret is in a link, a
  floating bar lets you open, edit (change URL) or remove it.
- `WysiwygFullscreen` — toggle fullscreen for the standalone editor.

Also exposes `rootRef` on the Wysiwyg context.
