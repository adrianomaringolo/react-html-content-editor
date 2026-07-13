import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, SquarePen, Unlink } from "lucide-react";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";

/** Contextual editor for links already in the content. */
export interface WysiwygLinkEditorProps {
  className?: string;
  /**
   * Resolve the new URL when editing (defaults to `window.prompt`, pre-filled
   * with the current href). Return `null` to cancel.
   */
  getUrl?: (current: string) => string | null;
}

/**
 * Place inside `<Wysiwyg>` (or `<ContentEditorWysiwyg>`). When the caret is
 * inside a link, a floating bar appears next to it with actions to open, edit
 * (change the URL) or remove the link. The bar is rendered in a body portal
 * and anchored to the link in page coordinates.
 */
export const WysiwygLinkEditor: React.FC<WysiwygLinkEditorProps> = ({
  className = "",
  getUrl,
}) => {
  const { editorRef, commit, version, disabled } = useWysiwygContext();
  const [active, setActive] = useState<HTMLAnchorElement | null>(null);
  const [rect, setRect] = useState<{ top: number; left: number } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const closestAnchor = useCallback(
    (node: Node | null): HTMLAnchorElement | null => {
      const root = editorRef.current;
      let el: HTMLElement | null =
        node instanceof HTMLElement ? node : (node?.parentElement ?? null);
      while (el && el !== root) {
        if (el.tagName === "A") return el as HTMLAnchorElement;
        el = el.parentElement;
      }
      return null;
    },
    [editorRef],
  );

  const reposition = useCallback((a: HTMLAnchorElement) => {
    const r = a.getBoundingClientRect();
    setRect({ top: r.top + window.scrollY, left: r.left + window.scrollX });
  }, []);

  // Detect the link under the caret whenever the selection changes.
  useEffect(() => {
    if (disabled) {
      setActive(null);
      return;
    }
    const root = editorRef.current;
    const sel = document.getSelection();
    if (!root || !sel || sel.rangeCount === 0 || !root.contains(sel.anchorNode)) {
      setActive(null);
      return;
    }
    const a = closestAnchor(sel.anchorNode);
    if (a) {
      setActive(a);
      reposition(a);
    } else {
      setActive(null);
    }
  }, [version, editorRef, disabled, closestAnchor, reposition]);

  // Keep positioned + close on Escape / outside click while a link is active.
  useEffect(() => {
    if (!active) return;
    const keepPositioned = () => {
      if (!editorRef.current?.contains(active)) setActive(null);
      else reposition(active);
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (barRef.current?.contains(t)) return;
      if (t && editorRef.current?.contains(t)) return; // selection handler decides
      setActive(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("scroll", keepPositioned, true);
    window.addEventListener("resize", keepPositioned);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", keepPositioned, true);
      window.removeEventListener("resize", keepPositioned);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [active, editorRef, reposition]);

  if (!active || !rect || disabled) return null;

  const href = active.getAttribute("href") ?? "";

  const edit = () => {
    const next = getUrl
      ? getUrl(href)
      : window.prompt("Edit the link URL", href);
    const root = editorRef.current;
    if (next == null || !root) return;
    active.setAttribute("href", next);
    commit(root.innerHTML);
  };

  const remove = () => {
    const root = editorRef.current;
    const parent = active.parentNode;
    if (!root || !parent) return;
    while (active.firstChild) parent.insertBefore(active.firstChild, active);
    parent.removeChild(active);
    setActive(null);
    commit(root.innerHTML);
  };

  const bar = (
    <div
      ref={barRef}
      className={`${styles.imageResizer} ${className}`.trim()}
      style={{ top: rect.top, left: rect.left }}
      role='toolbar'
      aria-label='Edit link'
    >
      <a
        className={styles.linkEditorUrl}
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        title={href}
      >
        {href || "(empty)"}
      </a>
      <span className={styles.imageResizerDivider} aria-hidden='true' />
      <a
        className={styles.imageResizerButton}
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        title='Open link'
        aria-label='Open link'
      >
        <ExternalLink size={14} aria-hidden='true' />
      </a>
      <button
        type='button'
        className={styles.imageResizerButton}
        title='Edit link'
        aria-label='Edit link URL'
        onMouseDown={(e) => e.preventDefault()}
        onClick={edit}
      >
        <SquarePen size={14} aria-hidden='true' />
      </button>
      <button
        type='button'
        className={styles.imageResizerButton}
        title='Remove link'
        aria-label='Remove link'
        onMouseDown={(e) => e.preventDefault()}
        onClick={remove}
      >
        <Unlink size={14} aria-hidden='true' />
      </button>
    </div>
  );

  return createPortal(bar, document.body);
};
