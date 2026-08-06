import { createContext, useContext } from "react";
import type {
  CodeEditorComponent,
  CodeEditorHandle,
} from "../code-editor/types";
import type { ContentValue, EditorType } from "../../types";
import type { SaveStatus } from "../../hooks/useAutoSave";

/**
 * View mode of the {@link ContentEditor}.
 *
 * - `code`: HTML/CSS code editors and/or the rendered preview.
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

  /** Format the HTML editor content. No-op when the editor cannot format. */
  formatHtml: () => void;
  /** Format the CSS editor content. No-op when the editor cannot format. */
  formatCss: () => void;
  /**
   * Whether the active code editor implementation can reformat documents.
   * `false` for the default {@link TextareaCodeEditor}; toolbars use it to hide
   * the Format action.
   */
  canFormat: boolean;

  /** Editor theme (`"vs-dark"` / `"vs-light"`). */
  theme: string;
  /** Options for the HTML code editor. */
  htmlEditorOptions: Record<string, unknown>;
  /** Options for the CSS code editor. */
  cssEditorOptions: Record<string, unknown>;
  /** Label for the HTML editor. */
  htmlLabel: string;
  /** Label for the CSS editor. */
  cssLabel: string;

  /**
   * Code editor implementation to render in the code panes. Defaults to
   * {@link TextareaCodeEditor}; pass `MonacoCodeEditor` from
   * `react-html-content-editor/monaco` for the Monaco experience.
   */
  codeEditor: CodeEditorComponent;

  /** Handle of the mounted HTML code editor, or `null` before mount. */
  htmlEditorRef: React.MutableRefObject<CodeEditorHandle | null>;
  /** Handle of the mounted CSS code editor, or `null` before mount. */
  cssEditorRef: React.MutableRefObject<CodeEditorHandle | null>;
  /** Receives the HTML editor handle on mount, and `null` on unmount. */
  handleHtmlEditorReady: (handle: CodeEditorHandle | null) => void;
  /** Receives the CSS editor handle on mount, and `null` on unmount. */
  handleCssEditorReady: (handle: CodeEditorHandle | null) => void;
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
