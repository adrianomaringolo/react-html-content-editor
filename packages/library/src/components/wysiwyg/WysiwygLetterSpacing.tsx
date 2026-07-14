import React from "react";
import { MoveHorizontal } from "lucide-react";
import { WysiwygDropdown } from "./WysiwygDropdown";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";
import type { NamedControlProps } from "./types";

/** A letter-spacing option for {@link WysiwygLetterSpacing}. */
export interface WysiwygLetterSpacingOption {
  label: string;
  /** CSS `letter-spacing` value (e.g. `"1px"`, `"normal"`). */
  value: string;
}

const DEFAULT_OPTIONS: WysiwygLetterSpacingOption[] = [
  { label: "Normal", value: "normal" },
  { label: "Tight", value: "-0.5px" },
  { label: "Wide", value: "0.5px" },
  { label: "Wider", value: "1px" },
  { label: "Widest", value: "2px" },
];

/**
 * Dropdown that sets the letter spacing of the current selection by wrapping it
 * in a `<span style="letter-spacing: …">`.
 */
export interface WysiwygLetterSpacingProps extends NamedControlProps {
  options?: WysiwygLetterSpacingOption[];
}

export const WysiwygLetterSpacing: React.FC<WysiwygLetterSpacingProps> = ({
  className,
  title = "Letter spacing",
  options = DEFAULT_OPTIONS,
}) => {
  const { exec } = useWysiwygContext();

  const apply = (value: string) => {
    const sel = document.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) return;
    const holder = document.createElement("div");
    holder.appendChild(range.cloneContents());
    exec(
      "insertHTML",
      `<span style="letter-spacing: ${value}">${holder.innerHTML}</span>`,
    );
  };

  return (
    <WysiwygDropdown
      title={title}
      className={className}
      trigger={<MoveHorizontal size={16} aria-hidden='true' />}
    >
      <div className={styles.menuList}>
        {options.map((option) => (
          <button
            key={option.value}
            type='button'
            role='menuitem'
            aria-label={option.label}
            className={styles.menuItem}
            style={{ letterSpacing: option.value }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => apply(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </WysiwygDropdown>
  );
};
