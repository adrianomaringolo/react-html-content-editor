import { MonacoEditorWrapper } from "../MonacoEditorWrapper";
import { useContentEditorContext } from "./context";
import styles from "../content-editor.module.css";

export interface ContentEditorCodeProps {
  className?: string;
}

/**
 * Code-editing pane: Monaco editors for the HTML and CSS content. Renders only
 * in `code` mode while the editors are toggled on. The HTML/CSS editors are
 * kept mounted and swapped via visibility so their state (scroll, undo) is
 * preserved when switching tabs.
 */
export function ContentEditorCode({ className = "" }: ContentEditorCodeProps) {
  const {
    mode,
    showEdit,
    activeEditor,
    value,
    theme,
    htmlEditorOptions,
    cssEditorOptions,
    onHtmlChange,
    onCssChange,
    handleHtmlEditorMount,
    handleCssEditorMount,
  } = useContentEditorContext();

  if (mode !== "code" || !showEdit) return null;

  return (
    <div className={`${styles.splitPane} ${className}`.trim()}>
      <div className={styles.editorWrapper}>
        <div
          className={styles.monacoWrapper}
          style={{ display: activeEditor === "html" ? "flex" : "none" }}
        >
          <MonacoEditorWrapper
            editorKey='compose-html'
            defaultValue={value.html}
            language='html'
            theme={theme}
            options={htmlEditorOptions}
            onChange={(v) => onHtmlChange(v ?? "")}
            onMount={handleHtmlEditorMount}
          />
        </div>

        <div
          className={styles.monacoWrapper}
          style={{ display: activeEditor === "css" ? "flex" : "none" }}
        >
          <MonacoEditorWrapper
            editorKey='compose-css'
            defaultValue={value.css}
            language='css'
            theme={theme}
            options={cssEditorOptions}
            onChange={(v) => onCssChange(v ?? "")}
            onMount={handleCssEditorMount}
          />
        </div>
      </div>
    </div>
  );
}
