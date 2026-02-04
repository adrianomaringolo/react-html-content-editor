import {
  X,
  Monitor,
  Code,
  Columns,
  Wand2,
  Save,
  Link2,
  Link2Off,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";
import { Button } from "./Button";
import { SaveStatusIndicator } from "./SaveStatusIndicator";
import { MonacoEditorWrapper } from "./MonacoEditorWrapper";
import { PreviewPane } from "./PreviewPane";
import type { SaveStatus } from "../hooks/useAutoSave";
import type { EditorType, ContentValue } from "../types";
import type { OnMount } from "@monaco-editor/react";
import styles from "./content-editor.module.css";

interface FullscreenOverlayProps {
  fullscreenMode: "edit" | "preview" | "split";
  activeEditor: EditorType;
  normalizedValue: ContentValue;
  htmlLabel: string;
  cssLabel: string;
  theme: string;
  htmlEditorOptions: any;
  cssEditorOptions: any;
  syncScroll: boolean;
  saveStatus?: SaveStatus;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
  onSave?: () => void;
  onSetFullscreenMode: (mode: "edit" | "preview" | "split") => void;
  onSetActiveEditor: (editor: EditorType) => void;
  onSetSyncScroll: (sync: boolean) => void;
  onCloseFullscreen: () => void;
  onFormatHtml: () => void;
  onFormatCss: () => void;
  onHtmlChange: (value: string | undefined) => void;
  onCssChange: (value: string | undefined) => void;
  onFullscreenHtmlEditorMount: OnMount;
  onFullscreenCssEditorMount: OnMount;
  onPreviewScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * FullscreenOverlay component displays the fullscreen editor interface
 */
export function FullscreenOverlay({
  fullscreenMode,
  activeEditor,
  normalizedValue,
  htmlLabel,
  cssLabel,
  theme,
  htmlEditorOptions,
  cssEditorOptions,
  syncScroll,
  saveStatus,
  hasUnsavedChanges,
  isSaving,
  previewRef,
  onSave,
  onSetFullscreenMode,
  onSetActiveEditor,
  onSetSyncScroll,
  onCloseFullscreen,
  onFormatHtml,
  onFormatCss,
  onHtmlChange,
  onCssChange,
  onFullscreenHtmlEditorMount,
  onFullscreenCssEditorMount,
  onPreviewScroll,
}: FullscreenOverlayProps) {
  return (
    <div className={styles.fullscreenOverlay}>
      <div className={styles.fullscreenHeader}>
        <div className={styles.fullscreenModeButtons}>
          <Button
            variant={fullscreenMode === "edit" ? "default" : "ghost"}
            size='icon'
            onClick={() => onSetFullscreenMode("edit")}
            aria-label='Edit mode'
            title='Edit mode'
          >
            <Code size={18} />
          </Button>
          <Button
            variant={fullscreenMode === "preview" ? "default" : "ghost"}
            size='icon'
            onClick={() => onSetFullscreenMode("preview")}
            aria-label='Preview mode'
            title='Preview mode'
          >
            <Monitor size={18} />
          </Button>
          <Button
            variant={fullscreenMode === "split" ? "default" : "ghost"}
            size='icon'
            onClick={() => onSetFullscreenMode("split")}
            aria-label='Split view mode'
            title='Split view mode'
          >
            <Columns size={18} />
          </Button>
        </div>

        <div className={styles.fullscreenActions}>
          {onSave && saveStatus && <SaveStatusIndicator status={saveStatus} />}
          {onSave && (
            <Button
              variant={hasUnsavedChanges ? "default" : "ghost"}
              size='icon'
              onClick={onSave}
              disabled={!hasUnsavedChanges || isSaving}
              aria-label='Save content (Ctrl+S)'
              title='Save content (Ctrl+S)'
            >
              <Save size={18} />
            </Button>
          )}
          <Button
            variant='ghost'
            size='icon'
            onClick={onCloseFullscreen}
            aria-label='Close fullscreen (Esc)'
            title='Close fullscreen (Esc)'
          >
            <X size={20} />
          </Button>
        </div>
      </div>

      <div className={styles.fullscreenContent}>
        {fullscreenMode === "edit" && (
          <Tabs
            value={activeEditor}
            onValueChange={(val) => onSetActiveEditor(val as EditorType)}
          >
            <div className={styles.fullscreenEditHeader}>
              <TabsList>
                <TabsTrigger value='html'>{htmlLabel}</TabsTrigger>
                <TabsTrigger value='css'>{cssLabel}</TabsTrigger>
              </TabsList>
              <div className={styles.editorActions}>
                {activeEditor === "html" && (
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={onFormatHtml}
                    aria-label='Format HTML code (Ctrl+Shift+F)'
                    title='Format HTML code (Ctrl+Shift+F)'
                  >
                    <Wand2 size={18} />
                  </Button>
                )}
                {activeEditor === "css" && (
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={onFormatCss}
                    aria-label='Format CSS code (Ctrl+Shift+F)'
                    title='Format CSS code (Ctrl+Shift+F)'
                  >
                    <Wand2 size={18} />
                  </Button>
                )}
              </div>
            </div>

            <TabsContent value='html'>
              <MonacoEditorWrapper
                editorKey='fullscreen-edit-html'
                defaultValue={normalizedValue.html}
                language='html'
                theme={theme}
                options={htmlEditorOptions}
                onChange={onHtmlChange}
                onMount={onFullscreenHtmlEditorMount}
              />
            </TabsContent>

            <TabsContent value='css'>
              <MonacoEditorWrapper
                editorKey='fullscreen-edit-css'
                defaultValue={normalizedValue.css}
                language='css'
                theme={theme}
                options={cssEditorOptions}
                onChange={onCssChange}
                onMount={onFullscreenCssEditorMount}
              />
            </TabsContent>
          </Tabs>
        )}

        {fullscreenMode === "preview" && (
          <PreviewPane
            html={normalizedValue.html}
            css={normalizedValue.css}
            previewRef={previewRef}
            onScroll={onPreviewScroll}
          />
        )}

        {fullscreenMode === "split" && (
          <div className={styles.splitView}>
            <div className={styles.splitPane}>
              <div className={styles.splitPaneHeader}>
                <div className={styles.splitPaneTabs}>
                  <button
                    type='button'
                    onClick={() => onSetActiveEditor("html")}
                    className={`${styles.splitPaneTab} ${activeEditor === "html" ? styles.splitPaneTabActive : ""}`}
                  >
                    {htmlLabel}
                  </button>
                  <button
                    type='button'
                    onClick={() => onSetActiveEditor("css")}
                    className={`${styles.splitPaneTab} ${activeEditor === "css" ? styles.splitPaneTabActive : ""}`}
                  >
                    {cssLabel}
                  </button>
                </div>
                <div className={styles.editorActions}>
                  {activeEditor === "html" && (
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={onFormatHtml}
                      aria-label='Format HTML code (Ctrl+Shift+F)'
                      title='Format HTML code (Ctrl+Shift+F)'
                    >
                      <Wand2 size={18} />
                    </Button>
                  )}
                  {activeEditor === "css" && (
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={onFormatCss}
                      aria-label='Format CSS code (Ctrl+Shift+F)'
                      title='Format CSS code (Ctrl+Shift+F)'
                    >
                      <Wand2 size={18} />
                    </Button>
                  )}
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onSetSyncScroll(!syncScroll)}
                    aria-label={
                      syncScroll ? "Disable scroll sync" : "Enable scroll sync"
                    }
                    title={
                      syncScroll ? "Disable scroll sync" : "Enable scroll sync"
                    }
                    aria-pressed={syncScroll}
                  >
                    {syncScroll ? <Link2 size={18} /> : <Link2Off size={18} />}
                  </Button>
                </div>
              </div>

              <div className={styles.splitPaneEditors}>
                <div
                  className={styles.monacoWrapper}
                  style={{
                    display: activeEditor === "html" ? "flex" : "none",
                  }}
                >
                  <MonacoEditorWrapper
                    editorKey='fullscreen-split-html'
                    defaultValue={normalizedValue.html}
                    language='html'
                    theme={theme}
                    options={htmlEditorOptions}
                    onChange={onHtmlChange}
                    onMount={onFullscreenHtmlEditorMount}
                  />
                </div>
                <div
                  className={styles.monacoWrapper}
                  style={{
                    display: activeEditor === "css" ? "flex" : "none",
                  }}
                >
                  <MonacoEditorWrapper
                    editorKey='fullscreen-split-css'
                    defaultValue={normalizedValue.css}
                    language='css'
                    theme={theme}
                    options={cssEditorOptions}
                    onChange={onCssChange}
                    onMount={onFullscreenCssEditorMount}
                  />
                </div>
              </div>
            </div>

            <div className={styles.splitPane}>
              <PreviewPane
                html={normalizedValue.html}
                css={normalizedValue.css}
                previewRef={previewRef}
                onScroll={onPreviewScroll}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
