import React from "react";
import { SquareCode } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Format the current block as a preformatted code block (`<pre>`). */
export const WysiwygCodeBlock: React.FC<NamedControlProps> = ({
  className,
  title = "Code block",
}) => (
  <WysiwygControl
    command='formatBlock'
    value='<pre>'
    title={title}
    className={className}
    isActive={({ queryValue }) =>
      queryValue("formatBlock").toLowerCase() === "pre"
    }
  >
    <SquareCode size={16} aria-hidden='true' />
  </WysiwygControl>
);
