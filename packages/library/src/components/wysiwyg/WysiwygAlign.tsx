import React from "react";
import {
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
} from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

const ALIGN_COMMAND = {
  left: "justifyLeft",
  center: "justifyCenter",
  right: "justifyRight",
  justify: "justifyFull",
} as const;

const ALIGN_ICON = {
  left: TextAlignStart,
  center: TextAlignCenter,
  right: TextAlignEnd,
  justify: TextAlignJustify,
} as const;

/** Align the current block left, center, right, or justified. */
export interface WysiwygAlignProps extends NamedControlProps {
  value: "left" | "center" | "right" | "justify";
}

export const WysiwygAlign: React.FC<WysiwygAlignProps> = ({
  value,
  className,
  title,
}) => {
  const Icon = ALIGN_ICON[value];
  return (
    <WysiwygControl
      command={ALIGN_COMMAND[value]}
      title={title ?? `Align ${value}`}
      className={className}
    >
      <Icon size={16} aria-hidden='true' />
    </WysiwygControl>
  );
};
