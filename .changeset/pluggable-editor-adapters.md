---
"react-html-content-editor": patch
---

Document CodeMirror, Ace and hand-rolled `codeEditor` adapters

The "Custom code editors" section of the README now carries complete, working
adapters for CodeMirror 6 and Ace alongside the minimal example, plus the CSS
technique behind a dependency-free highlighted editor. Each one notes what
`canFormat` should be and the implementation quirk that bites first — Ace needs
a `ResizeObserver` and an ambient type reference, CodeMirror wants a
`Compartment` to hot-swap themes, and a controlled `<textarea>` has a weak undo
stack.

Docs and demo only; no runtime change.
