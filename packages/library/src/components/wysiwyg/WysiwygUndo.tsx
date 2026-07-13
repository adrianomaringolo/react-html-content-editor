import React from "react";
import { Undo2 } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Undo the last edit. */
export const WysiwygUndo: React.FC<NamedControlProps> = ({
  className,
  title = "Undo (Ctrl+Z)",
}) => (
  <WysiwygControl
    command='undo'
    title={title}
    className={className}
    isActive={() => false}
  >
    <Undo2 size={16} aria-hidden='true' />
  </WysiwygControl>
);
