import React, { useRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import { useWysiwygContext } from "./context";
import type { NamedControlProps } from "./types";

/** Insert an image, either embedded as base64 or referenced by URL. */
export interface WysiwygImageProps extends NamedControlProps {
  /**
   * Resolve the image source (an URL or a data URI) instead of picking a local
   * file. Provide this to insert an image by link, e.g.
   * `getSrc={() => window.prompt("Image URL")}`. May be async.
   */
  getSrc?: () => string | null | Promise<string | null>;
  /** Accepted file types when picking a local file (default: `"image/*"`). */
  accept?: string;
}

/**
 * Insert an image into the editor.
 *
 * By default it opens a file picker and embeds the chosen file as a base64
 * data URI (no server needed). Provide {@link WysiwygImageProps.getSrc} to
 * insert by URL/link instead. For uploading to a server, use
 * {@link WysiwygImageUpload}.
 */
export const WysiwygImage: React.FC<WysiwygImageProps> = ({
  className,
  title = "Insert image",
  getSrc,
  accept = "image/*",
}) => {
  const { exec } = useWysiwygContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const insert = (src: string) => {
    const trimmed = src.trim();
    if (trimmed) exec("insertImage", trimmed);
  };

  const handleActivate = async () => {
    if (getSrc) {
      const src = await getSrc();
      if (src) insert(src);
      return;
    }
    inputRef.current?.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => insert(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <>
      <WysiwygControl
        command='insertImage'
        title={title}
        className={className}
        isActive={() => false}
        onActivate={handleActivate}
      >
        <ImageIcon size={16} aria-hidden='true' />
      </WysiwygControl>
      <input
        ref={inputRef}
        type='file'
        accept={accept}
        hidden
        onChange={handleFile}
      />
    </>
  );
};
