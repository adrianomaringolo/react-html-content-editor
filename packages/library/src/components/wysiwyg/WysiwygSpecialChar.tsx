import React from "react";
import { Omega } from "lucide-react";
import { WysiwygDropdown } from "./WysiwygDropdown";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";
import type { NamedControlProps } from "./types";

const DEFAULT_CHARS = [
  "©", "®", "™", "°", "±", "×", "÷", "µ",
  "€", "£", "¥", "¢", "§", "¶", "•", "…",
  "—", "–", "«", "»", "“", "”", "‘", "’",
  "→", "←", "↑", "↓", "≈", "≠", "≤", "≥",
];

/** Insert a special character from a picker. */
export interface WysiwygSpecialCharProps extends NamedControlProps {
  /** Characters shown in the picker. */
  characters?: string[];
}

export const WysiwygSpecialChar: React.FC<WysiwygSpecialCharProps> = ({
  className,
  title = "Special character",
  characters = DEFAULT_CHARS,
}) => {
  const { exec } = useWysiwygContext();
  return (
    <WysiwygDropdown
      title={title}
      className={className}
      trigger={<Omega size={16} aria-hidden='true' />}
    >
      <div className={styles.glyphGrid}>
        {characters.map((char) => (
          <button
            key={char}
            type='button'
            role='menuitem'
            title={char}
            aria-label={`Insert ${char}`}
            className={styles.glyphButton}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("insertText", char)}
          >
            {char}
          </button>
        ))}
      </div>
    </WysiwygDropdown>
  );
};
