import styles from "./content-editor.module.css";

interface PreviewPaneProps {
  html: string;
  css: string;
  previewRef?: React.RefObject<HTMLDivElement>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * PreviewPane component displays the HTML/CSS preview
 */
export function PreviewPane({
  html,
  css,
  previewRef,
  onScroll,
}: PreviewPaneProps) {
  const hasContent = html.trim() || css.trim();

  if (!hasContent) {
    return (
      <div
        ref={previewRef}
        onScroll={onScroll}
        className={styles.previewContainer}
      >
        <div className={styles.previewPlaceholder}>
          No content to preview. Start editing HTML or CSS to see the preview.
        </div>
      </div>
    );
  }

  return (
    <div
      ref={previewRef}
      onScroll={onScroll}
      className={styles.previewContainer}
    >
      {css && <style>{css}</style>}
      <div
        className='content-preview'
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
