import { useState, useRef, useEffect } from "react";
import type { editor } from "monaco-editor";
import { OnMount } from "@monaco-editor/react";
import { AlertCircle } from "lucide-react";
import { Button } from "./Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./Dialog";
import { EditorToolbar } from "./EditorToolbar";
import { MonacoEditorWrapper } from "./MonacoEditorWrapper";
import { PreviewPane } from "./PreviewPane";
import { FullscreenOverlay } from "./FullscreenOverlay";
import { useAutoSave } from "../hooks/useAutoSave";
import type { ContentEditorProps, EditorType, ContentValue } from "../types";
import styles from "./content-editor.module.css";

/**
 * ContentEditor component provides a sophisticated HTML and CSS editor
 * with Monaco Editor integration, multiple view modes, and auto-save functionality.
 *
 * @component
 * @example
 * ```tsx
 * import { ContentEditor } from 'react-html-content-editor';
 *
 * function App() {
 *   const [value, setValue] = useState({
 *     html: '<h1>Hello World</h1>',
 *     css: 'h1 { color: blue; }'
 *   });
 *
 *   return (
 *     <ContentEditor
 *       value={value}
 *       onChange={setValue}
 *       onSave={async () => await saveToServer(value)}
 *       theme="vs-dark"
 *     />
 *   );
 * }
 * ```
 *
 * @param {ContentEditorProps} props - Component props
 * @returns {JSX.Element} The rendered ContentEditor component
 */
export function ContentEditor({
  value,
  onChange,
  onSave,
  isSaving = false,
  htmlLabel = "HTML",
  cssLabel = "CSS",
  className = "",
  height = "400px",
  defaultTab = "html",
  editorOptions = {},
  theme = "vs-dark",
  error,
}: ContentEditorProps) {
  // Normalize value to handle null/undefined
  const normalizedValue: ContentValue = {
    html: value?.html ?? "",
    css: value?.css ?? "",
  };

  // Use ref to store current value to avoid recreating handlers
  const valueRef = useRef(normalizedValue);
  useEffect(() => {
    valueRef.current = normalizedValue;
  });

  // View state
  const [showEdit, setShowEdit] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [activeEditor, setActiveEditor] = useState<EditorType>(defaultTab);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState<
    "edit" | "preview" | "split"
  >("edit");

  // Sync state
  const [syncScroll, setSyncScroll] = useState(true);

  // Dialog state for unsaved changes confirmation
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  // Editor refs - SEPARATE refs for normal and fullscreen editors
  const htmlEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const cssEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const fullscreenHtmlEditorRef = useRef<editor.IStandaloneCodeEditor | null>(
    null,
  );
  const fullscreenCssEditorRef = useRef<editor.IStandaloneCodeEditor | null>(
    null,
  );
  const previewRef = useRef<HTMLDivElement | null>(null);
  const fullscreenButtonRef = useRef<HTMLButtonElement | null>(null);
  const isScrollingSyncRef = useRef(false);

  // Use auto-save hook to track unsaved changes and save status
  const { saveStatus, hasUnsavedChanges, handleSave } = useAutoSave({
    value: normalizedValue,
    onSave,
    isSaving,
  });

  // Monaco editor mount handlers for normal view
  const handleHtmlEditorMount: OnMount = (editor) => {
    htmlEditorRef.current = editor;
  };

  const handleCssEditorMount: OnMount = (editor) => {
    cssEditorRef.current = editor;
  };

  // Monaco editor mount handlers for fullscreen view
  const handleFullscreenHtmlEditorMount: OnMount = (editor) => {
    fullscreenHtmlEditorRef.current = editor;

    // Setup scroll sync for HTML editor only
    editor.onDidScrollChange(() => {
      if (
        !syncScroll ||
        isScrollingSyncRef.current ||
        !previewRef.current ||
        fullscreenMode !== "split" ||
        activeEditor !== "html" // Only sync when HTML editor is active
      )
        return;

      const scrollTop = editor.getScrollTop();
      const scrollHeight = editor.getScrollHeight();
      const clientHeight = editor.getLayoutInfo().height;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 0) return;

      const scrollPercent = scrollTop / maxScroll;
      const previewMaxScroll =
        previewRef.current.scrollHeight - previewRef.current.clientHeight;

      isScrollingSyncRef.current = true;
      previewRef.current.scrollTop = scrollPercent * previewMaxScroll;
      requestAnimationFrame(() => {
        isScrollingSyncRef.current = false;
      });
    });
  };

  const handleFullscreenCssEditorMount: OnMount = (editor) => {
    fullscreenCssEditorRef.current = editor;
    // No scroll sync for CSS editor
  };

  // Preview scroll handler - only sync with HTML editor
  const handlePreviewScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (
      !syncScroll ||
      isScrollingSyncRef.current ||
      fullscreenMode !== "split" ||
      activeEditor !== "html" // Only sync when HTML editor is active
    )
      return;

    const activeRef = fullscreenHtmlEditorRef;
    if (!activeRef.current) return;

    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const maxScroll = target.scrollHeight - target.clientHeight;

    if (maxScroll <= 0) return;

    const scrollPercent = scrollTop / maxScroll;
    const editorMaxScroll =
      activeRef.current.getScrollHeight() -
      activeRef.current.getLayoutInfo().height;

    isScrollingSyncRef.current = true;
    activeRef.current.setScrollTop(scrollPercent * editorMaxScroll);
    requestAnimationFrame(() => {
      isScrollingSyncRef.current = false;
    });
  };

  // Content change handlers - use refs to avoid recreating on every change
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleHtmlChange = (newHtml: string | undefined) => {
    const currentValue = valueRef.current;
    onChangeRef.current({ ...currentValue, html: newHtml ?? "" });
  };

  const handleCssChange = (newCss: string | undefined) => {
    const currentValue = valueRef.current;
    onChangeRef.current({ ...currentValue, css: newCss ?? "" });
  };

  // View mode toggle handlers
  const handleToggleEdit = () => {
    if (showEdit && !showPreview) {
      // If only edit is shown, turn it off and show preview
      setShowEdit(false);
      setShowPreview(true);
    } else {
      // Toggle edit mode
      setShowEdit(!showEdit);
    }
  };

  const handleTogglePreview = () => {
    if (showPreview && !showEdit) {
      // If only preview is shown, turn it off and show edit
      setShowPreview(false);
      setShowEdit(true);
    } else {
      // Toggle preview mode
      setShowPreview(!showPreview);
    }
  };

  const handleToggleHtml = () => {
    setActiveEditor("html");
  };

  const handleToggleCss = () => {
    setActiveEditor("css");
  };

  // Determine current view mode based on toggles
  const currentViewMode: "edit" | "preview" | "split" =
    showEdit && showPreview ? "split" : showEdit ? "edit" : "preview";

  // Format handlers
  const handleFormatHtml = () => {
    const ref = isFullscreen ? fullscreenHtmlEditorRef : htmlEditorRef;
    ref.current?.getAction("editor.action.formatDocument")?.run();
  };

  const handleFormatCss = () => {
    const ref = isFullscreen ? fullscreenCssEditorRef : cssEditorRef;
    ref.current?.getAction("editor.action.formatDocument")?.run();
  };

  // Fullscreen handlers
  const handleOpenFullscreen = () => {
    setIsFullscreen(true);
    setFullscreenMode("edit");
  };

  const handleCloseFullscreen = () => {
    if (hasUnsavedChanges) {
      setShowCloseDialog(true);
    } else {
      setIsFullscreen(false);
    }
  };

  const handleConfirmClose = () => {
    setShowCloseDialog(false);
    setIsFullscreen(false);
  };

  const handleCancelClose = () => {
    setShowCloseDialog(false);
  };

  // Focus management when entering/exiting fullscreen
  useEffect(() => {
    if (isFullscreen) {
      // Focus will be managed by the fullscreen overlay
    } else {
      // Return focus to fullscreen button when exiting fullscreen
      fullscreenButtonRef.current?.focus();
    }
  }, [isFullscreen]);

  // Focus management when switching modes in fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    // Focus the active editor when switching to edit mode
    if (fullscreenMode === "edit" || fullscreenMode === "split") {
      const activeRef =
        activeEditor === "html"
          ? fullscreenHtmlEditorRef
          : fullscreenCssEditorRef;
      activeRef.current?.focus();
    }
  }, [fullscreenMode, activeEditor, isFullscreen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + S: Save
      if (ctrlOrCmd && e.key === "s") {
        e.preventDefault();
        if (onSave && hasUnsavedChanges && !isSaving) {
          handleSave();
        }
      }

      // Ctrl/Cmd + Shift + F: Format
      if (ctrlOrCmd && e.shiftKey && e.key === "F") {
        e.preventDefault();
        if (showEdit) {
          if (activeEditor === "html") {
            handleFormatHtml();
          } else {
            handleFormatCss();
          }
        }
      }

      // Ctrl/Cmd + Shift + M: Toggle fullscreen
      if (ctrlOrCmd && e.shiftKey && e.key === "M") {
        e.preventDefault();
        if (isFullscreen) {
          handleCloseFullscreen();
        } else {
          handleOpenFullscreen();
        }
      }

      // Escape: Close fullscreen
      if (e.key === "Escape" && isFullscreen) {
        e.preventDefault();
        handleCloseFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    onSave,
    hasUnsavedChanges,
    isSaving,
    handleSave,
    showEdit,
    activeEditor,
    handleFormatHtml,
    handleFormatCss,
    isFullscreen,
    handleOpenFullscreen,
    handleCloseFullscreen,
  ]);

  // Default Monaco options
  const defaultEditorOptions: any = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: "on",
    wordWrap: "on",
    autoClosingBrackets: "always",
    autoClosingQuotes: "always",
    formatOnPaste: true,
    formatOnType: true,
    tabSize: 2,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    ...editorOptions,
  };

  const htmlEditorOptions: any = {
    ...defaultEditorOptions,
    language: "html",
  };

  const cssEditorOptions: any = {
    ...defaultEditorOptions,
    language: "css",
  };

  const containerStyle = {
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <>
      <div
        className={`${styles.editorContainer} ${className} ${error ? styles.hasError : ""}`}
        style={containerStyle}
      >
        {/* Toolbar with save status and actions */}
        <EditorToolbar
          showEdit={showEdit}
          showPreview={showPreview}
          activeEditor={activeEditor}
          saveStatus={onSave ? saveStatus : undefined}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          onSave={onSave ? handleSave : undefined}
          onToggleEdit={handleToggleEdit}
          onTogglePreview={handleTogglePreview}
          onToggleHtml={handleToggleHtml}
          onToggleCss={handleToggleCss}
          onFormatHtml={handleFormatHtml}
          onFormatCss={handleFormatCss}
          onOpenFullscreen={handleOpenFullscreen}
          fullscreenButtonRef={fullscreenButtonRef}
        />

        {/* Content area based on view mode */}
        <div className={styles.editorContent}>
          {currentViewMode === "split" && (
            <div className={styles.splitView}>
              <div className={styles.splitPane}>
                <div className={styles.editorWrapper}>
                  <div
                    className={styles.monacoWrapper}
                    style={{
                      display: activeEditor === "html" ? "flex" : "none",
                    }}
                  >
                    <MonacoEditorWrapper
                      editorKey='normal-html'
                      defaultValue={normalizedValue.html}
                      language='html'
                      theme={theme}
                      options={htmlEditorOptions}
                      onChange={handleHtmlChange}
                      onMount={handleHtmlEditorMount}
                    />
                  </div>

                  <div
                    className={styles.monacoWrapper}
                    style={{
                      display: activeEditor === "css" ? "flex" : "none",
                    }}
                  >
                    <MonacoEditorWrapper
                      editorKey='normal-css'
                      defaultValue={normalizedValue.css}
                      language='css'
                      theme={theme}
                      options={cssEditorOptions}
                      onChange={handleCssChange}
                      onMount={handleCssEditorMount}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.splitPane}>
                <PreviewPane
                  html={normalizedValue.html}
                  css={normalizedValue.css}
                />
              </div>
            </div>
          )}

          {currentViewMode === "edit" && (
            <div className={styles.editorWrapper}>
              <div
                className={styles.monacoWrapper}
                style={{
                  display: activeEditor === "html" ? "flex" : "none",
                }}
              >
                <MonacoEditorWrapper
                  editorKey='normal-html'
                  defaultValue={normalizedValue.html}
                  language='html'
                  theme={theme}
                  options={htmlEditorOptions}
                  onChange={handleHtmlChange}
                  onMount={handleHtmlEditorMount}
                />
              </div>

              <div
                className={styles.monacoWrapper}
                style={{
                  display: activeEditor === "css" ? "flex" : "none",
                }}
              >
                <MonacoEditorWrapper
                  editorKey='normal-css'
                  defaultValue={normalizedValue.css}
                  language='css'
                  theme={theme}
                  options={cssEditorOptions}
                  onChange={handleCssChange}
                  onMount={handleCssEditorMount}
                />
              </div>
            </div>
          )}

          {currentViewMode === "preview" && (
            <PreviewPane
              html={normalizedValue.html}
              css={normalizedValue.css}
            />
          )}
        </div>
        {error && (
          <div className={styles.errorMessage} role='alert'>
            <AlertCircle
              size={16}
              className={styles.errorIcon}
              aria-hidden='true'
            />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <FullscreenOverlay
          fullscreenMode={fullscreenMode}
          activeEditor={activeEditor}
          normalizedValue={normalizedValue}
          htmlLabel={htmlLabel}
          cssLabel={cssLabel}
          theme={theme}
          htmlEditorOptions={htmlEditorOptions}
          cssEditorOptions={cssEditorOptions}
          syncScroll={syncScroll}
          saveStatus={onSave ? saveStatus : undefined}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          previewRef={previewRef}
          onSave={onSave ? handleSave : undefined}
          onSetFullscreenMode={setFullscreenMode}
          onSetActiveEditor={setActiveEditor}
          onSetSyncScroll={setSyncScroll}
          onCloseFullscreen={handleCloseFullscreen}
          onFormatHtml={handleFormatHtml}
          onFormatCss={handleFormatCss}
          onHtmlChange={handleHtmlChange}
          onCssChange={handleCssChange}
          onFullscreenHtmlEditorMount={handleFullscreenHtmlEditorMount}
          onFullscreenCssEditorMount={handleFullscreenCssEditorMount}
          onPreviewScroll={handlePreviewScroll}
        />
      )}

      {/* Unsaved changes confirmation dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to close
              fullscreen mode? Your changes will not be lost, but they are not
              saved yet.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={handleCancelClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirmClose}>Close Anyway</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
