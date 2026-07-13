import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RotateCcw, Check } from "lucide-react";
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
  /** Show the pixel-width input (default: `true`). */
  showPixelInput?: boolean;
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
 * Click an image inside the editor to reveal a floating bar with size presets
 * and a pixel-width input. Presets set the image `width` (height stays `auto`
 * to preserve the aspect ratio); the reset button clears the sizing to restore
 * the natural size. Changes are persisted into the editor value.
 *
 * The bar is rendered in a portal on `document.body` and positioned in page
 * coordinates, so it stays anchored to the image regardless of ancestor
 * `transform`/`overflow`.
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
  showPixelInput = true,
  resetTitle = "Original size",
  className = "",
}) => {
  const { editorRef, commit, disabled } = useWysiwygContext();
  const [active, setActive] = useState<HTMLImageElement | null>(null);
  const [rect, setRect] = useState<{ top: number; left: number } | null>(null);
  const [pixels, setPixels] = useState("");
  const barRef = useRef<HTMLDivElement>(null);

  // Position in *page* coordinates (viewport rect + scroll offset) so an
  // absolutely-positioned, body-portaled bar tracks the image correctly.
  const reposition = useCallback((img: HTMLImageElement) => {
    const r = img.getBoundingClientRect();
    setRect({ top: r.top + window.scrollY, left: r.left + window.scrollX });
  }, []);

  const select = useCallback(
    (img: HTMLImageElement) => {
      setActive(img);
      reposition(img);
      setPixels(String(Math.round(img.getBoundingClientRect().width)));
    },
    [reposition],
  );

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
        select(target as HTMLImageElement);
      }
    };
    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [editorRef, disabled, select]);

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
        return; // switching to another image (click handler re-selects)
      clear();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clear();
    };

    const editorEl = editorRef.current;
    window.addEventListener("scroll", keepPositioned, true);
    window.addEventListener("resize", keepPositioned);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    editorEl?.addEventListener("input", clear);

    return () => {
      window.removeEventListener("scroll", keepPositioned, true);
      window.removeEventListener("resize", keepPositioned);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
      editorEl?.removeEventListener("input", clear);
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
    // The image may have resized — re-anchor the bar and refresh the input.
    requestAnimationFrame(() => {
      reposition(img);
      setPixels(String(Math.round(img.getBoundingClientRect().width)));
    });
  };

  const applyPixels = () => {
    const n = parseInt(pixels, 10);
    if (Number.isFinite(n) && n > 0) applyWidth(`${n}px`);
  };

  if (!active || !rect || disabled) return null;

  const bar = (
    <div
      ref={barRef}
      className={`${styles.imageResizer} ${className}`.trim()}
      style={{ top: rect.top, left: rect.left }}
      role='toolbar'
      aria-label='Image size'
    >
      {options.map((opt) => (
        <button
          key={opt.label}
          type='button'
          className={styles.imageResizerButton}
          title={opt.title ?? opt.label}
          aria-label={opt.title ?? `Set image width ${opt.width}`}
          onMouseDown={(e) => e.preventDefault()}
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
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyWidth(null)}
        >
          <RotateCcw size={14} aria-hidden='true' />
        </button>
      )}
      {showPixelInput && (
        <>
          <span className={styles.imageResizerDivider} aria-hidden='true' />
          <input
            type='number'
            min={1}
            className={styles.imageResizerInput}
            value={pixels}
            aria-label='Width in pixels'
            title='Width in pixels'
            onChange={(e) => setPixels(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyPixels();
              }
            }}
          />
          <span className={styles.imageResizerUnit} aria-hidden='true'>
            px
          </span>
          <button
            type='button'
            className={styles.imageResizerButton}
            title='Apply width'
            aria-label='Apply pixel width'
            onMouseDown={(e) => e.preventDefault()}
            onClick={applyPixels}
          >
            <Check size={14} aria-hidden='true' />
          </button>
        </>
      )}
    </div>
  );

  return createPortal(bar, document.body);
};
