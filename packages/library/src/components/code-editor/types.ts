import type { ComponentType } from "react";

/**
 * Imperative handle exposed by a code editor implementation once it is
 * mounted. The editor panes use it for the Format action and for scroll
 * synchronization with the preview.
 *
 * All members are optional in behaviour, not in presence: an implementation
 * that cannot format still provides `format()` (returning `false`).
 */
export interface CodeEditorHandle {
  /** Move keyboard focus into the editing surface. */
  focus(): void;

  /**
   * Reformat the whole document.
   *
   * @returns `true` when the implementation performed a format, `false` when
   * formatting is not supported (e.g. the plain textarea editor).
   */
  format(): boolean;

  /** Current vertical scroll offset, in pixels. */
  getScrollTop(): number;

  /** Maximum vertical scroll offset, in pixels (`0` when content fits). */
  getMaxScroll(): number;

  /** Scroll to the given vertical offset, in pixels. */
  setScrollTop(top: number): void;

  /**
   * Subscribe to scroll changes.
   *
   * @returns An unsubscribe function.
   */
  onScroll(listener: () => void): () => void;
}

/**
 * Props every code editor implementation receives from the editor panes.
 *
 * The surface is *uncontrolled*: `defaultValue` seeds the initial content and
 * subsequent edits are reported through `onChange`. This mirrors Monaco's own
 * model semantics and keeps typing responsive on large documents.
 */
export interface CodeEditorProps {
  /** Initial content of the editor. */
  defaultValue: string;

  /** Language of the content, used for syntax handling where available. */
  language: "html" | "css";

  /** Theme name, following Monaco's convention (`"vs-dark"` / `"vs-light"`). */
  theme: string;

  /**
   * Implementation-specific options. For the Monaco adapter these are
   * `IStandaloneEditorConstructionOptions`; the textarea editor understands
   * the `fontSize`, `tabSize`, `wordWrap`, `lineNumbers` and `readOnly` subset.
   */
  options?: Record<string, unknown>;

  /** Called whenever the content changes. */
  onChange: (value: string) => void;

  /**
   * Called with the imperative handle when the editor mounts, and with `null`
   * when it unmounts.
   */
  onReady?: (handle: CodeEditorHandle | null) => void;

  /** Additional class name for the editor root element. */
  className?: string;

  /** Accessible label for the editing surface. */
  ariaLabel?: string;
}

/**
 * A pluggable code editor implementation.
 *
 * The library ships {@link TextareaCodeEditor} as the dependency-free default.
 * Install `@monaco-editor/react` and pass `MonacoCodeEditor` from
 * `react-html-content-editor/monaco` to get the full Monaco experience.
 *
 * @example
 * ```tsx
 * import { MonacoCodeEditor } from "react-html-content-editor/monaco";
 *
 * <ContentEditor
 *   value={value}
 *   onChange={setValue}
 *   codeEditor={MonacoCodeEditor}
 * />
 * ```
 */
export type CodeEditorComponent = ComponentType<CodeEditorProps> & {
  /**
   * Whether the implementation can reformat documents. When `false`, the
   * toolbars hide the Format action. Defaults to `true` when omitted.
   */
  canFormat?: boolean;
};
