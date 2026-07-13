import React from "react";
import { Link } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import { useWysiwygContext } from "./context";
import type { NamedControlProps } from "./types";

/** Wrap the current selection in a link. */
export interface WysiwygLinkProps extends NamedControlProps {
  /** Resolve the URL to link to. Defaults to a `window.prompt`. */
  getUrl?: () => string | null;
}

export const WysiwygLink: React.FC<WysiwygLinkProps> = ({
  className,
  title = "Insert link",
  getUrl,
}) => {
  const ctx = useWysiwygContext();
  return (
    <WysiwygControl
      command='createLink'
      title={title}
      className={className}
      isActive={() => false}
      onActivate={() => {
        const url = getUrl
          ? getUrl()
          : window.prompt("Enter the URL", "https://");
        if (url) ctx.exec("createLink", url);
      }}
    >
      <Link size={16} aria-hidden='true' />
    </WysiwygControl>
  );
};
