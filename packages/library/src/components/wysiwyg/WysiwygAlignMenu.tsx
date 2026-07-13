import React from "react";
import {
  ChevronDown,
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
} from "lucide-react";
import { WysiwygAlign } from "./WysiwygAlign";
import { WysiwygDropdown } from "./WysiwygDropdown";
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

  const current: Align = ctx.isActive("justifyCenter")
    ? "center"
    : ctx.isActive("justifyRight")
      ? "right"
      : ctx.isActive("justifyFull")
        ? "justify"
        : "left";
  const Icon = ICON[current];

  return (
    <WysiwygDropdown
      title={title}
      className={className}
      triggerAriaLabel={`${title} (${current})`}
      triggerData={{ align: current }}
      trigger={
        <>
          <Icon size={16} aria-hidden='true' />
          <ChevronDown size={12} aria-hidden='true' className={styles.menuChevron} />
        </>
      }
    >
      <WysiwygAlign value='left' />
      <WysiwygAlign value='center' />
      <WysiwygAlign value='justify' />
      <WysiwygAlign value='right' />
    </WysiwygDropdown>
  );
};
