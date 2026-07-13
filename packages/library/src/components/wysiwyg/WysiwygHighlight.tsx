import React from "react";
import { Highlighter } from "lucide-react";
import { WysiwygDropdown } from "./WysiwygDropdown";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";
import type { NamedControlProps } from "./types";

const DEFAULT_COLORS = [
  "#fde047",
  "#fca5a5",
  "#86efac",
  "#93c5fd",
  "#d8b4fe",
  "#f9a8d4",
  "transparent",
];

/** Highlight (background color) the current selection via a swatch picker. */
export interface WysiwygHighlightProps extends NamedControlProps {
  /** Swatch colors (CSS colors); include `"transparent"` to clear. */
  colors?: string[];
}

export const WysiwygHighlight: React.FC<WysiwygHighlightProps> = ({
  className,
  title = "Highlight",
  colors = DEFAULT_COLORS,
}) => {
  const { exec } = useWysiwygContext();
  return (
    <WysiwygDropdown
      title={title}
      className={className}
      trigger={<Highlighter size={16} aria-hidden='true' />}
    >
      <div className={styles.swatches}>
        {colors.map((color) => (
          <button
            key={color}
            type='button'
            role='menuitem'
            title={color === "transparent" ? "None" : color}
            aria-label={
              color === "transparent" ? "Remove highlight" : `Highlight ${color}`
            }
            style={{
              background: color === "transparent" ? "#ffffff" : color,
            }}
            className={
              color === "transparent"
                ? `${styles.swatch} ${styles.swatchNone}`
                : styles.swatch
            }
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("hiliteColor", color, true)}
          />
        ))}
      </div>
    </WysiwygDropdown>
  );
};
