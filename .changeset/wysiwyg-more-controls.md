---
"react-html-content-editor": minor
---

Add a batch of WYSIWYG controls and a reusable dropdown primitive:

- **`WysiwygDropdown`** — reusable popover/trigger primitive (now powering the
  grouped controls, incl. a refactored `WysiwygAlignMenu`).
- **Inline:** `WysiwygSubscript`, `WysiwygSuperscript`, `WysiwygInlineCode`.
- **Block:** `WysiwygCodeBlock`, `WysiwygHorizontalRule`, `WysiwygIndent`,
  `WysiwygOutdent`, and `WysiwygHeadingMenu` (H1–H6 + paragraph in one dropdown).
- **Color / font:** `WysiwygTextColor`, `WysiwygHighlight` (swatch pickers),
  `WysiwygFontFamily` (dropdown).
- **`WysiwygFontSizeInput`** — numeric input to type an exact font size in px.
- **`WysiwygWordCount`** — read-only word/character counter.
