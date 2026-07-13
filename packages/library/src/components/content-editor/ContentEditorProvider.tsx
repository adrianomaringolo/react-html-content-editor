import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { editor } from "monaco-editor";
import type { OnMount } from "@monaco-editor/react";
import { useAutoSave } from "../../hooks/useAutoSave";
import type { ContentValue, EditorType } from "../../types";
import {
  ContentEditorContext,
  type ContentEditorContextValue,
  type ContentEditorMode,
} from "./context";

export interface ContentEditorProviderProps {
  value: ContentValue;
  onChange: (value: ContentValue) => void;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  htmlLabel?: string;
  cssLabel?: string;
  defaultTab?: EditorType;
  editorOptions?: Record<string, unknown>;
  theme?: "vs-dark" | "vs-light";
  /** Initial view mode (default: "code"). */
  defaultMode?: ContentEditorMode;
  /**
   * Marks a WYSIWYG surface as available even before a `ContentEditorWysiwyg`
   * pane registers itself. Used by the default (non-composed) layout.
   */
  forceHasWysiwyg?: boolean;
  children: React.ReactNode;
}

/**
 * Holds all shared state for the ContentEditor compound components and exposes
 * it through {@link ContentEditorContext}. Renders no DOM of its own.
 */
export function ContentEditorProvider({
  value,
  onChange,
  onSave,
  isSaving = false,
  htmlLabel = "HTML",
  cssLabel = "CSS",
  defaultTab = "html",
  editorOptions = {},
  theme = "vs-dark",
  defaultMode = "code",
  forceHasWysiwyg = false,
  children,
}: ContentEditorProviderProps) {
  // Normalize value to handle null/undefined.
  const normalizedValue: ContentValue = {
    html: value?.html ?? "",
    css: value?.css ?? "",
  };

  // Keep the latest value in a ref so change handlers stay stable.
  const valueRef = useRef(normalizedValue);
  useEffect(() => {
    valueRef.current = normalizedValue;
  });

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // View state.
  const [mode, setMode] = useState<ContentEditorMode>(defaultMode);
  const [hasWysiwyg, setHasWysiwyg] = useState(forceHasWysiwyg);
  const [showEdit, setShowEdit] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [activeEditor, setActiveEditor] = useState<EditorType>(defaultTab);

  // Editor refs.
  const htmlEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const cssEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const { saveStatus, hasUnsavedChanges, handleSave } = useAutoSave({
    value: normalizedValue,
    onSave,
    isSaving,
  });

  const onHtmlChange = useCallback((html: string) => {
    onChangeRef.current({ ...valueRef.current, html });
  }, []);

  const onCssChange = useCallback((css: string) => {
    onChangeRef.current({ ...valueRef.current, css });
  }, []);

  const registerWysiwyg = useCallback(() => setHasWysiwyg(true), []);

  const toggleEdit = useCallback(() => {
    // If only edit is visible, hand off to preview instead of hiding both.
    if (showEdit && !showPreview) {
      setShowEdit(false);
      setShowPreview(true);
    } else {
      setShowEdit((v) => !v);
    }
  }, [showEdit, showPreview]);

  const togglePreview = useCallback(() => {
    if (showPreview && !showEdit) {
      setShowPreview(false);
      setShowEdit(true);
    } else {
      setShowPreview((v) => !v);
    }
  }, [showEdit, showPreview]);

  const handleHtmlEditorMount = useCallback<OnMount>((editorInstance) => {
    htmlEditorRef.current = editorInstance;
  }, []);

  const handleCssEditorMount = useCallback<OnMount>((editorInstance) => {
    cssEditorRef.current = editorInstance;
  }, []);

  const formatHtml = useCallback(() => {
    htmlEditorRef.current?.getAction("editor.action.formatDocument")?.run();
  }, []);

  const formatCss = useCallback(() => {
    cssEditorRef.current?.getAction("editor.action.formatDocument")?.run();
  }, []);

  const defaultEditorOptions: Record<string, unknown> = {
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

  const htmlEditorOptions = { ...defaultEditorOptions, language: "html" };
  const cssEditorOptions = { ...defaultEditorOptions, language: "css" };

  const boundSave = onSave ? handleSave : undefined;

  const contextValue = useMemo<ContentEditorContextValue>(
    () => ({
      value: normalizedValue,
      onChange,
      onHtmlChange,
      onCssChange,
      onSave: boundSave,
      saveStatus: onSave ? saveStatus : undefined,
      hasUnsavedChanges,
      isSaving,
      mode,
      setMode,
      hasWysiwyg,
      registerWysiwyg,
      showEdit,
      showPreview,
      toggleEdit,
      togglePreview,
      activeEditor,
      setActiveEditor,
      formatHtml,
      formatCss,
      theme,
      htmlEditorOptions,
      cssEditorOptions,
      htmlLabel,
      cssLabel,
      htmlEditorRef,
      cssEditorRef,
      handleHtmlEditorMount,
      handleCssEditorMount,
    }),
    // normalizedValue / options are recreated each render; depend on their
    // primitive parts to avoid needless context churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      normalizedValue.html,
      normalizedValue.css,
      onChange,
      onHtmlChange,
      onCssChange,
      boundSave,
      onSave,
      saveStatus,
      hasUnsavedChanges,
      isSaving,
      mode,
      hasWysiwyg,
      registerWysiwyg,
      showEdit,
      showPreview,
      toggleEdit,
      togglePreview,
      activeEditor,
      formatHtml,
      formatCss,
      theme,
      htmlLabel,
      cssLabel,
    ],
  );

  return (
    <ContentEditorContext.Provider value={contextValue}>
      {children}
    </ContentEditorContext.Provider>
  );
}
