import React from "react";
import { Strikethrough } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Toggle strikethrough on the current selection. */
export const WysiwygStrikethrough: React.FC<NamedControlProps> = ({
  className,
  title = "Strikethrough",
}) => (
  <WysiwygControl command='strikeThrough' title={title} className={className}>
    <Strikethrough size={16} aria-hidden='true' />
  </WysiwygControl>
);
