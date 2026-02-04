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

  /** Monaco Editor configuration options. Merged with default options. */
  editorOptions?: Record<string, any>;

  /** Monaco Editor theme (default: "vs-dark") */
  theme?: "vs-dark" | "vs-light";

  /** Error message to display below the editor */
  error?: string;
}
