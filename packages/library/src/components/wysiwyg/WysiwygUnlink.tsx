import React from "react";
import { Unlink } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Remove the link from the current selection. */
export const WysiwygUnlink: React.FC<NamedControlProps> = ({
  className,
  title = "Remove link",
}) => (
  <WysiwygControl
    command='unlink'
    title={title}
    className={className}
    isActive={() => false}
  >
    <Unlink size={16} aria-hidden='true' />
  </WysiwygControl>
);
