import { PreviewPane } from "../PreviewPane";
import { useContentEditorContext } from "./context";
import styles from "../content-editor.module.css";

export interface ContentEditorPreviewProps {
  className?: string;
}

/**
 * Live preview pane. Renders the HTML with the CSS applied. Visible in `code`
 * mode while the preview is toggled on.
 */
export function ContentEditorPreview({
  className = "",
}: ContentEditorPreviewProps) {
  const { mode, showPreview, value } = useContentEditorContext();

  if (mode !== "code" || !showPreview) return null;

  return (
    <div className={`${styles.splitPane} ${className}`.trim()}>
      <PreviewPane html={value.html} css={value.css} />
    </div>
  );
}
