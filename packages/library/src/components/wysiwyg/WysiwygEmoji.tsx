import React from "react";
import { Smile } from "lucide-react";
import { WysiwygDropdown } from "./WysiwygDropdown";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";
import type { NamedControlProps } from "./types";

const DEFAULT_EMOJIS = [
  "😀", "😄", "😉", "😍", "😎", "🤔", "😅", "😂",
  "👍", "👏", "🙌", "🙏", "💪", "🔥", "✨", "🎉",
  "❤️", "⭐", "✅", "❌", "⚠️", "💡", "📌", "🚀",
];

/** Insert an emoji from a picker. */
export interface WysiwygEmojiProps extends NamedControlProps {
  /** Emojis shown in the picker. */
  emojis?: string[];
}

export const WysiwygEmoji: React.FC<WysiwygEmojiProps> = ({
  className,
  title = "Emoji",
  emojis = DEFAULT_EMOJIS,
}) => {
  const { exec } = useWysiwygContext();
  return (
    <WysiwygDropdown
      title={title}
      className={className}
      trigger={<Smile size={16} aria-hidden='true' />}
    >
      <div className={styles.glyphGrid}>
        {emojis.map((emoji) => (
          <button
            key={emoji}
            type='button'
            role='menuitem'
            title={emoji}
            aria-label={`Insert ${emoji}`}
            className={styles.glyphButton}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("insertText", emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </WysiwygDropdown>
  );
};
