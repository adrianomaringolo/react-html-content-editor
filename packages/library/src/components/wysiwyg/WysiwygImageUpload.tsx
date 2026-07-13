import React, { useRef, useState } from "react";
import { ImageUp, LoaderCircle } from "lucide-react";
import { WysiwygControl } from "./WysiwygControl";
import { useWysiwygContext } from "./context";
import styles from "./wysiwyg.module.css";
import type { NamedControlProps } from "./types";

/** Pick an image file, upload it, then insert the returned URL. */
export interface WysiwygImageUploadProps extends NamedControlProps {
  /**
   * Upload the picked file and resolve to the URL that should be inserted.
   * Required — this is where you send the file to your server/storage.
   */
  upload: (file: File) => Promise<string>;
  /** Accepted file types (default: `"image/*"`). */
  accept?: string;
  /** Called if {@link upload} rejects. Defaults to `console.error`. */
  onError?: (error: unknown) => void;
}

/**
 * Pick an image file, upload it via the provided {@link upload} handler, then
 * insert the returned URL into the editor. The control is disabled and shows a
 * spinner while the upload is in flight.
 *
 * For embedding images without a server (base64) or by URL, use
 * {@link WysiwygImage}.
 */
export const WysiwygImageUpload: React.FC<WysiwygImageUploadProps> = ({
  className,
  title = "Upload image",
  upload,
  accept = "image/*",
  onError,
}) => {
  const { exec } = useWysiwygContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;

    setUploading(true);
    try {
      const url = await upload(file);
      if (url && url.trim()) exec("insertImage", url.trim());
    } catch (error) {
      if (onError) onError(error);
      else console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <WysiwygControl
        command='insertImage'
        title={title}
        className={className}
        isActive={() => false}
        disabled={uploading}
        onActivate={() => inputRef.current?.click()}
      >
        {uploading ? (
          <LoaderCircle
            size={16}
            aria-hidden='true'
            className={styles.spinner}
          />
        ) : (
          <ImageUp size={16} aria-hidden='true' />
        )}
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
