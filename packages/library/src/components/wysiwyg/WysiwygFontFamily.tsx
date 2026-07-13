import React from "react";
import { Type, Check } from "lucide-react";
import { WysiwygDropdown } from "./WysiwygDropdown";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";
import type { NamedControlProps } from "./types";

/** A font-family option for {@link WysiwygFontFamily}. */
export interface WysiwygFontFamilyOption {
  label: string;
  /** CSS font-family stack applied via `fontName`. */
  value: string;
}

const DEFAULT_FONTS: WysiwygFontFamilyOption[] = [
  { label: "Sans serif", value: "system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Monospace", value: "ui-monospace, 'Courier New', monospace" },
];

/** Dropdown that sets the font family of the current selection. */
export interface WysiwygFontFamilyProps extends NamedControlProps {
  options?: WysiwygFontFamilyOption[];
}

export const WysiwygFontFamily: React.FC<WysiwygFontFamilyProps> = ({
  className,
  title = "Font family",
  options = DEFAULT_FONTS,
}) => {
  const ctx = useWysiwygContext();
  void ctx.version;
  const current = ctx.queryValue("fontName");

  return (
    <WysiwygDropdown
      title={title}
      className={className}
      trigger={<Type size={16} aria-hidden='true' />}
    >
      <div className={styles.menuList}>
        {options.map((option) => {
          const selected = current === option.value;
          return (
            <button
              key={option.value}
              type='button'
              role='menuitem'
              aria-label={option.label}
              className={styles.menuItem}
              style={{ fontFamily: option.value }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => ctx.exec("fontName", option.value)}
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
