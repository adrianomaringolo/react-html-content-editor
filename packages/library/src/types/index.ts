import type { ReactNode } from "react";
import type { CodeEditorComponent } from "../components/code-editor/types";

/**
 * Represents the HTML and CSS content being edited.
 *
 * @example
 * ```tsx
 * const value: ContentValue = {
 *   html: '<h1>Hello World</h1>',
 *   css: 'h1 { color: blue; }'
 * };
 * ```
 */
export interface ContentValue {
  /** The HTML content as a string */
  html: string;
  /** The CSS content as a string */
  css: string;
}

/**
 * Save status state machine representing the current save state.
 *
 * - `saved`: Content has been saved and matches the last saved version
 * - `unsaved`: Content has been modified since last save
 * - `saving`: Save operation is currently in progress
 */
export type SaveStatus = "saved" | "unsaved" | "saving";

/**
 * View mode configuration for the editor.
 *
 * - `edit`: Shows only the editor(s)
 * - `preview`: Shows only the rendered preview
 * - `split`: Shows editor and preview side-by-side
 */
export type ViewMode = "edit" | "preview" | "split";

/**
 * Editor type indicating which editor is currently active.
 *
 * - `html`: HTML editor
 * - `css`: CSS editor
 */
export type EditorType = "html" | "css";

/**
 * Props for the ContentEditor component.
 *
 * @example
 * ```tsx
 * <ContentEditor
 *   value={{ html: '<h1>Hello</h1>', css: 'h1 { color: blue; }' }}
 *   onChange={(value) => setValue(value)}
 *   onSave={async () => await saveToServer()}
 *   theme="vs-dark"
 *   height="600px"
 * />
 * ```
 */
export interface ContentEditorProps {
  /** The current HTML and CSS content (required) */
  value: ContentValue;

  /** Callback fired when content changes in either editor (required) */
  onChange: (value: ContentValue) => void;

  /** Callback fired when user triggers save (Ctrl+S or save button). Should return a Promise. */
  onSave?: () => Promise<void>;

  /** Indicates whether a save operation is in progress */
  isSaving?: boolean;

  /** Custom label for the HTML editor tab (default: "HTML") */
  htmlLabel?: string;

  /** Custom label for the CSS editor tab (default: "CSS") */
  cssLabel?: string;

  /** Additional CSS class name to apply to the root container */
  className?: string;

  /** Height of the editor in normal mode (default: "400px"). Can be a number (pixels) or CSS string. */
  height?: string | number;

  /** Which editor tab should be active by default (default: "html") */
  defaultTab?: EditorType;

  /**
   * Code editor configuration options, merged with the defaults. Follows
   * Monaco's option naming; the built-in textarea editor honours the
   * `fontSize`, `tabSize`, `wordWrap`, `lineNumbers` and `readOnly` subset.
   */
  editorOptions?: Record<string, any>;

  /** Code editor theme (default: "vs-dark") */
  theme?: "vs-dark" | "vs-light";

  /**
   * Code editor implementation for the HTML/CSS panes.
   *
   * Defaults to the dependency-free `TextareaCodeEditor` (line numbers,
   * indentation handling, no syntax highlighting). For the full Monaco
   * experience, install `@monaco-editor/react` + `monaco-editor` and pass
   * `MonacoCodeEditor`:
   *
   * ```tsx
   * import { MonacoCodeEditor } from "react-html-content-editor/monaco";
   *
   * <ContentEditor value={value} onChange={setValue} codeEditor={MonacoCodeEditor} />
   * ```
   */
  codeEditor?: CodeEditorComponent;

  /** Error message to display below the editor */
  error?: string;

  /**
   * When provided, the editor renders in composition mode: the given children
   * (e.g. `ContentEditorToolbar`, `ContentEditorBody`, `ContentEditorCode`,
   * `ContentEditorPreview`, `ContentEditorWysiwyg`) are rendered inside a
   * shared context instead of the default layout.
   */
  children?: ReactNode;

  /**
   * Initial view mode in composition mode: `code` (HTML/CSS + preview) or
   * `wysiwyg` (default: "code").
   */
  defaultMode?: "code" | "wysiwyg";
}
