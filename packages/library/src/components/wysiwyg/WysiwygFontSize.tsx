import React from "react";
import styles from "./wysiwyg.module.css";
import { useWysiwygContext } from "./context";

export interface WysiwygFontSizeOption {
  label: string;
  /** execCommand fontSize scale value, 1–7. */
  value: string;
}

const DEFAULT_FONT_SIZES: WysiwygFontSizeOption[] = [
  { label: "Small", value: "2" },
  { label: "Normal", value: "3" },
  { label: "Medium", value: "4" },
  { label: "Large", value: "5" },
  { label: "Huge", value: "6" },
];

/** A dropdown that applies a font size to the current selection (as CSS). */
export interface WysiwygFontSizeProps {
  className?: string;
  title?: string;
  options?: WysiwygFontSizeOption[];
}

export const WysiwygFontSize: React.FC<WysiwygFontSizeProps> = ({
  className = "",
  title = "Font size",
  options = DEFAULT_FONT_SIZES,
}) => {
  const ctx = useWysiwygContext();
  void ctx.version;

  const current = ctx.queryValue("fontSize") || "3";

  return (
    <select
      title={title}
      aria-label={title}
      disabled={ctx.disabled}
      value={options.some((o) => o.value === current) ? current : "3"}
      // Preserve selection while interacting with the control.
      onMouseDown={(e) => e.stopPropagation()}
      onChange={(e) => ctx.exec("fontSize", e.target.value, true)}
      className={`${styles.select} ${className}`.trim()}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
