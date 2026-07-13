import React from "react";
import { Subscript } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Toggle subscript (`<sub>`) on the current selection. */
export const WysiwygSubscript: React.FC<NamedControlProps> = ({
  className,
  title = "Subscript",
}) => (
  <WysiwygControl command='subscript' title={title} className={className}>
    <Subscript size={16} aria-hidden='true' />
  </WysiwygControl>
);
