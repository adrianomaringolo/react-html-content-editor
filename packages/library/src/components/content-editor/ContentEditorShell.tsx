import { useEffect } from "react";
import { CircleAlert } from "lucide-react";
import { useContentEditorContext } from "./context";
import styles from "../content-editor.module.css";

export interface ContentEditorShellProps {
  className?: string;
  /** Error message displayed below the content. */
  error?: string;
  /** Height of the container (default: "400px"). Number is treated as pixels. */
  height?: string | number;
  children: React.ReactNode;
}

/**
 * Outer container for the composed editor. Renders the bordered surface, an
 * optional error message, and wires the Save / Format keyboard shortcuts to
 * the shared context.
 */
export function ContentEditorShell({
  className = "",
  error,
  height = "400px",
  children,
}: ContentEditorShellProps) {
  const {
    mode,
    showEdit,
    activeEditor,
    onSave,
    hasUnsavedChanges,
    isSaving,
    formatHtml,
    formatCss,
  } = useContentEditorContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlOrCmd && e.key === "s") {
        e.preventDefault();
        if (onSave && hasUnsavedChanges && !isSaving) onSave();
      }

      if (ctrlOrCmd && e.shiftKey && e.key === "F") {
        e.preventDefault();
        if (mode === "code" && showEdit) {
          if (activeEditor === "html") formatHtml();
          else formatCss();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    mode,
    showEdit,
    activeEditor,
    onSave,
    hasUnsavedChanges,
    isSaving,
    formatHtml,
    formatCss,
  ]);

  const containerStyle = {
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={`${styles.editorContainer} ${className} ${
        error ? styles.hasError : ""
      }`.trim()}
      style={containerStyle}
    >
      {children}
      {error && (
        <div className={styles.errorMessage} role='alert'>
          <CircleAlert
            size={16}
            className={styles.errorIcon}
            aria-hidden='true'
          />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
