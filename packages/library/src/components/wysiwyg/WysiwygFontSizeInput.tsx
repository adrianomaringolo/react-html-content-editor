import React, { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
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
  /** Amount the −/+ buttons change the size by (default: 1). */
  step?: number;
}

/** The `span[style*=font-size]` enclosing a range, within the editor. */
function enclosingSizedSpan(
  range: Range,
  root: HTMLElement,
): HTMLSpanElement | null {
  const node = range.commonAncestorContainer;
  let el: HTMLElement | null =
    node instanceof HTMLElement ? node : (node.parentElement ?? null);
  while (el && el !== root) {
    if (el.tagName === "SPAN" && el.style.fontSize) {
      return el as HTMLSpanElement;
    }
    el = el.parentElement;
  }
  return null;
}

/**
 * Set an exact font size in pixels on the current selection, with −/+ steppers
 * and a numeric field. Changes apply live as you type or step.
 *
 * The size is applied by wrapping the selection in a `<span style="font-size">`
 * directly (so the input keeps focus); adjusting a selection that is already a
 * single sized span updates that span in place rather than nesting a new one.
 * For the preset 1–7 scale instead, use {@link WysiwygFontSize}.
 */
export const WysiwygFontSizeInput: React.FC<WysiwygFontSizeInputProps> = ({
  className = "",
  title = "Font size (px)",
  min = 1,
  max = 400,
  step = 1,
}) => {
  const { editorRef, commit, version, disabled } = useWysiwygContext();
  const [px, setPx] = useState("");
  const lastRange = useRef<Range | null>(null);

  // Track the latest in-editor selection (so we can apply after the input takes
  // focus) and reflect its rendered font size in the field.
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

  const applySize = (size: number) => {
    const root = editorRef.current;
    if (!root || !Number.isFinite(size) || size < min || size > max) return;
    const range = lastRange.current;
    if (!range || range.collapsed) return;

    // Re-size an existing span in place when the selection is exactly that span.
    const span = enclosingSizedSpan(range, root);
    if (span && range.toString() === span.textContent) {
      span.style.fontSize = `${size}px`;
      commit(root.innerHTML);
      return;
    }

    // Otherwise wrap the selection in a new span (no execCommand, so the input
    // keeps focus and the change is reflected immediately).
    const wrapper = document.createElement("span");
    wrapper.style.fontSize = `${size}px`;
    try {
      range.surroundContents(wrapper);
    } catch {
      // The range crosses element boundaries; extract and re-insert instead.
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
    }
    const next = document.createRange();
    next.selectNodeContents(wrapper);
    lastRange.current = next.cloneRange();
    commit(root.innerHTML);
  };

  const stepBy = (delta: number) => {
    const parsed = parseInt(px, 10);
    const current = Number.isFinite(parsed) ? parsed : 16;
    const size = Math.min(max, Math.max(min, current + delta));
    setPx(String(size));
    applySize(size);
  };

  return (
    <span className={`${styles.fontSizeField} ${className}`.trim()}>
      <button
        type='button'
        className={styles.fontSizeButton}
        title='Decrease font size'
        aria-label='Decrease font size'
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => stepBy(-step)}
      >
        <Minus size={13} aria-hidden='true' />
      </button>
      <input
        type='number'
        min={min}
        max={max}
        value={px}
        disabled={disabled}
        aria-label={title}
        title={title}
        onChange={(e) => {
          const value = e.target.value;
          setPx(value);
          const size = parseInt(value, 10);
          if (Number.isFinite(size)) applySize(size);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            applySize(parseInt(px, 10));
          }
        }}
      />
      <span aria-hidden='true'>px</span>
      <button
        type='button'
        className={styles.fontSizeButton}
        title='Increase font size'
        aria-label='Increase font size'
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => stepBy(step)}
      >
        <Plus size={13} aria-hidden='true' />
      </button>
    </span>
  );
};
