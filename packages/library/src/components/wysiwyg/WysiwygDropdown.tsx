import React, { useEffect, useRef, useState } from "react";
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
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const dataAttrs: Record<string, string> = {};
  if (triggerData) {
    for (const [k, v] of Object.entries(triggerData)) dataAttrs[`data-${k}`] = v;
  }

  return (
    <span ref={wrapRef} className={styles.menu}>
      <button
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
      {open && (
        <div
          className={styles.menuPopover}
          role='menu'
          aria-label={title}
          onMouseDown={(e) => e.preventDefault()}
          onClick={closeOnSelect ? () => setOpen(false) : undefined}
        >
          {children}
        </div>
      )}
    </span>
  );
};
