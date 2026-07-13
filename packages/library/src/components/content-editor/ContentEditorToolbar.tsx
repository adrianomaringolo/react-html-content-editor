import { Code, Eye, WandSparkles, Save, PenLine } from "lucide-react";
import { Button } from "../Button";
import { SaveStatusIndicator } from "../SaveStatusIndicator";
import { useContentEditorContext } from "./context";
import styles from "../content-editor.module.css";

export interface ContentEditorToolbarProps {
  /** Additional class name for the toolbar container. */
  className?: string;
  /**
   * Replace the default toolbar contents entirely. When provided, only these
   * children are rendered (the compound state is still available via context).
   */
  children?: React.ReactNode;
}

const isMac = () =>
  typeof navigator !== "undefined" &&
  navigator.platform.toUpperCase().indexOf("MAC") >= 0;

const formatShortcut = () => (isMac() ? "⌘⇧F" : "Ctrl+Shift+F");
const saveShortcut = () => (isMac() ? "⌘S" : "Ctrl+S");

/**
 * Default toolbar for the {@link ContentEditor}. Renders the code/WYSIWYG mode
 * switch (when a WYSIWYG pane is present), the view toggles, editor tabs,
 * format and save actions — all wired to the shared context.
 */
export function ContentEditorToolbar({
  className = "",
  children,
}: ContentEditorToolbarProps) {
  const {
    mode,
    setMode,
    hasWysiwyg,
    showEdit,
    showPreview,
    toggleEdit,
    togglePreview,
    activeEditor,
    setActiveEditor,
    formatHtml,
    formatCss,
    onSave,
    saveStatus,
    hasUnsavedChanges,
    isSaving,
    htmlLabel,
    cssLabel,
  } = useContentEditorContext();

  return (
    <div className={`${styles.editorToolbar} ${className}`.trim()}>
      <div className={styles.toolbarLeft}>
        {onSave && saveStatus && <SaveStatusIndicator status={saveStatus} />}

        {children ?? (
          <>
            {/* Mode switch — only when a WYSIWYG surface is available */}
            {hasWysiwyg && (
              <div className={styles.toolbarGroup}>
                <Button
                  variant={mode === "code" ? "default" : "outline"}
                  size='sm'
                  onClick={() => setMode("code")}
                  aria-label='Code view'
                  title='Code view (HTML/CSS + preview)'
                  aria-pressed={mode === "code"}
                >
                  <Code size={16} />
                  <span>Code</span>
                </Button>
                <Button
                  variant={mode === "wysiwyg" ? "default" : "outline"}
                  size='sm'
                  onClick={() => setMode("wysiwyg")}
                  aria-label='Visual editor'
                  title='Visual (WYSIWYG) editor'
                  aria-pressed={mode === "wysiwyg"}
                >
                  <PenLine size={16} />
                  <span>Visual</span>
                </Button>
              </div>
            )}

            {mode === "code" && (
              <>
                {/* View toggles */}
                <div className={styles.toolbarGroup}>
                  <Button
                    variant={showEdit ? "default" : "outline"}
                    size='icon'
                    onClick={toggleEdit}
                    aria-label='Toggle edit mode'
                    title='Toggle edit mode'
                    aria-pressed={showEdit}
                  >
                    <Code size={18} />
                  </Button>
                  <Button
                    variant={showPreview ? "default" : "outline"}
                    size='icon'
                    onClick={togglePreview}
                    aria-label='Toggle preview mode'
                    title='Toggle preview mode'
                    aria-pressed={showPreview}
                  >
                    <Eye size={18} />
                  </Button>
                </div>

                {/* Editor tabs */}
                {showEdit && (
                  <div className={styles.toolbarGroup}>
                    <Button
                      variant={activeEditor === "html" ? "default" : "outline"}
                      size='sm'
                      onClick={() => setActiveEditor("html")}
                      aria-label={`${htmlLabel} editor`}
                      title={`${htmlLabel} editor`}
                      aria-pressed={activeEditor === "html"}
                    >
                      {htmlLabel}
                    </Button>
                    <Button
                      variant={activeEditor === "css" ? "default" : "outline"}
                      size='sm'
                      onClick={() => setActiveEditor("css")}
                      aria-label={`${cssLabel} editor`}
                      title={`${cssLabel} editor`}
                      aria-pressed={activeEditor === "css"}
                    >
                      {cssLabel}
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {!children && (
        <div className={styles.toolbarRight}>
          {mode === "code" && showEdit && activeEditor === "html" && (
            <Button
              variant='ghost'
              size='icon'
              onClick={formatHtml}
              aria-label={`Format ${htmlLabel} (${formatShortcut()})`}
              title={`Format ${htmlLabel} (${formatShortcut()})`}
            >
              <WandSparkles size={18} />
            </Button>
          )}
          {mode === "code" && showEdit && activeEditor === "css" && (
            <Button
              variant='ghost'
              size='icon'
              onClick={formatCss}
              aria-label={`Format ${cssLabel} (${formatShortcut()})`}
              title={`Format ${cssLabel} (${formatShortcut()})`}
            >
              <WandSparkles size={18} />
            </Button>
          )}
          {onSave && (
            <Button
              variant={hasUnsavedChanges ? "default" : "ghost"}
              size='icon'
              onClick={onSave}
              disabled={!hasUnsavedChanges || isSaving}
              aria-label={`Save content (${saveShortcut()})`}
              title={`Save content (${saveShortcut()})`}
            >
              <Save size={18} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
