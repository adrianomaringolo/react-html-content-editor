import { createContext, useContext } from "react";
import type { editor } from "monaco-editor";
import type { OnMount } from "@monaco-editor/react";
import type { ContentValue, EditorType } from "../../types";
import type { SaveStatus } from "../../hooks/useAutoSave";

/**
 * View mode of the {@link ContentEditor}.
 *
 * - `code`: Monaco HTML/CSS editors and/or the rendered preview.
 * - `wysiwyg`: rich-text editing surface bound to the HTML value.
 */
export type ContentEditorMode = "code" | "wysiwyg";

/**
 * Shared state for the {@link ContentEditor} compound components, provided by
 * the editor root and consumed by the toolbar, code, preview and wysiwyg
 * panes.
 */
export interface ContentEditorContextValue {
  /** Normalized current HTML and CSS content. */
  value: ContentValue;
  /** Emit a full content change. */
  onChange: (value: ContentValue) => void;
  /** Emit a change to the HTML part only. */
  onHtmlChange: (html: string) => void;
  /** Emit a change to the CSS part only. */
  onCssChange: (css: string) => void;

  /** Trigger a save (bound to the auto-save handler), if `onSave` was provided. */
  onSave?: () => void;
  /** Current save status, or `undefined` when saving is not enabled. */
  saveStatus?: SaveStatus;
  /** Whether there are unsaved changes. */
  hasUnsavedChanges: boolean;
  /** Whether a save is currently in progress. */
  isSaving: boolean;

  /** Active view mode. */
  mode: ContentEditorMode;
  /** Switch the active view mode. */
  setMode: (mode: ContentEditorMode) => void;
  /**
   * Whether a WYSIWYG pane is present. Registered by `ContentEditorWysiwyg`
   * so the toolbar knows whether to render the mode toggle.
   */
  hasWysiwyg: boolean;
  /** Called by `ContentEditorWysiwyg` on mount to advertise its presence. */
  registerWysiwyg: () => void;

  /** Whether the code editors are shown (code mode). */
  showEdit: boolean;
  /** Whether the preview is shown (code mode). */
  showPreview: boolean;
  /** Toggle the code editors. */
  toggleEdit: () => void;
  /** Toggle the preview. */
  togglePreview: () => void;

  /** Which code editor tab is active. */
  activeEditor: EditorType;
  /** Select the active code editor tab. */
  setActiveEditor: (editor: EditorType) => void;

  /** Format the HTML editor content. */
  formatHtml: () => void;
  /** Format the CSS editor content. */
  formatCss: () => void;

  /** Monaco theme. */
  theme: string;
  /** Monaco options for the HTML editor. */
  htmlEditorOptions: Record<string, unknown>;
  /** Monaco options for the CSS editor. */
  cssEditorOptions: Record<string, unknown>;
  /** Label for the HTML editor. */
  htmlLabel: string;
  /** Label for the CSS editor. */
  cssLabel: string;

  /** Ref to the mounted HTML Monaco editor. */
  htmlEditorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  /** Ref to the mounted CSS Monaco editor. */
  cssEditorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  /** Monaco mount handler for the HTML editor. */
  handleHtmlEditorMount: OnMount;
  /** Monaco mount handler for the CSS editor. */
  handleCssEditorMount: OnMount;
}

export const ContentEditorContext = createContext<
  ContentEditorContextValue | undefined
>(undefined);

/**
 * Access the ContentEditor context. Throws if used outside of
 * {@link ContentEditor}.
 */
export const useContentEditorContext = (): ContentEditorContextValue => {
  const context = useContext(ContentEditorContext);
  if (!context) {
    throw new Error(
      "ContentEditor compound components must be used within <ContentEditor>",
    );
  }
  return context;
};
