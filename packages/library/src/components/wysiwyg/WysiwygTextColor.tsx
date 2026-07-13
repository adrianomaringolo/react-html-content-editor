import React from "react";
import { Baseline } from "lucide-react";
import { WysiwygDropdown } from "./WysiwygDropdown";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";
import type { NamedControlProps } from "./types";

const DEFAULT_COLORS = [
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#7c3aed",
  "#ec4899",
  "#111827",
  "#6b7280",
];

/** Set the text color of the current selection via a swatch picker. */
export interface WysiwygTextColorProps extends NamedControlProps {
  /** Swatch colors (CSS colors). */
  colors?: string[];
}

export const WysiwygTextColor: React.FC<WysiwygTextColorProps> = ({
  className,
  title = "Text color",
  colors = DEFAULT_COLORS,
}) => {
  const { exec } = useWysiwygContext();
  return (
    <WysiwygDropdown
      title={title}
      className={className}
      trigger={<Baseline size={16} aria-hidden='true' />}
    >
      <div className={styles.swatches}>
        {colors.map((color) => (
          <button
            key={color}
            type='button'
            role='menuitem'
            title={color}
            aria-label={`Text color ${color}`}
            style={{ background: color }}
            className={styles.swatch}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("foreColor", color, true)}
          />
        ))}
      </div>
    </WysiwygDropdown>
  );
};
