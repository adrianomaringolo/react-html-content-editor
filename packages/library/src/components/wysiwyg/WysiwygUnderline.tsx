import React from "react";
import { Underline } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Toggle underline (`<u>`) on the current selection. */
export const WysiwygUnderline: React.FC<NamedControlProps> = ({
  className,
  title = "Underline (Ctrl+U)",
}) => (
  <WysiwygControl command='underline' title={title} className={className}>
    <Underline size={16} aria-hidden='true' />
  </WysiwygControl>
);
