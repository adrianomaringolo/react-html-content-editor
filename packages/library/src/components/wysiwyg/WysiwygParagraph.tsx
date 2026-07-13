import React from "react";
import { Pilcrow } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Format the current block as a paragraph (`<p>`). */
export const WysiwygParagraph: React.FC<NamedControlProps> = ({
  className,
  title = "Paragraph",
}) => (
  <WysiwygControl
    command='formatBlock'
    value='<p>'
    title={title}
    className={className}
    isActive={({ queryValue }) =>
      queryValue("formatBlock").toLowerCase() === "p"
    }
  >
    <Pilcrow size={16} aria-hidden='true' />
  </WysiwygControl>
);
