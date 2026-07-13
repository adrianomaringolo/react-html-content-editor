import React from "react";
import { Bold } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Toggle bold (`<b>`) on the current selection. */
export const WysiwygBold: React.FC<NamedControlProps> = ({
  className,
  title = "Bold (Ctrl+B)",
}) => (
  <WysiwygControl command='bold' title={title} className={className}>
    <Bold size={16} aria-hidden='true' />
  </WysiwygControl>
);
