import { useEffect } from "react";
import {
  Wysiwyg,
  WysiwygToolbar,
  WysiwygSeparator,
  WysiwygBold,
  WysiwygItalic,
  WysiwygUnderline,
  WysiwygStrikethrough,
  WysiwygHeading,
  WysiwygParagraph,
  WysiwygBlockquote,
  WysiwygFontSize,
  WysiwygUnorderedList,
  WysiwygOrderedList,
  WysiwygAlign,
  WysiwygLink,
  WysiwygUnlink,
  WysiwygClearFormatting,
  WysiwygContent,
} from "../wysiwyg";
import { useContentEditorContext } from "./context";
import styles from "../content-editor.module.css";

export interface ContentEditorWysiwygProps {
  /** Placeholder for the editable surface (default toolbar only). */
  placeholder?: string;
  /** Minimum height of the editable area. */
  minHeight?: string | number;
  className?: string;
  /**
   * Compose the WYSIWYG surface yourself with `WysiwygToolbar`,
   * `WysiwygContent` and the individual controls. When omitted, a sensible
   * default toolbar and content area are rendered.
   */
  children?: React.ReactNode;
}

/**
 * WYSIWYG editing pane. Bridges the shared HTML value into a {@link Wysiwyg}
 * root and applies the current CSS to the editable surface so the rich-text
 * view reflects the same styles as the preview. Visible in `wysiwyg` mode.
 *
 * The CSS is applied globally (like the preview) — the same trade-off the
 * `PreviewPane` already makes.
 */
export function ContentEditorWysiwyg({
  placeholder = "Start writing…",
  minHeight = "320px",
  className = "",
  children,
}: ContentEditorWysiwygProps) {
  const { mode, value, onHtmlChange, registerWysiwyg } =
    useContentEditorContext();

  // Advertise availability to the toolbar so it renders the mode switch.
  useEffect(() => {
    registerWysiwyg();
  }, [registerWysiwyg]);

  if (mode !== "wysiwyg") return null;

  return (
    <div className={`${styles.wysiwygPane} ${className}`.trim()}>
      {value.css && <style>{value.css}</style>}
      <Wysiwyg value={value.html} onChange={onHtmlChange}>
        {children ?? (
          <>
            <WysiwygToolbar>
              <WysiwygHeading level={1} />
              <WysiwygHeading level={2} />
              <WysiwygParagraph />
              <WysiwygSeparator />
              <WysiwygBold />
              <WysiwygItalic />
              <WysiwygUnderline />
              <WysiwygStrikethrough />
              <WysiwygFontSize />
              <WysiwygSeparator />
              <WysiwygUnorderedList />
              <WysiwygOrderedList />
              <WysiwygBlockquote />
              <WysiwygSeparator />
              <WysiwygAlign value='left' />
              <WysiwygAlign value='center' />
              <WysiwygAlign value='right' />
              <WysiwygSeparator />
              <WysiwygLink />
              <WysiwygUnlink />
              <WysiwygClearFormatting />
            </WysiwygToolbar>
            <WysiwygContent placeholder={placeholder} minHeight={minHeight} />
          </>
        )}
      </Wysiwyg>
    </div>
  );
}
