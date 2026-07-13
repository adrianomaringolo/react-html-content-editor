import React from "react";
import { ListOrdered } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Toggle a numbered (`<ol>`) list. */
export const WysiwygOrderedList: React.FC<NamedControlProps> = ({
  className,
  title = "Numbered list",
}) => (
  <WysiwygControl command='insertOrderedList' title={title} className={className}>
    <ListOrdered size={16} aria-hidden='true' />
  </WysiwygControl>
);
