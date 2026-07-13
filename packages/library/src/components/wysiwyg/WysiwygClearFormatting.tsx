import React from "react";
import { RemoveFormatting } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Strip inline formatting from the current selection. */
export const WysiwygClearFormatting: React.FC<NamedControlProps> = ({
  className,
  title = "Clear formatting",
}) => (
  <WysiwygControl
    command='removeFormat'
    title={title}
    className={className}
    isActive={() => false}
  >
    <RemoveFormatting size={16} aria-hidden='true' />
  </WysiwygControl>
);
