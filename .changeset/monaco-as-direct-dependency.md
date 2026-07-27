---
"react-html-content-editor": minor
---

Ship Monaco as a transitive dependency

`@monaco-editor/react` and `monaco-editor` moved from `peerDependencies` to
`dependencies`. Consuming projects no longer need to install them directly —
they are pulled in automatically with the library. `react`, `react-dom` and
`lucide-react` remain peer dependencies.

Both packages are still marked `external` in the bundle, so Monaco is not
duplicated into the published output.
