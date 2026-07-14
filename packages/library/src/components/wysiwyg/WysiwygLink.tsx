import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, Check } from "lucide-react";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";
import type { NamedControlProps } from "./types";

const escapeAttr = (s: string) => s.replace(/"/g, "&quot;");
const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Wrap the current selection in a link. */
export interface WysiwygLinkProps extends NamedControlProps {
  /**
   * Resolve the URL yourself instead of showing the built-in popover (e.g. to
   * use your own dialog). Return `null` to cancel. When omitted, a small
   * popover with a URL field is shown.
   */
  getUrl?: () => string | null;
}

/** Find the anchor wrapping a node, within the editor. */
function closestAnchor(
  node: Node | null,
  root: HTMLElement,
): HTMLAnchorElement | null {
  let el: HTMLElement | null =
    node instanceof HTMLElement ? node : (node?.parentElement ?? null);
  while (el && el !== root) {
    if (el.tagName === "A") return el as HTMLAnchorElement;
    el = el.parentElement;
  }
  return null;
}

export const WysiwygLink: React.FC<WysiwygLinkProps> = ({
  className,
  title = "Insert link",
  getUrl,
}) => {
  const { editorRef, exec, disabled } = useWysiwygContext();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastRange = useRef<Range | null>(null);

  const reposition = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const margin = 8;
    const popW = popRef.current?.offsetWidth ?? 0;
    let left = r.left;
    if (popW > 0 && left + popW > window.innerWidth - margin) {
      left = r.right - popW;
    }
    if (left < margin) left = margin;
    setPos({ top: r.bottom + 4 + window.scrollY, left: left + window.scrollX });
  }, []);

  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    reposition();
    inputRef.current?.focus();
    inputRef.current?.select();
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || popRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onReflow = () => reposition();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onReflow, true);
    window.addEventListener("resize", onReflow);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onReflow, true);
      window.removeEventListener("resize", onReflow);
    };
  }, [open, reposition]);

  const openPopover = () => {
    const root = editorRef.current;
    const sel = document.getSelection();
    // Remember the selection so we can restore it after the field takes focus.
    if (root && sel && sel.rangeCount > 0 && root.contains(sel.anchorNode)) {
      lastRange.current = sel.getRangeAt(0).cloneRange();
      const anchor = closestAnchor(sel.anchorNode, root);
      setUrl(anchor?.getAttribute("href") ?? "https://");
    } else {
      lastRange.current = null;
      setUrl("https://");
    }
    setOpen(true);
  };

  const apply = () => {
    const root = editorRef.current;
    const href = url.trim();
    if (!root || !href) {
      setOpen(false);
      return;
    }
    const sel = document.getSelection();
    if (sel && lastRange.current) {
      sel.removeAllRanges();
      sel.addRange(lastRange.current);
    }
    // With text selected, wrap it; with just a caret, insert a linked URL.
    if (lastRange.current && !lastRange.current.collapsed) {
      exec("createLink", href);
    } else {
      exec(
        "insertHTML",
        `<a href="${escapeAttr(href)}">${escapeHtml(href)}</a>`,
      );
    }
    setOpen(false);
  };

  const handleActivate = () => {
    if (getUrl) {
      const resolved = getUrl();
      if (resolved) exec("createLink", resolved);
      return;
    }
    if (open) setOpen(false);
    else openPopover();
  };

  return (
    <span className={styles.menu}>
      <button
        ref={btnRef}
        type='button'
        title={title}
        aria-label={title}
        aria-haspopup='dialog'
        aria-expanded={open}
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleActivate}
        className={`${styles.control} ${open ? styles.controlActive : ""} ${className ?? ""}`.trim()}
      >
        <Link size={16} aria-hidden='true' />
      </button>
      {open &&
        createPortal(
          <div
            ref={popRef}
            className={styles.findPanel}
            role='dialog'
            aria-label={title}
            style={{
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              right: "auto",
              visibility: pos ? "visible" : "hidden",
            }}
          >
            <div className={styles.findRow}>
              <input
                ref={inputRef}
                type='url'
                className={styles.findInput}
                placeholder='https://…'
                aria-label='Link URL'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    apply();
                  }
                }}
              />
              <button
                type='button'
                className={styles.findIconButton}
                title='Apply link'
                aria-label='Apply link'
                onClick={apply}
              >
                <Check size={14} aria-hidden='true' />
              </button>
            </div>
          </div>,
          document.body,
        )}
    </span>
  );
};
