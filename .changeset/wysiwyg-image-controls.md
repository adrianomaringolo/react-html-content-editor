---
"react-html-content-editor": minor
---

Add two WYSIWYG image controls:

- `WysiwygImage` — insert an image with no server. By default it opens a file
  picker and embeds the file as a base64 data URI; pass `getSrc` to insert by
  URL/link instead.
- `WysiwygImageUpload` — pick a file, upload it via your `upload(file)` handler,
  and insert the returned URL. Disables itself and shows a spinner while
  uploading; supports `onError`.

Both work inside a standalone `Wysiwyg` or a `ContentEditorWysiwyg`.
