import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";

/** Reusable toolbar dropdown: a trigger button that toggles a popover. */
export interface WysiwygDropdownProps {
  /** Accessible label / tooltip for the trigger and popover. */
  title: string;
  /** Content rendered inside the trigger button (usually an icon). */
  trigger: React.ReactNode;
  /** Override the trigger's aria-label (defaults to `title`). */
  triggerAriaLabel?: string;
  /** Extra `data-*` attributes for the trigger (e.g. `{ align: "left" }`). */
  triggerData?: Record<string, string>;
  /** Apply the "active" trigger styling regardless of open state. */
  active?: boolean;
  /** Close the popover after a click inside it (default: `true`). */
  closeOnSelect?: boolean;
  className?: string;
  /** Popover content. */
  children: React.ReactNode;
}

/**
 * The building block behind the grouped controls (alignment, headings, text
 * color, font family, …). Handles open/close, outside-click and Escape, and
 * disables itself when the editor is read-only.
 *
 * The popover is rendered in a body portal and positioned next to the trigger,
 * so it is never clipped by the editor container (which hides overflow); it
 * also flips to stay within the viewport near an edge.
 */
export const WysiwygDropdown: React.FC<WysiwygDropdownProps> = ({
  title,
  trigger,
  triggerAriaLabel,
  triggerData,
  active = false,
  closeOnSelect = true,
  className = "",
  children,
}) => {
  const { disabled } = useWysiwygContext();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const reposition = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const margin = 8;
    const popW = popRef.current?.offsetWidth ?? 0;
    const popH = popRef.current?.offsetHeight ?? 0;

    // Prefer left-aligned; flip to right-aligned when it would overflow right.
    let left = r.left;
    if (popW > 0 && left + popW > window.innerWidth - margin) {
      left = r.right - popW;
    }
    if (left < margin) left = margin;

    // Prefer below; flip above when it would overflow the bottom.
    let top = r.bottom + 4;
    if (popH > 0 && top + popH > window.innerHeight - margin) {
      const above = r.top - popH - 4;
      if (above >= margin) top = above;
    }

    setPos({ top: top + window.scrollY, left: left + window.scrollX });
  }, []);

  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    // The popover is mounted by now, so its size is measurable.
    reposition();
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

  const dataAttrs: Record<string, string> = {};
  if (triggerData) {
    for (const [k, v] of Object.entries(triggerData)) dataAttrs[`data-${k}`] = v;
  }

  return (
    <span className={styles.menu}>
      <button
        ref={btnRef}
        type='button'
        title={title}
        aria-label={triggerAriaLabel ?? title}
        aria-haspopup='true'
        aria-expanded={open}
        disabled={disabled}
        {...dataAttrs}
        // Keep the editor selection intact when opening the menu.
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        className={`${styles.control} ${open || active ? styles.controlActive : ""} ${className}`.trim()}
      >
        {trigger}
      </button>
      {open &&
        createPortal(
          <div
            ref={popRef}
            className={styles.menuPopover}
            role='menu'
            aria-label={title}
            style={{
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              visibility: pos ? "visible" : "hidden",
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={closeOnSelect ? () => setOpen(false) : undefined}
          >
            {children}
          </div>,
          document.body,
        )}
    </span>
  );
};
