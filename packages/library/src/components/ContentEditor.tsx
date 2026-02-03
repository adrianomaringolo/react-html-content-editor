import { useState, useRef, useEffect } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import {
  Maximize2,
  X,
  Monitor,
  Code,
  Columns,
  Wand2,
  Check,
  AlertCircle,
  Loader2,
  Save,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";
import { Button } from "./Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./Dialog";
import { useAutoSave } from "../hooks/useAutoSave";
import { useScrollSync } from "../hooks/useScrollSync";
import type { ContentEditorProps, EditorType } from "../types";
import type { SaveStatus } from "../hooks/useAutoSave";
import styles from "./content-editor.module.css";

/**
 * SaveStatusIndicator component displays the current save status
 */
function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  return (
    <div
      className={`${styles.saveStatus} ${styles[status]}`}
      aria-live='polite'
      aria-atomic='true'
    >
      {status === "saved" && (
        <>
          <Check size={16} aria-hidden='true' />
          <span>Saved</span>
        </>
      )}
      {status === "unsaved" && (
        <>
          <AlertCircle size={16} aria-hidden='true' />
          <span>Unsaved changes</span>
        </>
      )}
      {status === "saving" && (
        <>
          <Loader2 size={16} className={styles.spinner} aria-hidden='true' />
          <span>Saving...</span>
        </>
      )}
    </div>
  );
}

/**
 * ContentEditor component provides a sophisticated HTML and CSS editor
 * with Monaco Editor integration, multiple view modes, and auto-save functionality.
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
  // View state
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [activeEditor, setActiveEditor] = useState<EditorType>(defaultTab);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState<
    "edit" | "preview" | "split"
  >("edit");

  // Sync state
  const [syncScroll, setSyncScroll] = useState(true);

  // Dialog state for unsaved changes confirmation
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  // Editor refs
  const htmlEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const cssEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const fullscreenButtonRef = useRef<HTMLButtonElement | null>(null);

  // Use auto-save hook to track unsaved changes and save status
  const { savedValue, saveStatus, hasUnsavedChanges, handleSave } = useAutoSave(
    {
      value: normalizedValue,
      onSave,
      isSaving,
    },
  );

  // Use scroll sync hook for split view
  const activeEditorRef =
    activeEditor === "html" ? htmlEditorRef : cssEditorRef;
  const { handleEditorScroll, handlePreviewScroll } = useScrollSync({
    editorRef: activeEditorRef,
    previewRef,
    enabled: syncScroll && isFullscreen && fullscreenMode === "split",
  });

  // Set up editor scroll listener
  useEffect(() => {
    if (!activeEditorRef.current || !syncScroll || fullscreenMode !== "split")
      return;

    const disposable = activeEditorRef.current.onDidScrollChange(() => {
      handleEditorScroll();
    });

    return () => disposable.dispose();
  }, [handleEditorScroll, syncScroll, fullscreenMode, activeEditorRef]);

  // Monaco editor mount handlers
  const handleHtmlEditorMount: OnMount = (editor) => {
    htmlEditorRef.current = editor;
  };

  const handleCssEditorMount: OnMount = (editor) => {
    cssEditorRef.current = editor;
  };

  // Content change handlers
  const handleHtmlChange = (newHtml: string | undefined) => {
    onChange({ ...normalizedValue, html: newHtml ?? "" });
  };

  const handleCssChange = (newCss: string | undefined) => {
    onChange({ ...normalizedValue, css: newCss ?? "" });
  };

  // Format handlers
  const handleFormatHtml = () => {
    htmlEditorRef.current?.getAction("editor.action.formatDocument")?.run();
  };

  const handleFormatCss = () => {
    cssEditorRef.current?.getAction("editor.action.formatDocument")?.run();
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
      const activeRef = activeEditor === "html" ? htmlEditorRef : cssEditorRef;
      activeRef.current?.focus();
    }
  }, [fullscreenMode, activeEditor, isFullscreen]);

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

  // Preview pane component
  const PreviewPane = () => {
    const hasContent =
      normalizedValue.html.trim() || normalizedValue.css.trim();

    if (!hasContent) {
      return (
        <div
          ref={previewRef}
          className={styles.previewContainer}
          onScroll={handlePreviewScroll}
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
        className={styles.previewContainer}
        onScroll={handlePreviewScroll}
      >
        {normalizedValue.css && <style>{normalizedValue.css}</style>}
        <div
          className='content-preview'
          dangerouslySetInnerHTML={{ __html: normalizedValue.html }}
        />
      </div>
    );
  };

  // Fullscreen overlay component
  const FullscreenOverlay = () => {
    return (
      <div className={styles.fullscreenOverlay}>
        <div className={styles.fullscreenHeader}>
          <div className={styles.fullscreenModeButtons}>
            <Button
              variant={fullscreenMode === "edit" ? "default" : "ghost"}
              size='sm'
              onClick={() => setFullscreenMode("edit")}
              aria-label='Edit mode'
            >
              <Code size={16} />
              <span>Edit</span>
            </Button>
            <Button
              variant={fullscreenMode === "preview" ? "default" : "ghost"}
              size='sm'
              onClick={() => setFullscreenMode("preview")}
              aria-label='Preview mode'
            >
              <Monitor size={16} />
              <span>Preview</span>
            </Button>
            <Button
              variant={fullscreenMode === "split" ? "default" : "ghost"}
              size='sm'
              onClick={() => setFullscreenMode("split")}
              aria-label='Split view mode'
            >
              <Columns size={16} />
              <span>Split</span>
            </Button>
          </div>

          <Button
            variant='ghost'
            size='sm'
            onClick={handleCloseFullscreen}
            aria-label='Close fullscreen'
          >
            <X size={20} />
          </Button>
        </div>

        <div className={styles.fullscreenContent}>
          {fullscreenMode === "edit" && (
            <Tabs
              value={activeEditor}
              onValueChange={(val) => setActiveEditor(val as EditorType)}
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
                      size='sm'
                      onClick={handleFormatHtml}
                      aria-label='Format HTML code'
                    >
                      <Wand2 size={16} />
                      <span>Format</span>
                    </Button>
                  )}
                  {activeEditor === "css" && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={handleFormatCss}
                      aria-label='Format CSS code'
                    >
                      <Wand2 size={16} />
                      <span>Format</span>
                    </Button>
                  )}
                </div>
              </div>

              <TabsContent value='html'>
                <Editor
                  value={normalizedValue.html}
                  onChange={handleHtmlChange}
                  onMount={handleHtmlEditorMount}
                  options={htmlEditorOptions}
                  theme={theme}
                  language='html'
                />
              </TabsContent>

              <TabsContent value='css'>
                <Editor
                  value={normalizedValue.css}
                  onChange={handleCssChange}
                  onMount={handleCssEditorMount}
                  options={cssEditorOptions}
                  theme={theme}
                  language='css'
                />
              </TabsContent>
            </Tabs>
          )}

          {fullscreenMode === "preview" && <PreviewPane />}

          {fullscreenMode === "split" && (
            <div className={styles.splitView}>
              <div className={styles.splitPane}>
                <Tabs
                  value={activeEditor}
                  onValueChange={(val) => setActiveEditor(val as EditorType)}
                >
                  <div className={styles.splitPaneHeader}>
                    <TabsList>
                      <TabsTrigger value='html'>{htmlLabel}</TabsTrigger>
                      <TabsTrigger value='css'>{cssLabel}</TabsTrigger>
                    </TabsList>
                    <div className={styles.editorActions}>
                      {activeEditor === "html" && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={handleFormatHtml}
                          aria-label='Format HTML code'
                        >
                          <Wand2 size={16} />
                          <span>Format</span>
                        </Button>
                      )}
                      {activeEditor === "css" && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={handleFormatCss}
                          aria-label='Format CSS code'
                        >
                          <Wand2 size={16} />
                          <span>Format</span>
                        </Button>
                      )}
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setSyncScroll(!syncScroll)}
                        aria-label={
                          syncScroll
                            ? "Disable scroll sync"
                            : "Enable scroll sync"
                        }
                        aria-pressed={syncScroll}
                      >
                        {syncScroll ? "Sync: On" : "Sync: Off"}
                      </Button>
                    </div>
                  </div>

                  <TabsContent value='html'>
                    <Editor
                      value={normalizedValue.html}
                      onChange={handleHtmlChange}
                      onMount={handleHtmlEditorMount}
                      options={htmlEditorOptions}
                      theme={theme}
                      language='html'
                    />
                  </TabsContent>

                  <TabsContent value='css'>
                    <Editor
                      value={normalizedValue.css}
                      onChange={handleCssChange}
                      onMount={handleCssEditorMount}
                      options={cssEditorOptions}
                      theme={theme}
                      language='css'
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className={styles.splitPane}>
                <PreviewPane />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`${styles.editorContainer} ${className} ${error ? styles.hasError : ""}`}
        style={containerStyle}
      >
        {/* Toolbar with save status and actions */}
        <div className={styles.editorToolbar}>
          {onSave && <SaveStatusIndicator status={saveStatus} />}
          {onSave && (
            <Button
              variant='default'
              size='sm'
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              aria-label='Save content'
            >
              <Save size={16} />
              <span>Save</span>
            </Button>
          )}
          {activeTab === "edit" && activeEditor === "html" && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleFormatHtml}
              aria-label='Format HTML code'
            >
              <Wand2 size={16} />
              <span>Format HTML</span>
            </Button>
          )}
          {activeTab === "edit" && activeEditor === "css" && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleFormatCss}
              aria-label='Format CSS code'
            >
              <Wand2 size={16} />
              <span>Format CSS</span>
            </Button>
          )}
          <Button
            variant='ghost'
            size='sm'
            onClick={handleOpenFullscreen}
            aria-label='Open fullscreen'
            ref={fullscreenButtonRef}
          >
            <Maximize2 size={16} />
            <span>Fullscreen</span>
          </Button>
        </div>

        {/* Main tabs for edit/preview mode */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "edit" | "preview")}
        >
          <TabsList>
            <TabsTrigger value='edit'>Edit</TabsTrigger>
            <TabsTrigger value='preview'>Preview</TabsTrigger>
          </TabsList>

          <TabsContent value='edit'>
            {/* Editor tabs for HTML/CSS */}
            <Tabs
              value={activeEditor}
              onValueChange={(val) => setActiveEditor(val as EditorType)}
            >
              <TabsList>
                <TabsTrigger value='html'>{htmlLabel}</TabsTrigger>
                <TabsTrigger value='css'>{cssLabel}</TabsTrigger>
              </TabsList>

              <TabsContent value='html'>
                <Editor
                  value={normalizedValue.html}
                  onChange={handleHtmlChange}
                  onMount={handleHtmlEditorMount}
                  options={htmlEditorOptions}
                  theme={theme}
                  language='html'
                />
              </TabsContent>

              <TabsContent value='css'>
                <Editor
                  value={normalizedValue.css}
                  onChange={handleCssChange}
                  onMount={handleCssEditorMount}
                  options={cssEditorOptions}
                  theme={theme}
                  language='css'
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value='preview'>
            <PreviewPane />
          </TabsContent>
        </Tabs>

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
      {isFullscreen && <FullscreenOverlay />}

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
