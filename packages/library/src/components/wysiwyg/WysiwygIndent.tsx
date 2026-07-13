import React from "react";
import { IndentIncrease } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Increase the indentation of the current block. */
export const WysiwygIndent: React.FC<NamedControlProps> = ({
  className,
  title = "Increase indent",
}) => (
  <WysiwygControl
    command='indent'
    title={title}
    className={className}
    isActive={() => false}
  >
    <IndentIncrease size={16} aria-hidden='true' />
  </WysiwygControl>
);
