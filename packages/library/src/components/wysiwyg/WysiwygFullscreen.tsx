import React, { useEffect, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import { useWysiwygContext } from "./context";
import type { NamedControlProps } from "./types";

/**
 * Toggle fullscreen for the editor using the Fullscreen API on the `Wysiwyg`
 * root element. Standalone editors don't have the `ContentEditor`'s fullscreen
 * overlay, so this offers the same affordance.
 */
export const WysiwygFullscreen: React.FC<NamedControlProps> = ({
  className,
  title = "Toggle fullscreen",
}) => {
  const { rootRef } = useWysiwygContext();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [rootRef]);

  const toggle = () => {
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      el.requestFullscreen?.();
    }
  };

  const Icon = isFullscreen ? Minimize : Maximize;

  return (
    <WysiwygControl
      command='__fullscreen'
      title={title}
      className={className}
      isActive={() => isFullscreen}
      onActivate={toggle}
    >
      <Icon size={16} aria-hidden='true' />
    </WysiwygControl>
  );
};
