import React from "react";
import { Quote } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Format the current block as a blockquote. */
export const WysiwygBlockquote: React.FC<NamedControlProps> = ({
  className,
  title = "Quote",
}) => (
  <WysiwygControl
    command='formatBlock'
    value='<blockquote>'
    title={title}
    className={className}
    isActive={({ queryValue }) =>
      queryValue("formatBlock").toLowerCase() === "blockquote"
    }
  >
    <Quote size={16} aria-hidden='true' />
  </WysiwygControl>
);
