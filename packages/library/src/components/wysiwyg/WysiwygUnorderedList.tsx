import React from "react";
import { List } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Toggle a bulleted (`<ul>`) list. */
export const WysiwygUnorderedList: React.FC<NamedControlProps> = ({
  className,
  title = "Bulleted list",
}) => (
  <WysiwygControl
    command='insertUnorderedList'
    title={title}
    className={className}
  >
    <List size={16} aria-hidden='true' />
  </WysiwygControl>
);
