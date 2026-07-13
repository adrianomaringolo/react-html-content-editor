import React from "react";
import { IndentDecrease } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Decrease the indentation of the current block. */
export const WysiwygOutdent: React.FC<NamedControlProps> = ({
  className,
  title = "Decrease indent",
}) => (
  <WysiwygControl
    command='outdent'
    title={title}
    className={className}
    isActive={() => false}
  >
    <IndentDecrease size={16} aria-hidden='true' />
  </WysiwygControl>
);
