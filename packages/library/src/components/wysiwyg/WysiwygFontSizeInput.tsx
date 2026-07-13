import React, { useEffect, useRef, useState } from "react";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";

/** A numeric input that sets an exact font size (in px) on the selection. */
export interface WysiwygFontSizeInputProps {
  className?: string;
  title?: string;
  /** Minimum px value (default: 1). */
  min?: number;
  /** Maximum px value (default: 400). */
  max?: number;
}

/**
 * Type an exact font size in pixels and apply it to the current selection.
 *
 * `execCommand("fontSize")` only accepts the legacy 1–7 scale, so this applies
 * `fontSize=7` as a transient marker (with `styleWithCSS` off, producing
 * `<font size="7">`) and rewrites those elements to
 * `<span style="font-size: Npx">`. For the preset 1–7 scale instead, use
 * {@link WysiwygFontSize}.
 */
export const WysiwygFontSizeInput: React.FC<WysiwygFontSizeInputProps> = ({
  className = "",
  title = "Font size (px)",
  min = 1,
  max = 400,
}) => {
  const { editorRef, exec, commit, version, disabled } = useWysiwygContext();
  const [px, setPx] = useState("");
  const lastRange = useRef<Range | null>(null);

  // Track the latest in-editor selection (so we can restore it after the input
  // takes focus) and reflect its rendered font size in the field.
  useEffect(() => {
    const root = editorRef.current;
    const sel = document.getSelection();
    if (!root || !sel || sel.rangeCount === 0) return;
    if (!root.contains(sel.anchorNode)) return;
    lastRange.current = sel.getRangeAt(0).cloneRange();

    const node = sel.anchorNode;
    const el = node instanceof HTMLElement ? node : node?.parentElement;
    if (el && root.contains(el)) {
      const size = parseInt(window.getComputedStyle(el).fontSize, 10);
      if (Number.isFinite(size)) setPx(String(size));
    }
  }, [version, editorRef]);

  const apply = () => {
    const root = editorRef.current;
    const size = parseInt(px, 10);
    if (!root || !Number.isFinite(size) || size < min || size > max) return;

    // Restore the editor selection that was active before focusing the input.
    const sel = document.getSelection();
    if (sel && lastRange.current) {
      sel.removeAllRanges();
      sel.addRange(lastRange.current);
    }

    // Mark the selection with a legacy <font size="7"> then rewrite to px.
    exec("fontSize", "7", false);
    const marked = root.querySelectorAll('font[size="7"]');
    marked.forEach((font) => {
      const span = document.createElement("span");
      span.style.fontSize = `${size}px`;
      while (font.firstChild) span.appendChild(font.firstChild);
      font.replaceWith(span);
    });
    if (marked.length > 0) commit(root.innerHTML);
  };

  return (
    <span className={`${styles.fontSizeField} ${className}`.trim()}>
      <input
        type='number'
        min={min}
        max={max}
        value={px}
        disabled={disabled}
        aria-label={title}
        title={title}
        onChange={(e) => setPx(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            apply();
          }
        }}
      />
      <span aria-hidden='true'>px</span>
    </span>
  );
};
