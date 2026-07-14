import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Replace,
  ReplaceAll,
  X,
} from "lucide-react";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";
import type { NamedControlProps } from "./types";

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface Match {
  node: Text;
  start: number;
  end: number;
}

/** Every occurrence of `find` across the editor's text nodes, in document order. */
function collectMatches(
  root: HTMLElement,
  find: string,
  caseSensitive: boolean,
): Match[] {
  const matches: Match[] = [];
  if (!find) return matches;
  const re = new RegExp(escapeRegExp(find), caseSensitive ? "g" : "gi");
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = (node as Text).data;
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null) {
      matches.push({ node: node as Text, start: m.index, end: m.index + m[0].length });
      if (m.index === re.lastIndex) re.lastIndex++; // guard against empty matches
    }
  }
  return matches;
}

/**
 * Find (and optionally replace) text in the editor.
 *
 * The trigger opens a small panel with find/replace fields. "Find" selects and
 * scrolls to each match in turn; "Replace" swaps the current match and
 * "Replace all" swaps every occurrence. Matching is case-insensitive unless the
 * `Aa` toggle is enabled.
 */
export const WysiwygFindReplace: React.FC<NamedControlProps> = ({
  className,
  title = "Find and replace",
}) => {
  const { editorRef, commit, disabled } = useWysiwygContext();
  const [open, setOpen] = useState(false);
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [count, setCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const findRef = useRef<HTMLInputElement>(null);

  const reposition = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const margin = 8;
    const panelW = panelRef.current?.offsetWidth ?? 0;
    let left = r.left;
    if (panelW > 0 && left + panelW > window.innerWidth - margin) {
      left = r.right - panelW;
    }
    if (left < margin) left = margin;
    setPos({ top: r.bottom + 4 + window.scrollY, left: left + window.scrollX });
  }, []);

  const matches = () =>
    editorRef.current
      ? collectMatches(editorRef.current, find, caseSensitive)
      : [];

  // Keep the match count in sync with the query.
  useEffect(() => {
    if (!open) return;
    const total = matches().length;
    setCount(total);
    setIndex((i) => (total === 0 ? 0 : Math.min(i, total - 1)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [find, caseSensitive, open]);

  // Position, focus, and close on outside click / Escape while open.
  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    reposition();
    findRef.current?.focus();
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || panelRef.current?.contains(t)) return;
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

  const selectMatch = (m: Match) => {
    const sel = document.getSelection();
    if (!sel) return;
    const range = document.createRange();
    range.setStart(m.node, m.start);
    range.setEnd(m.node, m.end);
    sel.removeAllRanges();
    sel.addRange(range);
    m.node.parentElement?.scrollIntoView?.({ block: "nearest" });
  };

  const go = (delta: number) => {
    const all = matches();
    setCount(all.length);
    if (all.length === 0) return;
    const next = (index + delta + all.length) % all.length;
    setIndex(next);
    selectMatch(all[next]);
  };

  const replaceCurrent = () => {
    const root = editorRef.current;
    const all = matches();
    if (!root || all.length === 0) return;
    const i = Math.min(index, all.length - 1);
    const m = all[i];
    m.node.data = m.node.data.slice(0, m.start) + replace + m.node.data.slice(m.end);
    commit(root.innerHTML);
    const remaining = matches();
    setCount(remaining.length);
    if (remaining.length > 0) {
      const next = i % remaining.length;
      setIndex(next);
      selectMatch(remaining[next]);
    } else {
      setIndex(0);
    }
  };

  const replaceAll = () => {
    const root = editorRef.current;
    if (!root || !find) return;
    const re = new RegExp(escapeRegExp(find), caseSensitive ? "g" : "gi");
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    let changed = false;
    while ((node = walker.nextNode())) {
      const text = (node as Text).data;
      const next = text.replace(re, replace);
      if (next !== text) {
        (node as Text).data = next;
        changed = true;
      }
    }
    if (changed) commit(root.innerHTML);
    setCount(0);
    setIndex(0);
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
        onClick={() => setOpen((o) => !o)}
        className={`${styles.control} ${open ? styles.controlActive : ""} ${className ?? ""}`.trim()}
      >
        <Search size={16} aria-hidden='true' />
      </button>
      {open &&
        createPortal(
          <div
            ref={panelRef}
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
              ref={findRef}
              type='text'
              className={styles.findInput}
              placeholder='Find'
              aria-label='Find'
              value={find}
              onChange={(e) => setFind(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  go(e.shiftKey ? -1 : 1);
                }
              }}
            />
            <span className={styles.findCount} aria-live='polite'>
              {count > 0 ? `${index + 1}/${count}` : "0/0"}
            </span>
            <button
              type='button'
              className={`${styles.findToggle} ${caseSensitive ? styles.controlActive : ""}`.trim()}
              title='Match case'
              aria-label='Match case'
              aria-pressed={caseSensitive}
              onClick={() => setCaseSensitive((c) => !c)}
            >
              Aa
            </button>
            <button
              type='button'
              className={styles.findIconButton}
              title='Previous match'
              aria-label='Previous match'
              onClick={() => go(-1)}
            >
              <ChevronUp size={14} aria-hidden='true' />
            </button>
            <button
              type='button'
              className={styles.findIconButton}
              title='Next match'
              aria-label='Next match'
              onClick={() => go(1)}
            >
              <ChevronDown size={14} aria-hidden='true' />
            </button>
            <button
              type='button'
              className={styles.findIconButton}
              title='Close'
              aria-label='Close find and replace'
              onClick={() => setOpen(false)}
            >
              <X size={14} aria-hidden='true' />
            </button>
          </div>
          <div className={styles.findRow}>
            <input
              type='text'
              className={styles.findInput}
              placeholder='Replace with'
              aria-label='Replace with'
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  replaceCurrent();
                }
              }}
            />
            <button
              type='button'
              className={styles.findIconButton}
              title='Replace'
              aria-label='Replace'
              onClick={replaceCurrent}
            >
              <Replace size={14} aria-hidden='true' />
            </button>
            <button
              type='button'
              className={styles.findIconButton}
              title='Replace all'
              aria-label='Replace all'
              onClick={replaceAll}
            >
              <ReplaceAll size={14} aria-hidden='true' />
            </button>
          </div>
        </div>,
          document.body,
        )}
    </span>
  );
};
