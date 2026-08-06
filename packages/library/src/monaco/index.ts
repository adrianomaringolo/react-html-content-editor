/**
 * Monaco integration for React HTML Content Editor.
 *
 * This entry point is the only place in the library that imports
 * `@monaco-editor/react` / `monaco-editor`. Both are optional peer
 * dependencies: import from `react-html-content-editor/monaco` only after
 * installing them, otherwise stick to the main entry point, which falls back to
 * the dependency-free `TextareaCodeEditor`.
 *
 * @packageDocumentation
 */

export { MonacoCodeEditor } from "./MonacoCodeEditor";
export type {
  CodeEditorComponent,
  CodeEditorHandle,
  CodeEditorProps,
} from "../components/code-editor/types";
