import { createContext, useContext } from "react";
import type React from "react";

/**
 * Shared state for the Wysiwyg compound components, provided by the
 * {@link Wysiwyg} root and consumed by every toolbar control and the
 * editable surface.
 */
export interface WysiwygContextValue {
  /** Ref to the contentEditable surface. */
  editorRef: React.RefObject<HTMLDivElement | null>;
  /** Tracks the last HTML we emitted, to avoid caret-resetting re-renders. */
  lastHtmlRef: React.MutableRefObject<string>;
  /** Current HTML value. */
  value: string;
  /** Persist HTML coming from user input into the editor's value. */
  commit: (html: string) => void;
  /** Run a formatting command against the current selection. */
  exec: (command: string, value?: string, useCss?: boolean) => void;
  /** Whether a toggle command is currently active for the selection. */
  isActive: (command: string) => boolean;
  /** Read the resolved value of a command for the selection (e.g. formatBlock). */
  queryValue: (command: string) => string;
  /** Bumped whenever the selection or content changes so controls re-render. */
  version: number;
  /** When true, the whole editor is read-only and controls are disabled. */
  disabled: boolean;
}

export const WysiwygContext = createContext<WysiwygContextValue | undefined>(
  undefined,
);

/**
 * Access the Wysiwyg context. Throws if used outside of {@link Wysiwyg}.
 */
export const useWysiwygContext = (): WysiwygContextValue => {
  const context = useContext(WysiwygContext);
  if (!context) {
    throw new Error("Wysiwyg compound components must be used within <Wysiwyg>");
  }
  return context;
};
