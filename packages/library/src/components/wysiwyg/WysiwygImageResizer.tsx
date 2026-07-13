import React, { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";

/** A size preset for {@link WysiwygImageResizer}. */
export interface WysiwygImageSizeOption {
  /** Short button label, e.g. `"S"`, `"M"`, `"L"`. */
  label: string;
  /** CSS width applied to the image, e.g. `"25%"`, `"320px"`. */
  width: string;
  /** Optional tooltip / accessible label. */
  title?: string;
}

export interface WysiwygImageResizerProps {
  /**
   * Size presets shown in the floating bar. Defaults to
   * S = 25%, M = 50%, L = 100%.
   */
  options?: WysiwygImageSizeOption[];
  /** Show the "reset to original size" button (default: `true`). */
  showReset?: boolean;
  /** Tooltip for the reset button. */
  resetTitle?: string;
  className?: string;
}

const DEFAULT_OPTIONS: WysiwygImageSizeOption[] = [
  { label: "S", width: "25%", title: "Small (25%)" },
  { label: "M", width: "50%", title: "Medium (50%)" },
  { label: "L", width: "100%", title: "Large (100%)" },
];

/**
 * Click an image inside the editor to reveal a floating bar with size presets.
 * Selecting a preset sets the image's `width` (height stays `auto` to preserve
 * the aspect ratio); the reset button clears the sizing to restore the natural
 * size. Changes are persisted into the editor value.
 *
 * Place it anywhere inside `<Wysiwyg>` (or `<ContentEditorWysiwyg>`):
 * ```tsx
 * <Wysiwyg value={html} onChange={setHtml}>
 *   <WysiwygToolbar>…</WysiwygToolbar>
 *   <WysiwygContent />
 *   <WysiwygImageResizer />
 * </Wysiwyg>
 * ```
 */
export const WysiwygImageResizer: React.FC<WysiwygImageResizerProps> = ({
  options = DEFAULT_OPTIONS,
  showReset = true,
  resetTitle = "Original size",
  className = "",
}) => {
  const { editorRef, commit, disabled } = useWysiwygContext();
  const [active, setActive] = useState<HTMLImageElement | null>(null);
  const [rect, setRect] = useState<{ top: number; left: number } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const reposition = useCallback((img: HTMLImageElement) => {
    const r = img.getBoundingClientRect();
    setRect({ top: r.top, left: r.left });
  }, []);

  const clear = useCallback(() => {
    setActive(null);
    setRect(null);
  }, []);

  // Select an image when it's clicked inside the editor.
  useEffect(() => {
    const el = editorRef.current;
    if (!el || disabled) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === "IMG" && el.contains(target)) {
        const img = target as HTMLImageElement;
        setActive(img);
        reposition(img);
      }
    };

    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [editorRef, disabled, reposition]);

  // While an image is selected: keep the bar positioned, and deselect on
  // outside clicks, Escape, or typing.
  useEffect(() => {
    if (!active) return;

    const keepPositioned = () => {
      const el = editorRef.current;
      if (!el || !el.contains(active)) {
        clear();
        return;
      }
      reposition(active);
    };

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (barRef.current?.contains(target)) return; // clicking the bar
      if (target.tagName === "IMG" && editorRef.current?.contains(target))
        return; // switching to another image (click handler will re-select)
      clear();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clear();
    };

    window.addEventListener("scroll", keepPositioned, true);
    window.addEventListener("resize", keepPositioned);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    editorRef.current?.addEventListener("input", clear);

    return () => {
      window.removeEventListener("scroll", keepPositioned, true);
      window.removeEventListener("resize", keepPositioned);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
      editorRef.current?.removeEventListener("input", clear);
    };
  }, [active, editorRef, reposition, clear]);

  const applyWidth = (width: string | null) => {
    const img = active;
    const el = editorRef.current;
    if (!img || !el) return;

    img.removeAttribute("width");
    img.removeAttribute("height");
    if (width === null) {
      img.style.removeProperty("width");
      img.style.removeProperty("height");
    } else {
      img.style.width = width;
      img.style.height = "auto";
    }

    commit(el.innerHTML);
    // The image may have resized — re-anchor the bar after layout settles.
    requestAnimationFrame(() => reposition(img));
  };

  if (!active || !rect || disabled) return null;

  return (
    <div
      ref={barRef}
      className={`${styles.imageResizer} ${className}`.trim()}
      style={{ top: rect.top, left: rect.left }}
      role='toolbar'
      aria-label='Image size'
      // Keep the image selection intact when interacting with the bar.
      onMouseDown={(e) => e.preventDefault()}
    >
      {options.map((opt) => (
        <button
          key={opt.label}
          type='button'
          className={styles.imageResizerButton}
          title={opt.title ?? opt.label}
          aria-label={opt.title ?? `Set image width ${opt.width}`}
          onClick={() => applyWidth(opt.width)}
        >
          {opt.label}
        </button>
      ))}
      {showReset && (
        <button
          type='button'
          className={styles.imageResizerButton}
          title={resetTitle}
          aria-label={resetTitle}
          onClick={() => applyWidth(null)}
        >
          <RotateCcw size={14} aria-hidden='true' />
        </button>
      )}
    </div>
  );
};
