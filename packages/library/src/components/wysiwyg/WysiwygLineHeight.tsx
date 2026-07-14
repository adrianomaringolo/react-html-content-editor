import React from "react";
import { UnfoldVertical, Check } from "lucide-react";
import { WysiwygDropdown } from "./WysiwygDropdown";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";
import type { NamedControlProps } from "./types";

/** A line-height option for {@link WysiwygLineHeight}. */
export interface WysiwygLineHeightOption {
  label: string;
  /** CSS `line-height` value; an empty string clears it. */
  value: string;
}

const DEFAULT_OPTIONS: WysiwygLineHeightOption[] = [
  { label: "Default", value: "" },
  { label: "Single", value: "1" },
  { label: "1.15", value: "1.15" },
  { label: "1.5", value: "1.5" },
  { label: "Double", value: "2" },
  { label: "2.5", value: "2.5" },
];

/** Block-level elements of `root` that intersect the current selection. */
function selectedBlocks(root: HTMLElement): HTMLElement[] {
  const sel = document.getSelection();
  if (!sel || sel.rangeCount === 0 || !root.contains(sel.anchorNode)) return [];
  const range = sel.getRangeAt(0);
  const blocks = Array.from(root.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && range.intersectsNode(child),
  );
  if (blocks.length > 0) return blocks;
  // Selection sits in a nested/inline node: climb to a direct child of root.
  let el: HTMLElement | null =
    sel.anchorNode instanceof HTMLElement
      ? sel.anchorNode
      : (sel.anchorNode?.parentElement ?? null);
  while (el && el.parentElement !== root) el = el.parentElement;
  return el && el.parentElement === root ? [el] : [];
}

/** Dropdown that sets the line height of the selected block(s). */
export interface WysiwygLineHeightProps extends NamedControlProps {
  options?: WysiwygLineHeightOption[];
}

export const WysiwygLineHeight: React.FC<WysiwygLineHeightProps> = ({
  className,
  title = "Line height",
  options = DEFAULT_OPTIONS,
}) => {
  const ctx = useWysiwygContext();
  void ctx.version;
  const current = selectedBlocks(ctx.editorRef.current ?? document.body)[0]
    ?.style.lineHeight;

  const apply = (value: string) => {
    const root = ctx.editorRef.current;
    if (!root) return;
    const blocks = selectedBlocks(root);
    if (blocks.length === 0) return;
    for (const block of blocks) {
      if (value) block.style.lineHeight = value;
      else block.style.removeProperty("line-height");
    }
    ctx.commit(root.innerHTML);
  };

  return (
    <WysiwygDropdown
      title={title}
      className={className}
      trigger={<UnfoldVertical size={16} aria-hidden='true' />}
    >
      <div className={styles.menuList}>
        {options.map((option) => {
          const selected = (current ?? "") === option.value;
          return (
            <button
              key={option.value || "default"}
              type='button'
              role='menuitem'
              aria-label={option.label}
              className={styles.menuItem}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => apply(option.value)}
            >
              <span className={styles.menuItemCheck} aria-hidden='true'>
                {selected && <Check size={14} />}
              </span>
              {option.label}
            </button>
          );
        })}
      </div>
    </WysiwygDropdown>
  );
};
