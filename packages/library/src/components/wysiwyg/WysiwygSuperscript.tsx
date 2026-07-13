import React from "react";
import { Superscript } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Toggle superscript (`<sup>`) on the current selection. */
export const WysiwygSuperscript: React.FC<NamedControlProps> = ({
  className,
  title = "Superscript",
}) => (
  <WysiwygControl command='superscript' title={title} className={className}>
    <Superscript size={16} aria-hidden='true' />
  </WysiwygControl>
);
