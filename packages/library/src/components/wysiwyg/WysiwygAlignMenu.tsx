import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
} from "lucide-react";
import { WysiwygAlign } from "./WysiwygAlign";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";

type Align = "left" | "center" | "right" | "justify";

const ICON: Record<Align, typeof TextAlignStart> = {
  left: TextAlignStart,
  center: TextAlignCenter,
  right: TextAlignEnd,
  justify: TextAlignJustify,
};

/** A single text-alignment control that opens a picker. */
export interface WysiwygAlignMenuProps {
  className?: string;
  title?: string;
}

/**
 * Grouped text-alignment control. The trigger shows the alignment currently
 * applied to the selection; clicking it opens a picker with left / center /
 * justify / right (composed from the individual {@link WysiwygAlign} controls).
 */
export const WysiwygAlignMenu: React.FC<WysiwygAlignMenuProps> = ({
  className = "",
  title = "Text alignment",
}) => {
  const ctx = useWysiwygContext();
  // Re-render when the selection moves so the trigger icon stays in sync.
  void ctx.version;

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  const current: Align = ctx.isActive("justifyCenter")
    ? "center"
    : ctx.isActive("justifyRight")
      ? "right"
      : ctx.isActive("justifyFull")
        ? "justify"
        : "left";
  const Icon = ICON[current];

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

  return (
    <span ref={wrapRef} className={styles.menu}>
      <button
        type='button'
        title={title}
        aria-label={`${title} (${current})`}
        aria-haspopup='true'
        aria-expanded={open}
        data-align={current}
        disabled={ctx.disabled}
        // Keep the editor selection intact when opening the menu.
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        className={`${styles.control} ${open ? styles.controlActive : ""} ${className}`.trim()}
      >
        <Icon size={16} aria-hidden='true' />
        <ChevronDown size={12} aria-hidden='true' className={styles.menuChevron} />
      </button>
      {open && (
        <div
          className={styles.menuPopover}
          role='menu'
          aria-label={title}
          // Close after any option is chosen; keep selection while inside.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpen(false)}
        >
          <WysiwygAlign value='left' />
          <WysiwygAlign value='center' />
          <WysiwygAlign value='justify' />
          <WysiwygAlign value='right' />
        </div>
      )}
    </span>
  );
};
