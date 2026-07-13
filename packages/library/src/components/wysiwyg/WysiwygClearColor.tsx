import React from "react";
import { DropletOff } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import type { NamedControlProps } from "./types";

/** Reset the text color of the current selection to the inherited default. */
export const WysiwygClearColor: React.FC<NamedControlProps> = ({
  className,
  title = "Clear text color",
}) => (
  <WysiwygControl
    command='foreColor'
    value='inherit'
    useCss
    title={title}
    className={className}
    isActive={() => false}
  >
    <DropletOff size={16} aria-hidden='true' />
  </WysiwygControl>
);
