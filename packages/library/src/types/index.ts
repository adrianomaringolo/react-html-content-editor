/**
 * Represents the HTML and CSS content being edited
 */
export interface ContentValue {
  html: string;
  css: string;
}

/**
 * Save status state machine
 */
export type SaveStatus = "saved" | "unsaved" | "saving";

/**
 * View mode configuration
 */
export type ViewMode = "edit" | "preview" | "split";

/**
 * Editor type
 */
export type EditorType = "html" | "css";

/**
 * Props for the ContentEditor component
 */
export interface ContentEditorProps {
  // Content values
  value: ContentValue;
  onChange: (value: ContentValue) => void;

  // Save functionality
  onSave?: () => Promise<void>;
  isSaving?: boolean;

  // Customization
  htmlLabel?: string;
  cssLabel?: string;
  className?: string;
  height?: string | number;
  defaultTab?: EditorType;

  // Monaco Editor options
  editorOptions?: Record<string, any>;
  theme?: "vs-dark" | "vs-light";

  // Error handling
  error?: string;
}
