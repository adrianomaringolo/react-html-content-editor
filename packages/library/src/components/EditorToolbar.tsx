import { Maximize2, Wand2, Save, Code, Eye } from "lucide-react";
import { Button } from "./Button";
import { SaveStatusIndicator } from "./SaveStatusIndicator";
import type { SaveStatus } from "../hooks/useAutoSave";
import type { EditorType } from "../types";
import styles from "./content-editor.module.css";

interface EditorToolbarProps {
  showEdit: boolean;
  showPreview: boolean;
  activeEditor: EditorType;
  saveStatus?: SaveStatus;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSave?: () => void;
  onToggleEdit: () => void;
  onTogglePreview: () => void;
  onToggleHtml: () => void;
  onToggleCss: () => void;
  onFormatHtml: () => void;
  onFormatCss: () => void;
  onOpenFullscreen: () => void;
  fullscreenButtonRef: React.RefObject<HTMLButtonElement>;
}

/**
 * EditorToolbar component displays a compact toolbar with toggle buttons and actions
 */
export function EditorToolbar({
  showEdit,
  showPreview,
  activeEditor,
  saveStatus,
  hasUnsavedChanges,
  isSaving,
  onSave,
  onToggleEdit,
  onTogglePreview,
  onToggleHtml,
  onToggleCss,
  onFormatHtml,
  onFormatCss,
  onOpenFullscreen,
  fullscreenButtonRef,
}: EditorToolbarProps) {
  const getFormatShortcut = () => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    return isMac ? "⌘⇧F" : "Ctrl+Shift+F";
  };

  const getSaveShortcut = () => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    return isMac ? "⌘S" : "Ctrl+S";
  };

  const getFullscreenShortcut = () => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    return isMac ? "⌘⇧M" : "Ctrl+Shift+M";
  };

  return (
    <div className={styles.editorToolbar}>
      <div className={styles.toolbarLeft}>
        {onSave && saveStatus && <SaveStatusIndicator status={saveStatus} />}

        {/* View Mode Toggles */}
        <div className={styles.toolbarGroup}>
          <Button
            variant={showEdit ? "default" : "outline"}
            size='icon'
            onClick={onToggleEdit}
            aria-label='Toggle edit mode'
            title='Toggle edit mode'
            aria-pressed={showEdit}
          >
            <Code size={18} />
          </Button>
          <Button
            variant={showPreview ? "default" : "outline"}
            size='icon'
            onClick={onTogglePreview}
            aria-label='Toggle preview mode'
            title='Toggle preview mode'
            aria-pressed={showPreview}
          >
            <Eye size={18} />
          </Button>
        </div>

        {/* Editor Type Toggles - Only show when edit mode is active */}
        {showEdit && (
          <div className={styles.toolbarGroup}>
            <Button
              variant={activeEditor === "html" ? "default" : "outline"}
              size='sm'
              onClick={onToggleHtml}
              aria-label='HTML editor'
              title='HTML editor'
              aria-pressed={activeEditor === "html"}
            >
              HTML
            </Button>
            <Button
              variant={activeEditor === "css" ? "default" : "outline"}
              size='sm'
              onClick={onToggleCss}
              aria-label='CSS editor'
              title='CSS editor'
              aria-pressed={activeEditor === "css"}
            >
              CSS
            </Button>
          </div>
        )}
      </div>

      <div className={styles.toolbarRight}>
        {showEdit && activeEditor === "html" && (
          <Button
            variant='ghost'
            size='icon'
            onClick={onFormatHtml}
            aria-label={`Format HTML (${getFormatShortcut()})`}
            title={`Format HTML (${getFormatShortcut()})`}
          >
            <Wand2 size={18} />
          </Button>
        )}
        {showEdit && activeEditor === "css" && (
          <Button
            variant='ghost'
            size='icon'
            onClick={onFormatCss}
            aria-label={`Format CSS (${getFormatShortcut()})`}
            title={`Format CSS (${getFormatShortcut()})`}
          >
            <Wand2 size={18} />
          </Button>
        )}
        {onSave && (
          <Button
            variant={hasUnsavedChanges ? "default" : "ghost"}
            size='icon'
            onClick={onSave}
            disabled={!hasUnsavedChanges || isSaving}
            aria-label={`Save content (${getSaveShortcut()})`}
            title={`Save content (${getSaveShortcut()})`}
          >
            <Save size={18} />
          </Button>
        )}
        <Button
          variant='ghost'
          size='icon'
          onClick={onOpenFullscreen}
          aria-label={`Open fullscreen (${getFullscreenShortcut()})`}
          title={`Open fullscreen (${getFullscreenShortcut()})`}
          ref={fullscreenButtonRef}
        >
          <Maximize2 size={18} />
        </Button>
      </div>
    </div>
  );
}
