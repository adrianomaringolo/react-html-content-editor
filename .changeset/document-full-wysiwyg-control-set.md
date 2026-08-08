---
"react-html-content-editor": patch
---

Document the full WYSIWYG API

The README covered a handful of WYSIWYG controls while the package exported
around sixty, and never documented the standalone `Wysiwyg` editor at all. It
now has a dedicated **WYSIWYG editor** section: standalone usage with `Wysiwyg`,
`WysiwygContent` and `WysiwygToolbar` props, and a grouped control reference
(history, blocks, inline, lists, tables, documents, alignment, links, images,
utilities) listing every control with its extra props and defaults — tables,
task lists, callouts, table of contents, find & replace, print, export,
`htmlToMarkdown`, case transform, line height and letter spacing among them.

Also added: a `useWysiwygContext()` member table including `version` and
`rootRef`, a hooks-and-primitives table, complete type exports, a table of
contents, and `ContentEditorProvider` / `ContentEditorShell` in the composition
table. `llms.txt` gained the same controls and a corrected export list, and its
note that `WysiwygLink` falls back to `window.prompt` was fixed — it opens a
built-in URL popover.

Package metadata: the empty `author` field is now filled in, and the `LICENSE`
copyright line names its holder.

Branding: the cover image still sold the library as a "Monaco-powered HTML/CSS
editor" with a "Monaco" chip, which 2.0.0 made wrong — Monaco is optional and no
longer the default. `assets/cover.svg` now reads "HTML/CSS editor with live
preview and integrated WYSIWYG mode" with a "Monaco optional" chip, and
`cover.png` was re-rendered from it. The docs site's `og:description` carried
the same stale claim and was corrected.

Docs, assets and metadata only; no runtime change.
