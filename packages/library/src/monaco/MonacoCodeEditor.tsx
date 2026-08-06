import { useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import type {
  CodeEditorHandle,
  CodeEditorProps,
} from "../components/code-editor/types";

/** Wraps a mounted Monaco instance in the library's editor-agnostic handle. */
const createHandle = (
  instance: MonacoEditor.IStandaloneCodeEditor,
): CodeEditorHandle => ({
  focus: () => instance.focus(),
  format: () => {
    instance.getAction("editor.action.formatDocument")?.run();
    return true;
  },
  getScrollTop: () => instance.getScrollTop(),
  getMaxScroll: () =>
    Math.max(0, instance.getScrollHeight() - instance.getLayoutInfo().height),
  setScrollTop: (top) => instance.setScrollTop(top),
  onScroll: (listener) => {
    const disposable = instance.onDidScrollChange(() => listener());
    return () => disposable.dispose();
  },
});

/**
 * Monaco-backed code editor for the {@link ContentEditor}.
 *
 * Requires `@monaco-editor/react` and `monaco-editor` to be installed — they
 * are optional peer dependencies, which is why this component lives in the
 * `react-html-content-editor/monaco` entry point instead of the main one.
 *
 * @example
 * ```tsx
 * import { ContentEditor } from "react-html-content-editor";
 * import { MonacoCodeEditor } from "react-html-content-editor/monaco";
 *
 * <ContentEditor
 *   value={value}
 *   onChange={setValue}
 *   codeEditor={MonacoCodeEditor}
 * />
 * ```
 */
export function MonacoCodeEditor({
  defaultValue,
  language,
  theme,
  options,
  onChange,
  onReady,
  className = "",
  ariaLabel,
}: CodeEditorProps) {
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  // Report teardown so the owning pane drops its stale handle.
  useEffect(() => () => onReadyRef.current?.(null), []);

  return (
    <div
      className={className}
      style={{ flex: 1, minHeight: 0, minWidth: 0 }}
      aria-label={ariaLabel}
    >
      <Editor
        defaultValue={defaultValue}
        language={language}
        theme={theme}
        options={options}
        onChange={(next) => onChange(next ?? "")}
        onMount={(instance) => onReadyRef.current?.(createHandle(instance))}
      />
    </div>
  );
}

MonacoCodeEditor.canFormat = true;
