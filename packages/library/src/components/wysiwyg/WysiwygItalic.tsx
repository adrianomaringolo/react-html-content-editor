import React from "react";
import { Italic } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Toggle italic (`<i>`) on the current selection. */
export const WysiwygItalic: React.FC<NamedControlProps> = ({
  className,
  title = "Italic (Ctrl+I)",
}) => (
  <WysiwygControl command='italic' title={title} className={className}>
    <Italic size={16} aria-hidden='true' />
  </WysiwygControl>
);
