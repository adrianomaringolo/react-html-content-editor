import { useContentEditorContext } from "./context";
import styles from "../content-editor.module.css";

export interface ContentEditorBodyProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Layout container for the editor panes. Lays the visible panes out
 * side-by-side (split) on wider viewports and stacked on narrow ones. Place
 * `ContentEditorCode`, `ContentEditorPreview` and `ContentEditorWysiwyg`
 * inside it in any order.
 */
export function ContentEditorBody({
  className = "",
  children,
}: ContentEditorBodyProps) {
  // Touch the context so a helpful error is thrown if used outside the root.
  useContentEditorContext();

  return (
    <div className={styles.editorContent}>
      <div className={`${styles.splitView} ${className}`.trim()}>{children}</div>
    </div>
  );
}
