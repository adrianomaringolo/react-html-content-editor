import React from "react";
import { Heading, ChevronDown } from "lucide-react";
import { WysiwygHeading } from "./WysiwygHeading";
import { WysiwygParagraph } from "./WysiwygParagraph";
import { WysiwygDropdown } from "./WysiwygDropdown";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";

/** Grouped heading control (H1–H6 + paragraph) in a single dropdown. */
export interface WysiwygHeadingMenuProps {
  className?: string;
  title?: string;
  /** Heading levels to offer (default: 1–6). */
  levels?: (1 | 2 | 3 | 4 | 5 | 6)[];
}

const ALL_LEVELS: (1 | 2 | 3 | 4 | 5 | 6)[] = [1, 2, 3, 4, 5, 6];

export const WysiwygHeadingMenu: React.FC<WysiwygHeadingMenuProps> = ({
  className = "",
  title = "Heading",
  levels = ALL_LEVELS,
}) => {
  const ctx = useWysiwygContext();
  void ctx.version;
  const block = ctx.queryValue("formatBlock").toLowerCase();
  const currentLevel = /^h([1-6])$/.exec(block)?.[1];

  return (
    <WysiwygDropdown
      title={title}
      className={className}
      triggerAriaLabel={currentLevel ? `${title} (H${currentLevel})` : title}
      triggerData={{ block: block || "p" }}
      trigger={
        <>
          {currentLevel ? (
            <span className={styles.menuTriggerText}>H{currentLevel}</span>
          ) : (
            <Heading size={16} aria-hidden='true' />
          )}
          <ChevronDown size={12} aria-hidden='true' className={styles.menuChevron} />
        </>
      }
    >
      <div className={styles.menuRow}>
        {levels.map((level) => (
          <WysiwygHeading key={level} level={level} />
        ))}
        <WysiwygParagraph />
      </div>
    </WysiwygDropdown>
  );
};
