---
"react-html-content-editor": minor
---

Add table, task-list and document WYSIWYG controls, and improve link and font-size UX:

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
