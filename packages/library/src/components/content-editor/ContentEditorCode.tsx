import { useContentEditorContext } from "./context";
import styles from "../content-editor.module.css";

export interface ContentEditorCodeProps {
  className?: string;
}

/**
 * Code-editing pane: the HTML and CSS code editors. Renders only in `code` mode
 * while the editors are toggled on. Both editors stay mounted and are swapped
 * via visibility so their state (scroll, undo) survives a tab switch.
 *
 * The editor implementation comes from the `codeEditor` prop on the editor root
 * — the dependency-free `TextareaCodeEditor` by default.
 */
export function ContentEditorCode({ className = "" }: ContentEditorCodeProps) {
  const {
    mode,
    showEdit,
    activeEditor,
    value,
    theme,
    htmlLabel,
    cssLabel,
    htmlEditorOptions,
    cssEditorOptions,
    codeEditor: CodeEditor,
    onHtmlChange,
    onCssChange,
    handleHtmlEditorReady,
    handleCssEditorReady,
  } = useContentEditorContext();

  if (mode !== "code" || !showEdit) return null;

  return (
    <div className={`${styles.splitPane} ${className}`.trim()}>
      <div className={styles.editorWrapper}>
        <div
          className={styles.monacoWrapper}
          style={{ display: activeEditor === "html" ? "flex" : "none" }}
        >
          <CodeEditor
            defaultValue={value.html}
            language='html'
            theme={theme}
            options={htmlEditorOptions}
            ariaLabel={`${htmlLabel} code`}
            onChange={onHtmlChange}
            onReady={handleHtmlEditorReady}
          />
        </div>

        <div
          className={styles.monacoWrapper}
          style={{ display: activeEditor === "css" ? "flex" : "none" }}
        >
          <CodeEditor
            defaultValue={value.css}
            language='css'
            theme={theme}
            options={cssEditorOptions}
            ariaLabel={`${cssLabel} code`}
            onChange={onCssChange}
            onReady={handleCssEditorReady}
          />
        </div>
      </div>
    </div>
  );
}
