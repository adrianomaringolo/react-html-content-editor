import React from "react";
import { Redo2 } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Redo the last undone edit. */
export const WysiwygRedo: React.FC<NamedControlProps> = ({
  className,
  title = "Redo (Ctrl+Y)",
}) => (
  <WysiwygControl
    command='redo'
    title={title}
    className={className}
    isActive={() => false}
  >
    <Redo2 size={16} aria-hidden='true' />
  </WysiwygControl>
);
