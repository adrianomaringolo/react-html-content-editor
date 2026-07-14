import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  BetweenHorizontalStart,
  BetweenHorizontalEnd,
  BetweenVerticalStart,
  BetweenVerticalEnd,
  Rows3,
  Columns3,
  Trash2,
} from "lucide-react";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";

/** Contextual editor for a table already in the content. */
export interface WysiwygTableEditorProps {
  className?: string;
}

/**
 * Place inside `<Wysiwyg>` (or `<ContentEditorWysiwyg>`). When the caret is in
 * a table cell, a floating bar appears above the table with actions to insert
 * or delete rows and columns, or delete the whole table. The bar is rendered
 * in a body portal and anchored to the table in page coordinates.
 *
 * Pair with {@link WysiwygTable}, which inserts tables from the toolbar.
 */
export const WysiwygTableEditor: React.FC<WysiwygTableEditorProps> = ({
  className = "",
}) => {
  const { editorRef, commit, version, disabled } = useWysiwygContext();
  const [cell, setCell] = useState<HTMLTableCellElement | null>(null);
  const [rect, setRect] = useState<{ top: number; left: number } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const closestCell = useCallback(
    (node: Node | null): HTMLTableCellElement | null => {
      const root = editorRef.current;
      let el: HTMLElement | null =
        node instanceof HTMLElement ? node : (node?.parentElement ?? null);
      while (el && el !== root) {
        if (el.tagName === "TD" || el.tagName === "TH") {
          return el as HTMLTableCellElement;
        }
        el = el.parentElement;
      }
      return null;
    },
    [editorRef],
  );

  const reposition = useCallback((c: HTMLTableCellElement) => {
    const table = c.closest("table");
    if (!table) return;
    const r = table.getBoundingClientRect();
    setRect({ top: r.top + window.scrollY, left: r.left + window.scrollX });
  }, []);

  // Detect the table cell under the caret whenever the selection changes.
  useEffect(() => {
    if (disabled) {
      setCell(null);
      return;
    }
    const root = editorRef.current;
    const sel = document.getSelection();
    if (
      !root ||
      !sel ||
      sel.rangeCount === 0 ||
      !root.contains(sel.anchorNode)
    ) {
      setCell(null);
      return;
    }
    const c = closestCell(sel.anchorNode);
    if (c) {
      setCell(c);
      reposition(c);
    } else {
      setCell(null);
    }
  }, [version, editorRef, disabled, closestCell, reposition]);

  // Keep positioned + close on Escape / outside click while a table is active.
  useEffect(() => {
    if (!cell) return;
    const keepPositioned = () => {
      if (!editorRef.current?.contains(cell)) setCell(null);
      else reposition(cell);
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (barRef.current?.contains(t)) return;
      if (t && editorRef.current?.contains(t)) return; // selection handler decides
      setCell(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCell(null);
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
  }, [cell, editorRef, reposition]);

  if (!cell || !rect || disabled) return null;

  const flush = () => {
    const root = editorRef.current;
    if (root) commit(root.innerHTML);
  };

  const newCell = (tag: string) => {
    const el = document.createElement(tag);
    el.innerHTML = "<br>";
    return el;
  };

  const insertRow = (below: boolean) => {
    const row = cell.closest("tr");
    if (!row) return;
    const tr = document.createElement("tr");
    for (const c of Array.from(row.cells)) {
      tr.appendChild(newCell(c.tagName === "TH" ? "th" : "td"));
    }
    if (below) row.after(tr);
    else row.before(tr);
    flush();
    reposition(cell);
  };

  const insertColumn = (right: boolean) => {
    const table = cell.closest("table");
    if (!table) return;
    const at = cell.cellIndex + (right ? 1 : 0);
    for (const row of Array.from(table.rows)) {
      const sample = row.cells[Math.min(cell.cellIndex, row.cells.length - 1)];
      const tag = sample?.tagName === "TH" ? "th" : "td";
      row.insertBefore(newCell(tag), row.cells[at] ?? null);
    }
    flush();
    reposition(cell);
  };

  const deleteRow = () => {
    const table = cell.closest("table");
    const row = cell.closest("tr");
    if (!table || !row) return;
    row.remove();
    if (table.rows.length === 0) table.remove();
    setCell(null);
    flush();
  };

  const deleteColumn = () => {
    const table = cell.closest("table");
    if (!table) return;
    const idx = cell.cellIndex;
    for (const row of Array.from(table.rows)) row.cells[idx]?.remove();
    if (!table.rows[0] || table.rows[0].cells.length === 0) table.remove();
    setCell(null);
    flush();
  };

  const deleteTable = () => {
    cell.closest("table")?.remove();
    setCell(null);
    flush();
  };

  const action = (
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
  ) => (
    <button
      type='button'
      className={styles.imageResizerButton}
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {icon}
    </button>
  );

  const bar = (
    <div
      ref={barRef}
      className={`${styles.imageResizer} ${className}`.trim()}
      style={{ top: rect.top, left: rect.left }}
      role='toolbar'
      aria-label='Edit table'
    >
      {action(
        "Insert row above",
        <BetweenHorizontalStart size={14} aria-hidden='true' />,
        () => insertRow(false),
      )}
      {action(
        "Insert row below",
        <BetweenHorizontalEnd size={14} aria-hidden='true' />,
        () => insertRow(true),
      )}
      {action("Delete row", <Rows3 size={14} aria-hidden='true' />, deleteRow)}
      <span className={styles.imageResizerDivider} aria-hidden='true' />
      {action(
        "Insert column left",
        <BetweenVerticalStart size={14} aria-hidden='true' />,
        () => insertColumn(false),
      )}
      {action(
        "Insert column right",
        <BetweenVerticalEnd size={14} aria-hidden='true' />,
        () => insertColumn(true),
      )}
      {action(
        "Delete column",
        <Columns3 size={14} aria-hidden='true' />,
        deleteColumn,
      )}
      <span className={styles.imageResizerDivider} aria-hidden='true' />
      {action(
        "Delete table",
        <Trash2 size={14} aria-hidden='true' />,
        deleteTable,
      )}
    </div>
  );

  return createPortal(bar, document.body);
};
