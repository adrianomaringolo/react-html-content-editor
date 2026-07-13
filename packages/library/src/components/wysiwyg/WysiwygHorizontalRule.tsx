import React from "react";
import { Minus } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Insert a horizontal rule (`<hr>`) at the caret. */
export const WysiwygHorizontalRule: React.FC<NamedControlProps> = ({
  className,
  title = "Horizontal rule",
}) => (
  <WysiwygControl
    command='insertHorizontalRule'
    title={title}
    className={className}
    isActive={() => false}
  >
    <Minus size={16} aria-hidden='true' />
  </WysiwygControl>
);
