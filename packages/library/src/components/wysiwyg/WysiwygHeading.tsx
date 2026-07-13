import React from "react";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

const HEADING_ICON = {
  1: Heading1,
  2: Heading2,
  3: Heading3,
  4: Heading4,
  5: Heading5,
  6: Heading6,
} as const;

/** Format the current block as a heading of the given level. */
export interface WysiwygHeadingProps extends NamedControlProps {
  /** Heading level 1–6. */
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export const WysiwygHeading: React.FC<WysiwygHeadingProps> = ({
  level,
  className,
  title,
}) => {
  const tag = `h${level}`;
  const Icon = HEADING_ICON[level];
  return (
    <WysiwygControl
      command='formatBlock'
      value={`<${tag}>`}
      title={title ?? `Heading ${level}`}
      className={className}
      isActive={({ queryValue }) =>
        queryValue("formatBlock").toLowerCase() === tag
      }
    >
      <Icon size={16} aria-hidden='true' />
    </WysiwygControl>
  );
};
