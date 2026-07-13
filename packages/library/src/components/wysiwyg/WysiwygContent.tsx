import React, { useEffect } from "react";
import styles from "./wysiwyg.module.css";
import { useWysiwygContext } from "./context";

/** The editable surface. Renders a `contentEditable` region bound to the value. */
export interface WysiwygContentProps {
  /** Placeholder shown when the editor is empty. */
  placeholder?: string;
  /** Minimum height of the editable area (default: "240px"). */
  minHeight?: string | number;
  className?: string;
  "aria-label"?: string;
}

export const WysiwygContent: React.FC<WysiwygContentProps> = ({
  placeholder = "Start writing…",
  minHeight = "240px",
  className = "",
  "aria-label": ariaLabel = "Rich text editor",
}) => {
  const { editorRef, lastHtmlRef, value, commit, disabled } =
    useWysiwygContext();

  // Push external value changes into the DOM without clobbering the caret
  // during normal typing (we only write when the value truly diverges).
  useEffect(() => {
    const el = editorRef.current;
    if (el && value !== lastHtmlRef.current) {
      el.innerHTML = value;
      lastHtmlRef.current = value;
    }
  }, [value, editorRef, lastHtmlRef]);

  return (
    <div
      ref={editorRef}
      role='textbox'
      aria-label={ariaLabel}
      aria-multiline='true'
      contentEditable={!disabled}
      suppressContentEditableWarning
      spellCheck
      data-placeholder={placeholder}
      onInput={(e) => commit(e.currentTarget.innerHTML)}
      style={{ minHeight }}
      className={`${styles.content} ${className}`.trim()}
    />
  );
};
